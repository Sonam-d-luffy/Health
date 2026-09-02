import cv2
import mediapipe as mp
import numpy as np
import pickle
from collections import deque


# ============================================================
# MEDIAPIPE
# ============================================================

mp_pose = mp.solutions.pose
mp_draw = mp.solutions.drawing_utils


# ============================================================
# ANGLE
# ============================================================

def calculate_angle(a, b, c):

    a = np.array(a, dtype=np.float32)
    b = np.array(b, dtype=np.float32)
    c = np.array(c, dtype=np.float32)

    ba = a - b
    bc = c - b

    denominator = (
        np.linalg.norm(ba) *
        np.linalg.norm(bc)
    )

    if denominator == 0:
        return 0.0

    cosine = np.dot(ba, bc) / denominator
    cosine = np.clip(cosine, -1.0, 1.0)

    return float(
        np.degrees(
            np.arccos(cosine)
        )
    )


# ============================================================
# REP COUNTER
# ============================================================

class RepCounter:
    def __init__(self):
        self.reps = 0
        self.stage = "DOWN"
        self.angle_history = deque(maxlen=5)
        self.last_rep_frame = -100

    def update(self, angle, frame_number):

        if angle <= 0:
            return

        # Smooth the angle
        self.angle_history.append(angle)
        smooth_angle = float(np.mean(self.angle_history))

        # DEBUG
        # print(
        #     f"Frame={frame_number} "
        #     f"Angle={smooth_angle:.1f} "
        #     f"Stage={self.stage} "
        #     f"Reps={self.reps}"
        # )

        # CURL POSITION
        if smooth_angle < 100:
            self.stage = "UP"

        # EXTENDED POSITION
        elif smooth_angle > 130 and self.stage == "UP":

            if frame_number - self.last_rep_frame > 10:

                self.reps += 1
                self.last_rep_frame = frame_number
                self.stage = "DOWN"

                # print(
                #     "================================"
                # )
                # print(
                #     f"REP COUNTED -> {self.reps}"
                # )
                # print(
                #     f"Angle -> {smooth_angle:.1f}"
                # )
                # print(
                #     "================================"
                # )


# ============================================================
# UI FUNCTIONS
# ============================================================

def rounded_box(
    image,
    x1,
    y1,
    x2,
    y2,
    radius=20,
    thickness=-1
):

    overlay = image.copy()

    cv2.rectangle(
        overlay,
        (x1 + radius, y1),
        (x2 - radius, y2),
        (20, 25, 35),
        thickness
    )

    cv2.rectangle(
        overlay,
        (x1, y1 + radius),
        (x2, y2 - radius),
        (20, 25, 35),
        thickness
    )

    cv2.circle(
        overlay,
        (x1 + radius, y1 + radius),
        radius,
        (20, 25, 35),
        thickness
    )

    cv2.circle(
        overlay,
        (x2 - radius, y1 + radius),
        radius,
        (20, 25, 35),
        thickness
    )

    cv2.circle(
        overlay,
        (x1 + radius, y2 - radius),
        radius,
        (20, 25, 35),
        thickness
    )

    cv2.circle(
        overlay,
        (x2 - radius, y2 - radius),
        radius,
        (20, 25, 35),
        thickness
    )

    cv2.addWeighted(
        overlay,
        0.82,
        image,
        0.18,
        0,
        image
    )


def put_text(
    image,
    text,
    position,
    size=0.7,
    thickness=2,
    color=(255, 255, 255)
):

    cv2.putText(
        image,
        text,
        position,
        cv2.FONT_HERSHEY_DUPLEX,
        size,
        color,
        thickness,
        cv2.LINE_AA
    )


# ============================================================
# EXERCISE DETECTOR
# ============================================================

class ExerciseDetector:

    def __init__(self):

        # ----------------------------------------------------
        # MODEL
        # ----------------------------------------------------

        with open(
            "exercise_model.pkl",
            "rb"
        ) as f:

            self.model = pickle.load(f)

        # print("Model loaded successfully")

        # print(
        #     "Features:",
        #     self.model.feature_names_in_
        # )

        # print(
        #     "Classes:",
        #     self.model.classes_
        # )


        # ----------------------------------------------------
        # MEDIAPIPE
        # ----------------------------------------------------

        self.pose = mp_pose.Pose(
            static_image_mode=False,
            model_complexity=1,
            smooth_landmarks=True,
            min_detection_confidence=0.5,
            min_tracking_confidence=0.5
        )


        # ----------------------------------------------------
        # COUNTERS
        # ----------------------------------------------------

        self.left_counter = RepCounter()

        self.right_counter = RepCounter()


        # ----------------------------------------------------
        # PREDICTION SMOOTHING
        # ----------------------------------------------------

        self.prediction_history = deque(
            maxlen=5
        )


        # ----------------------------------------------------
        # FRAME NUMBER
        # ----------------------------------------------------

        self.frame_number = 0


    # ========================================================
    # PROCESS FRAME
    # ========================================================

    def process(self, frame):

        self.frame_number += 1


        # ====================================================
        # MIRROR
        # ====================================================

        frame = cv2.flip(
            frame,
            1
        )


        # ====================================================
        # RESIZE
        # ====================================================

        frame = cv2.resize(
            frame,
            (1280, 720)
        )


        display = frame.copy()


        # ====================================================
        # DARK GRADIENT OVERLAY
        # ====================================================

        overlay = display.copy()

        cv2.rectangle(
            overlay,
            (0, 0),
            (1280, 720),
            (10, 14, 22),
            -1
        )

        cv2.addWeighted(
            overlay,
            0.18,
            display,
            0.82,
            0,
            display
        )


        # ====================================================
        # MEDIAPIPE
        # ====================================================

        rgb = cv2.cvtColor(
            frame,
            cv2.COLOR_BGR2RGB
        )

        results = self.pose.process(
            rgb
        )


        # ====================================================
        # DEFAULT
        # ====================================================

        prediction = "NO EXERCISE"

        confidence = 0.0

        left_angle = 0.0

        right_angle = 0.0


        # ====================================================
        # BODY DETECTED
        # ====================================================

        if results.pose_landmarks:

            landmarks = (
                results.pose_landmarks.landmark
            )


            # ------------------------------------------------
            # LANDMARKS
            # ------------------------------------------------

            LS = landmarks[
                mp_pose.PoseLandmark.LEFT_SHOULDER
            ]

            RS = landmarks[
                mp_pose.PoseLandmark.RIGHT_SHOULDER
            ]

            LE = landmarks[
                mp_pose.PoseLandmark.LEFT_ELBOW
            ]

            RE = landmarks[
                mp_pose.PoseLandmark.RIGHT_ELBOW
            ]

            LW = landmarks[
                mp_pose.PoseLandmark.LEFT_WRIST
            ]

            RW = landmarks[
                mp_pose.PoseLandmark.RIGHT_WRIST
            ]

            LH = landmarks[
                mp_pose.PoseLandmark.LEFT_HIP
            ]

            RH = landmarks[
                mp_pose.PoseLandmark.RIGHT_HIP
            ]

            LK = landmarks[
                mp_pose.PoseLandmark.LEFT_KNEE
            ]

            RK = landmarks[
                mp_pose.PoseLandmark.RIGHT_KNEE
            ]

            LA = landmarks[
                mp_pose.PoseLandmark.LEFT_ANKLE
            ]

            RA = landmarks[
                mp_pose.PoseLandmark.RIGHT_ANKLE
            ]


            # ------------------------------------------------
            # POINT FUNCTION
            # ------------------------------------------------

            def point(lm):

                return [
                    lm.x,
                    lm.y,
                    lm.z
                ]


            LS_p = point(LS)
            RS_p = point(RS)

            LE_p = point(LE)
            RE_p = point(RE)

            LW_p = point(LW)
            RW_p = point(RW)

            LH_p = point(LH)
            RH_p = point(RH)

            LK_p = point(LK)
            RK_p = point(RK)

            LA_p = point(LA)
            RA_p = point(RA)


            # =================================================
            # ANGLES
            # =================================================

            left_angle = calculate_angle(
                LS_p,
                LE_p,
                LW_p
            )

            right_angle = calculate_angle(
                RS_p,
                RE_p,
                RW_p
            )


            # =================================================
            # DRAW SKELETON
            # =================================================

            mp_draw.draw_landmarks(
                display,
                results.pose_landmarks,
                mp_pose.POSE_CONNECTIONS,
                mp_draw.DrawingSpec(
                    color=(80, 230, 255),
                    thickness=3,
                    circle_radius=4
                ),
                mp_draw.DrawingSpec(
                    color=(255, 120, 60),
                    thickness=3
                )
            )


            # =================================================
            # NORMALIZATION
            # =================================================

            LS_np = np.array(LS_p)
            RS_np = np.array(RS_p)

            LE_np = np.array(LE_p)
            RE_np = np.array(RE_p)

            LW_np = np.array(LW_p)
            RW_np = np.array(RW_p)

            LH_np = np.array(LH_p)
            RH_np = np.array(RH_p)

            LK_np = np.array(LK_p)
            RK_np = np.array(RK_p)

            LA_np = np.array(LA_p)
            RA_np = np.array(RA_p)


            # =================================================
            # HIP CENTER
            # =================================================

            hip_center = (
                LH_np +
                RH_np
            ) / 2


            # =================================================
            # SHOULDER DISTANCE
            # =================================================

            shoulder_distance = np.linalg.norm(
                LS_np -
                RS_np
            )

            if shoulder_distance < 0.001:

                shoulder_distance = 0.001


            # =================================================
            # NORMALIZE
            # =================================================

            def normalize(p):

                return (
                    p -
                    hip_center
                ) / shoulder_distance


            LS_n = normalize(LS_np)
            RS_n = normalize(RS_np)

            LE_n = normalize(LE_np)
            RE_n = normalize(RE_np)

            LW_n = normalize(LW_np)
            RW_n = normalize(RW_np)

            LH_n = normalize(LH_np)
            RH_n = normalize(RH_np)

            LK_n = normalize(LK_np)
            RK_n = normalize(RK_np)

            LA_n = normalize(LA_np)
            RA_n = normalize(RA_np)


            # =================================================
            # FEATURES
            # =================================================

            left_elbow_feature = calculate_angle(
                LS_n,
                LE_n,
                LW_n
            )

            right_elbow_feature = calculate_angle(
                RS_n,
                RE_n,
                RW_n
            )

            left_knee_feature = calculate_angle(
                LH_n,
                LK_n,
                LA_n
            )

            right_knee_feature = calculate_angle(
                RH_n,
                RK_n,
                RA_n
            )

            shoulder_feature = np.linalg.norm(
                LS_n -
                RS_n
            )

            left_arm_length = (
                np.linalg.norm(
                    LS_n -
                    LE_n
                )
                +
                np.linalg.norm(
                    LE_n -
                    LW_n
                )
            )

            right_arm_length = (
                np.linalg.norm(
                    RS_n -
                    RE_n
                )
                +
                np.linalg.norm(
                    RE_n -
                    RW_n
                )
            )


            features = [[
                left_elbow_feature,
                right_elbow_feature,
                left_knee_feature,
                right_knee_feature,
                shoulder_feature,
                left_arm_length,
                right_arm_length
            ]]


            # =================================================
            # MODEL
            # =================================================

            try:

                probabilities = (
                    self.model.predict_proba(
                        features
                    )[0]
                )

                index = np.argmax(
                    probabilities
                )

                current_prediction = (
                    self.model.classes_[index]
                )

                current_confidence = (
                    probabilities[index]
                )


                self.prediction_history.append(
                    current_prediction
                )


                counts = {}

                for p in self.prediction_history:

                    counts[p] = (
                        counts.get(
                            p,
                            0
                        ) + 1
                    )


                prediction = max(
                    counts,
                    key=counts.get
                )

                confidence = float(
                    current_confidence
                )


            except Exception as e:

                # print(
                #     "Model prediction error:",
                #     e
                # )

                prediction = "MODEL ERROR"

                confidence = 0.0


            # =================================================
            # REP COUNTING
            # =================================================

            self.left_counter.update(
                left_angle,
                self.frame_number
            )

            self.right_counter.update(
                right_angle,
                self.frame_number
            )


        # ====================================================
        # TOTAL
        # ====================================================

        total_reps = (
            self.left_counter.reps +
            self.right_counter.reps
        )


        # ====================================================
        # HEADER
        # ====================================================

        put_text(
            display,
            "AI FITNESS",
            (35, 50),
            1.0,
            3,
            (80, 230, 255)
        )

        put_text(
            display,
            "VISION",
            (35, 82),
            0.65,
            2,
            (255, 255, 255)
        )

        put_text(
            display,
            "LIVE WORKOUT",
            (1040, 48),
            0.55,
            2,
            (80, 230, 255)
        )


        # ====================================================
        # TOTAL REP CARD
        # ====================================================

        rounded_box(
            display,
            430,
            25,
            850,
            165,
            25
        )

        put_text(
            display,
            "TOTAL REPS",
            (535, 65),
            0.55,
            2,
            (180, 190, 200)
        )

        put_text(
            display,
            str(total_reps),
            (585, 145),
            2.4,
            5,
            (80, 230, 255)
        )


        # ====================================================
        # LEFT CARD
        # ====================================================

        rounded_box(
            display,
            30,
            465,
            350,
            680,
            25
        )

        put_text(
            display,
            "LEFT ARM",
            (60, 505),
            0.7,
            2,
            (255, 255, 255)
        )

        put_text(
            display,
            str(self.left_counter.reps),
            (65, 580),
            2.0,
            4,
            (80, 230, 255)
        )

        put_text(
            display,
            "REPS",
            (70, 615),
            0.5,
            2,
            (170, 180, 190)
        )

        put_text(
            display,
            f"ANGLE  {left_angle:.0f}°",
            (60, 655),
            0.55,
            2,
            (255, 255, 255)
        )

        put_text(
            display,
            f"STATUS  {self.left_counter.stage}",
            (60, 675),
            0.5,
            2,
            (80, 230, 255)
        )


        # ====================================================
        # RIGHT CARD
        # ====================================================

        rounded_box(
            display,
            900,
            465,
            1250,
            680,
            25
        )

        put_text(
            display,
            "RIGHT ARM",
            (930, 505),
            0.7,
            2,
            (255, 255, 255)
        )

        put_text(
            display,
            str(self.right_counter.reps),
            (935, 580),
            2.0,
            4,
            (255, 140, 80)
        )

        put_text(
            display,
            "REPS",
            (940, 615),
            0.5,
            2,
            (170, 180, 190)
        )

        put_text(
            display,
            f"ANGLE  {right_angle:.0f}°",
            (930, 655),
            0.55,
            2,
            (255, 255, 255)
        )

        put_text(
            display,
            f"STATUS  {self.right_counter.stage}",
            (930, 675),
            0.5,
            2,
            (255, 140, 80)
        )


        # ====================================================
        # CENTER STATUS
        # ====================================================

        rounded_box(
            display,
            405,
            485,
            875,
            640,
            25
        )

        put_text(
            display,
            "EXERCISE DETECTED",
            (465, 525),
            0.5,
            2,
            (170, 180, 190)
        )


        exercise_name = str(
            prediction
        ).replace(
            "_",
            " "
        ).upper()


        put_text(
            display,
            exercise_name,
            (465, 570),
            0.8,
            3,
            (255, 255, 255)
        )


        # ====================================================
        # CONFIDENCE BAR
        # ====================================================

        bar_x = 465
        bar_y = 595

        bar_width = 340
        bar_height = 15


        cv2.rectangle(
            display,
            (
                bar_x,
                bar_y
            ),
            (
                bar_x +
                bar_width,
                bar_y +
                bar_height
            ),
            (50, 55, 65),
            -1
        )


        confidence_width = int(
            bar_width *
            min(
                confidence,
                1.0
            )
        )


        cv2.rectangle(
            display,
            (
                bar_x,
                bar_y
            ),
            (
                bar_x +
                confidence_width,
                bar_y +
                bar_height
            ),
            (80, 230, 255),
            -1
        )


        put_text(
            display,
            f"{confidence * 100:.0f}% CONFIDENCE",
            (465, 625),
            0.45,
            1,
            (180, 190, 200)
        )


        # ====================================================
        # FOOTER
        # ====================================================

        put_text(
            display,
            "AI MOTION TRACKING",
            (35, 705),
            0.45,
            1,
            (130, 140, 150)
        )

        put_text(
            display,
            "LIVE",
            (1160, 705),
            0.45,
            1,
            (130, 140, 150)
        )


        # ====================================================
        # RETURN
        # ====================================================

        result = {

            "exercise": str(
                prediction
            ),

            "confidence": float(
                confidence
            ),

            "reps": int(
                total_reps
            ),

            "left_reps": int(
                self.left_counter.reps
            ),

            "right_reps": int(
                self.right_counter.reps
            ),

            "left_angle": round(
                float(left_angle),
                2
            ),

            "right_angle": round(
                float(right_angle),
                2
            ),

            "left_stage": (
                self.left_counter.stage
            ),

            "right_stage": (
                self.right_counter.stage
            )
        }


        return result, display


    # ========================================================
    # CLEANUP
    # ========================================================

    def close(self):

        self.pose.close()