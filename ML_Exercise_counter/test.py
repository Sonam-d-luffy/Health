import cv2
import mediapipe as mp

print("OpenCV:", cv2.__version__)
print("MediaPipe:", mp.__version__)

mp_pose = mp.solutions.pose
pose = mp_pose.Pose()

print("Pose initialized successfully!")

