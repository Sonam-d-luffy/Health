import cv2
import mediapipe as mp
import math
from collections import deque

mp_pose = mp.solutions.pose
mp_drawing = mp.solutions.drawing_utils

pose = mp_pose.Pose(
    static_image_mode=False,
    model_complexity=1,
    enable_segmentation=False,
    min_detection_confidence=0.7,
    min_tracking_confidence=0.7
)

def calculate_angle(a, b, c):
    radians = math.atan2(c[1] - b[1], c[0] - b[0]) - \
              math.atan2(a[1] - b[1], a[0] - b[0])

    angle = abs(math.degrees(radians))

    if angle > 180:
        angle = 360 - angle

    return angle


cap = cv2.VideoCapture(0)

counter = 0
stage = "down"

angle_history = deque(maxlen=7)

# Store starting shoulder position
initial_shoulder_x = None
initial_shoulder_y = None

# Frames required before accepting a movement
up_frames = 0
down_frames = 0

while cap.isOpened():

    success, frame = cap.read()

    if not success:
        print("Camera could not be accessed")
        break

    rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    results = pose.process(rgb_frame)

    if results.pose_landmarks:

        landmarks = results.pose_landmarks.landmark

        shoulder = landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER]
        elbow = landmarks[mp_pose.PoseLandmark.LEFT_ELBOW]
        wrist = landmarks[mp_pose.PoseLandmark.LEFT_WRIST]

        if (
            shoulder.visibility > 0.8 and
            elbow.visibility > 0.8 and
            wrist.visibility > 0.8
        ):

            shoulder_point = [shoulder.x, shoulder.y]
            elbow_point = [elbow.x, elbow.y]
            wrist_point = [wrist.x, wrist.y]

            angle = calculate_angle(
                shoulder_point,
                elbow_point,
                wrist_point
            )

            angle_history.append(angle)

            smooth_angle = sum(angle_history) / len(angle_history)

            # --------------------------------
            # INITIAL SHOULDER POSITION
            # --------------------------------

            if initial_shoulder_x is None:
                initial_shoulder_x = shoulder.x
                initial_shoulder_y = shoulder.y

            shoulder_movement = math.sqrt(
                (shoulder.x - initial_shoulder_x) ** 2 +
                (shoulder.y - initial_shoulder_y) ** 2
            )

            # --------------------------------
            # ELBOW POSITION CHECK
            # --------------------------------

            elbow_shoulder_distance = math.sqrt(
                (elbow.x - shoulder.x) ** 2 +
                (elbow.y - shoulder.y) ** 2
            )

            # --------------------------------
            # CURL DETECTION
            # --------------------------------

            valid_position = (
                shoulder_movement < 0.12 and
                elbow_shoulder_distance > 0.10
            )

            if valid_position:

                # Arm is bent
                if smooth_angle < 65:

                    up_frames += 1
                    down_frames = 0

                    if up_frames >= 5 and stage == "down":
                        stage = "up"

                # Arm is straight
                elif smooth_angle > 155:

                    down_frames += 1
                    up_frames = 0

                    if down_frames >= 5 and stage == "up":
                        stage = "down"
                        counter += 1

                else:
                    up_frames = 0
                    down_frames = 0

            # --------------------------------
            # DRAW LANDMARKS
            # --------------------------------

            mp_drawing.draw_landmarks(
                frame,
                results.pose_landmarks,
                mp_pose.POSE_CONNECTIONS
            )

            # --------------------------------
            # DISPLAY INFORMATION
            # --------------------------------

            cv2.putText(
                frame,
                f"Angle: {int(smooth_angle)}",
                (20, 40),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.8,
                (0, 255, 0),
                2
            )

            cv2.putText(
                frame,
                f"Reps: {counter}",
                (20, 80),
                cv2.FONT_HERSHEY_SIMPLEX,
                1,
                (255, 0, 0),
                3
            )

            cv2.putText(
                frame,
                f"Stage: {stage}",
                (20, 120),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.8,
                (0, 0, 255),
                2
            )

            cv2.putText(
                frame,
                f"Shoulder movement: {shoulder_movement:.3f}",
                (20, 160),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.6,
                (255, 255, 255),
                2
            )

            if not valid_position:

                cv2.putText(
                    frame,
                    "KEEP BODY STABLE",
                    (20, 200),
                    cv2.FONT_HERSHEY_SIMPLEX,
                    0.7,
                    (0, 0, 255),
                    2
                )

    cv2.imshow("AI Bicep Curl Counter", frame)

    if cv2.waitKey(1) & 0xFF == ord("q"):
        break


cap.release()
cv2.destroyAllWindows()