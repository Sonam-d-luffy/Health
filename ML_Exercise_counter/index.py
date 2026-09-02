from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
import cv2
import numpy as np

from detector import ExerciseDetector


app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {
        "message": "AI Fitness Backend Running"
    }


@app.websocket("/ws/fitness")
async def fitness_socket(
    websocket: WebSocket
):

    await websocket.accept()

    detector = ExerciseDetector()

    try:

        while True:

            data = await websocket.receive_bytes()

            frame = cv2.imdecode(
                np.frombuffer(
                    data,
                    np.uint8
                ),
                cv2.IMREAD_COLOR
            )

            if frame is None:
                continue

            result, annotated_frame = (
                detector.process(frame)
            )

            await websocket.send_json({
                "type": "result",
                **result
            })

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

    except Exception:

        pass

    finally:

        detector.close()