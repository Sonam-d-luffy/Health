import cv2
import mediapipe as mp
import numpy as np
import csv
import os

mp_pose = mp.solutions.pose
mp_drawing = mp.solutions.drawing_utils

pose = mp_pose.Pose(
    model_complexity=1,
    min_detection_confidence=0.7,
    min_tracking_confidence=0.7
)

FILE_NAME = "exercise_dataset.csv"

# -----------------------------
# Calculate angle
# -----------------------------
def calculate_angle(a, b, c):
    ba = a - b
    bc = c - b

    denominator = np.linalg.norm(ba) * np.linalg.norm(bc)

    if denominator == 0:
        return 0

    cosine = np.dot(ba, bc) / denominator
    cosine = np.clip(cosine, -1.0, 1.0)

    return np.degrees(np.arccos(cosine))


# -----------------------------
# Distance
# -----------------------------
def calculate_distance(a, b):
    return np.linalg.norm(a - b)


# -----------------------------
# Create CSV
# -----------------------------
if not os.path.exists(FILE_NAME):

    with open(FILE_NAME, "w", newline="") as file:

        writer = csv.writer(file)

        writer.writerow([
            "label",
            "left_elbow",
            "right_elbow",
            "left_knee",
            "right_knee",
            "shoulder_distance",
            "left_arm_length",
            "right_arm_length"
        ])


# -----------------------------
# Webcam
# -----------------------------
cap = cv2.VideoCapture(0)

current_label = "no_exercise"

print("\n================================")
print("EXERCISE DATA COLLECTION")
print("================================")
print("B = Bicep Curl")
print("S = Side Movement")
print("N = No Exercise")
print("Q = Quit")
print("================================\n")


while cap.isOpened():

    ret, frame = cap.read()

    if not ret:
        print("Camera not working")
        break

    frame = cv2.flip(frame, 1)

    rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

    results = pose.process(rgb)

    if results.pose_landmarks:

        landmarks = results.pose_landmarks.landmark

        # Convert landmarks to numpy arrays
        left_shoulder = np.array([
            landmarks[11].x,
            landmarks[11].y,
            landmarks[11].z
        ])

        right_shoulder = np.array([
            landmarks[12].x,
            landmarks[12].y,
            landmarks[12].z
        ])

        left_elbow_point = np.array([
            landmarks[13].x,
            landmarks[13].y,
            landmarks[13].z
        ])

        right_elbow_point = np.array([
            landmarks[14].x,
            landmarks[14].y,
            landmarks[14].z
        ])

        left_wrist = np.array([
            landmarks[15].x,
            landmarks[15].y,
            landmarks[15].z
        ])

        right_wrist = np.array([
            landmarks[16].x,
            landmarks[16].y,
            landmarks[16].z
        ])

        left_hip = np.array([
            landmarks[23].x,
            landmarks[23].y,
            landmarks[23].z
        ])

        right_hip = np.array([
            landmarks[24].x,
            landmarks[24].y,
            landmarks[24].z
        ])

        left_knee_point = np.array([
            landmarks[25].x,
            landmarks[25].y,
            landmarks[25].z
        ])

        right_knee_point = np.array([
            landmarks[26].x,
            landmarks[26].y,
            landmarks[26].z
        ])

        left_ankle = np.array([
            landmarks[27].x,
            landmarks[27].y,
            landmarks[27].z
        ])

        right_ankle = np.array([
            landmarks[28].x,
            landmarks[28].y,
            landmarks[28].z
        ])

        # -----------------------------
        # Calculate features
        # -----------------------------

        left_elbow = calculate_angle(
            left_shoulder,
            left_elbow_point,
            left_wrist
        )

        right_elbow = calculate_angle(
            right_shoulder,
            right_elbow_point,
            right_wrist
        )

        left_knee = calculate_angle(
            left_hip,
            left_knee_point,
            left_ankle
        )

        right_knee = calculate_angle(
            right_hip,
            right_knee_point,
            right_ankle
        )

        shoulder_distance = calculate_distance(
            left_shoulder,
            right_shoulder
        )

        left_arm_length = (
            calculate_distance(left_shoulder, left_elbow_point)
            +
            calculate_distance(left_elbow_point, left_wrist)
        )

        right_arm_length = (
            calculate_distance(right_shoulder, right_elbow_point)
            +
            calculate_distance(right_elbow_point, right_wrist)
        )

        # -----------------------------
        # Save data
        # -----------------------------

        row = [
            current_label,
            round(left_elbow, 2),
            round(right_elbow, 2),
            round(left_knee, 2),
            round(right_knee, 2),
            round(shoulder_distance, 4),
            round(left_arm_length, 4),
            round(right_arm_length, 4)
        ]

        with open(FILE_NAME, "a", newline="") as file:

            writer = csv.writer(file)
            writer.writerow(row)

        # Draw landmarks
        mp_drawing.draw_landmarks(
            frame,
            results.pose_landmarks,
            mp_pose.POSE_CONNECTIONS
        )

        # Display values
        cv2.putText(
            frame,
            f"Label: {current_label}",
            (20, 35),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.8,
            (0, 255, 0),
            2
        )

        cv2.putText(
            frame,
            f"L Elbow: {left_elbow:.1f}",
            (20, 70),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.6,
            (255, 255, 255),
            2
        )

        cv2.putText(
            frame,
            f"R Elbow: {right_elbow:.1f}",
            (20, 100),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.6,
            (255, 255, 255),
            2
        )

    else:

        cv2.putText(
            frame,
            "No Pose Detected",
            (20, 40),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.8,
            (0, 0, 255),
            2
        )

    cv2.imshow("Exercise Data Collection", frame)

    key = cv2.waitKey(1) & 0xFF

    if key == ord("b"):
        current_label = "bicep_curl"
        print("Collecting: BICEP CURL")

    elif key == ord("s"):
        current_label = "side_movement"
        print("Collecting: SIDE MOVEMENT")

    elif key == ord("n"):
        current_label = "no_exercise"
        print("Collecting: NO EXERCISE")

    elif key == ord("q"):
        break


cap.release()
cv2.destroyAllWindows()
pose.close()

print("\nData collection finished!")
print("Dataset:", FILE_NAME)