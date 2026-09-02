import cv2
import mediapipe as mp
import numpy as np
import csv
import os

mp_pose = mp.solutions.pose
mp_drawing = mp.solutions.drawing_utils

pose = mp_pose.Pose(
    static_image_mode=False,
    model_complexity=1,
    min_detection_confidence=0.7,
    min_tracking_confidence=0.7
)

CSV_FILE = "exercise_dataset.csv"

FEATURE_NAMES = [
    "left_elbow",
    "right_elbow",
    "left_knee",
    "right_knee",
    "shoulder_distance",
    "left_arm_length",
    "right_arm_length"
]


def calculate_angle(a, b, c):

    ba = a - b
    bc = c - b

    denominator = (
        np.linalg.norm(ba) *
        np.linalg.norm(bc)
    )

    if denominator == 0:
        return 0

    cosine = np.dot(ba, bc) / denominator
    cosine = np.clip(cosine, -1.0, 1.0)

    return np.degrees(np.arccos(cosine))


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


def extract_features(points):

    left_elbow = calculate_angle(
        points[11],
        points[13],
        points[15]
    )

    right_elbow = calculate_angle(
        points[12],
        points[14],
        points[16]
    )

    left_knee = calculate_angle(
        points[23],
        points[25],
        points[27]
    )

    right_knee = calculate_angle(
        points[24],
        points[26],
        points[28]
    )

    shoulder_distance = np.linalg.norm(
        points[11] - points[12]
    )

    left_arm_length = (
        np.linalg.norm(points[11] - points[13])
        + np.linalg.norm(points[13] - points[15])
    )

    right_arm_length = (
        np.linalg.norm(points[12] - points[14])
        + np.linalg.norm(points[14] - points[16])
    )

    return [
        left_elbow,
        right_elbow,
        left_knee,
        right_knee,
        shoulder_distance,
        left_arm_length,
        right_arm_length
    ]


# Create CSV file if it doesn't exist

if not os.path.exists(CSV_FILE):

    with open(
        CSV_FILE,
        "w",
        newline=""
    ) as file:

        writer = csv.writer(file)

        writer.writerow(
            ["label"] + FEATURE_NAMES
        )


cap = cv2.VideoCapture(0)

current_label = None

print()
print("===================================")
print("       EXERCISE DATA COLLECTOR")
print("===================================")
print()
print("B = Bicep Curl")
print("S = Side Movement")
print("N = No Exercise")
print("Q = Quit")
print()


while cap.isOpened():

    success, frame = cap.read()

    if not success:
        print("Camera error")
        break

    rgb_frame = cv2.cvtColor(
        frame,
        cv2.COLOR_BGR2RGB
    )

    results = pose.process(rgb_frame)

    if results.pose_landmarks:

        landmarks = results.pose_landmarks.landmark

        required = [
            11, 12, 13, 14, 15, 16,
            23, 24, 25, 26, 27, 28
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

            if current_label is not None:

                with open(
                    CSV_FILE,
                    "a",
                    newline=""
                ) as file:

                    writer = csv.writer(file)

                    writer.writerow(
                        [current_label] + features
                    )

            mp_drawing.draw_landmarks(
                frame,
                results.pose_landmarks,
                mp_pose.POSE_CONNECTIONS
            )

    # Display current collection mode

    if current_label:

        text = f"COLLECTING: {current_label}"

        cv2.putText(
            frame,
            text,
            (20, 40),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.8,
            (0, 255, 0),
            2
        )

    else:

        cv2.putText(
            frame,
            "Press B / S / N",
            (20, 40),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.8,
            (0, 255, 255),
            2
        )

    cv2.imshow(
        "Exercise Dataset Collector",
        frame
    )

    key = cv2.waitKey(1) & 0xFF

    if key == ord("b"):

        current_label = "bicep_curl"
        print("Collecting BICEP CURL data")

    elif key == ord("s"):

        current_label = "side_movement"
        print("Collecting SIDE MOVEMENT data")

    elif key == ord("n"):

        current_label = "no_exercise"
        print("Collecting NO EXERCISE data")

    elif key == ord("q"):

        break


cap.release()
cv2.destroyAllWindows()

print()
print("Dataset saved to:")
print(CSV_FILE)