import cv2
import mediapipe as mp
import numpy as np
import math
from collections import deque

mp_pose = mp.solutions.pose
mp_drawing = mp.solutions.drawing_utils

pose = mp_pose.Pose(
    static_image_mode=False,
    model_complexity=1,
    min_detection_confidence=0.7,
    min_tracking_confidence=0.7
)


def normalize_landmarks(landmarks):

    points = np.array([
        [lm.x, lm.y, lm.z]
        for lm in landmarks
    ])

    hip_center = (points[23] + points[24]) / 2

    points = points - hip_center

    shoulder_width = np.linalg.norm(
        points[11] - points[12]
    )

    if shoulder_width > 0:
        points = points / shoulder_width

    return points


def calculate_angle(a, b, c):

    ba = a - b
    bc = c - b

    denominator = (
        np.linalg.norm(ba) *
        np.linalg.norm(bc)
    )

    if denominator == 0:
        return 0

    cosine_angle = np.dot(ba, bc) / denominator

    cosine_angle = np.clip(
        cosine_angle,
        -1.0,
        1.0
    )

    return np.degrees(
        np.arccos(cosine_angle)
    )


def extract_features(points):

    left_elbow_angle = calculate_angle(
        points[11],
        points[13],
        points[15]
    )

    right_elbow_angle = calculate_angle(
        points[12],
        points[14],
        points[16]
    )

    left_knee_angle = calculate_angle(
        points[23],
        points[25],
        points[27]
    )

    right_knee_angle = calculate_angle(
        points[24],
        points[26],
        points[28]
    )

    shoulder_distance = np.linalg.norm(
        points[11] - points[12]
    )

    left_arm_length = (
        np.linalg.norm(points[11] - points[13]) +
        np.linalg.norm(points[13] - points[15])
    )

    right_arm_length = (
        np.linalg.norm(points[12] - points[14]) +
        np.linalg.norm(points[14] - points[16])
    )

    return np.array([
        left_elbow_angle,
        right_elbow_angle,
        left_knee_angle,
        right_knee_angle,
        shoulder_distance,
        left_arm_length,
        right_arm_length
    ])


def classify_movement(features):

    left_elbow = features[0]
    right_elbow = features[1]

    if left_elbow < 70 and right_elbow > 120:
        return "LEFT CURL"

    if right_elbow < 70 and left_elbow > 120:
        return "RIGHT CURL"

    if left_elbow < 80 and right_elbow < 80:
        return "BOTH ARMS"

    return "NO EXERCISE"


cap = cv2.VideoCapture(0)

left_counter = 0
right_counter = 0

left_stage = "down"
right_stage = "down"

left_angle_history = deque(maxlen=7)
right_angle_history = deque(maxlen=7)


while cap.isOpened():

    success, frame = cap.read()

    if not success:
        print("Camera could not be accessed")
        break

    rgb_frame = cv2.cvtColor(
        frame,
        cv2.COLOR_BGR2RGB
    )

    results = pose.process(rgb_frame)

    if results.pose_landmarks:

        landmarks = results.pose_landmarks.landmark

        # Check visibility

        required = [
            mp_pose.PoseLandmark.LEFT_SHOULDER,
            mp_pose.PoseLandmark.LEFT_ELBOW,
            mp_pose.PoseLandmark.LEFT_WRIST,
            mp_pose.PoseLandmark.RIGHT_SHOULDER,
            mp_pose.PoseLandmark.RIGHT_ELBOW,
            mp_pose.PoseLandmark.RIGHT_WRIST
        ]

        visible = all(
            landmarks[i].visibility > 0.7
            for i in required
        )

        if visible:

            points = normalize_landmarks(
                landmarks
            )

            features = extract_features(
                points
            )

            left_angle = features[0]
            right_angle = features[1]

            left_angle_history.append(left_angle)
            right_angle_history.append(right_angle)

            smooth_left = sum(
                left_angle_history
            ) / len(left_angle_history)

            smooth_right = sum(
                right_angle_history
            ) / len(right_angle_history)

            movement = classify_movement(
                features
            )

            # ---------------------------
            # LEFT ARM REP
            # ---------------------------

            if smooth_left > 150:
                left_stage = "down"

            elif (
                smooth_left < 70
                and left_stage == "down"
            ):
                left_stage = "up"

            elif (
                smooth_left > 140
                and left_stage == "up"
            ):
                left_stage = "down"
                left_counter += 1

            # ---------------------------
            # RIGHT ARM REP
            # ---------------------------

            if smooth_right > 150:
                right_stage = "down"

            elif (
                smooth_right < 70
                and right_stage == "down"
            ):
                right_stage = "up"

            elif (
                smooth_right > 140
                and right_stage == "up"
            ):
                right_stage = "down"
                right_counter += 1

            # Draw landmarks

            mp_drawing.draw_landmarks(
                frame,
                results.pose_landmarks,
                mp_pose.POSE_CONNECTIONS
            )

            # Display

            cv2.putText(
                frame,
                f"Left Angle: {int(smooth_left)}",
                (20, 40),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.7,
                (0, 255, 0),
                2
            )

            cv2.putText(
                frame,
                f"Right Angle: {int(smooth_right)}",
                (20, 75),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.7,
                (0, 255, 0),
                2
            )

            cv2.putText(
                frame,
                f"Left Reps: {left_counter}",
                (20, 115),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.8,
                (255, 0, 0),
                2
            )

            cv2.putText(
                frame,
                f"Right Reps: {right_counter}",
                (20, 155),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.8,
                (255, 0, 0),
                2
            )

            cv2.putText(
                frame,
                f"Movement: {movement}",
                (20, 195),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.7,
                (0, 255, 255),
                2
            )

    cv2.imshow(
        "AI Exercise Detection",
        frame
    )

    if cv2.waitKey(1) & 0xFF == ord("q"):
        break


cap.release()
cv2.destroyAllWindows()