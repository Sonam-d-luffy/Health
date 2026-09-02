from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware

import cv2
import numpy as np
import json

from detector import ExerciseDetector


# ============================================================
# APP
# ============================================================

app = FastAPI()


# ============================================================
# CORS
# ============================================================

app.add_middleware(
    CORSMiddleware,

    allow_origins=["*"],

    allow_credentials=True,

    allow_methods=["*"],

    allow_headers=["*"],
)


# ============================================================
# ROOT
# ============================================================

@app.get("/")
def root():

    return {
        "message": "AI Fitness Backend Running"
    }


# ============================================================
# WEBSOCKET
# ============================================================
@app.websocket("/ws/fitness")
async def fitness_socket(websocket: WebSocket):

    await websocket.accept()

    detector = ExerciseDetector()

    print("AI WebSocket connected")

    try:

        while True:

            data = await websocket.receive_bytes()

            frame = cv2.imdecode(
                np.frombuffer(data, np.uint8),
                cv2.IMREAD_COLOR
            )

            if frame is None:
                continue

            # IMPORTANT
            result, annotated_frame = detector.process(frame)

            # Send JSON
            await websocket.send_json({
                "type": "result",
                **result
            })

            # Send annotated image
            ok, buffer = cv2.imencode(
                ".jpg",
                annotated_frame,
                [
                    cv2.IMWRITE_JPEG_QUALITY,
                    75
                ]
            )

            if ok:
                await websocket.send_bytes(
                    buffer.tobytes()
                )

    except Exception as e:

        print(
            "WebSocket closed:",
            e
        )

    finally:

        detector.close()