import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import Layout from "../Components/Layout";
import { useCurrentUser } from "../Context/CurrentUserContext";

const FitnessTrainer = () => {
  // ============================================================
  // REFS
  // ============================================================

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const processedImageRef = useRef(null);

  const streamRef = useRef(null);
  const timerRef = useRef(null);
  const wsRef = useRef(null);
  const frameIntervalRef = useRef(null);

  // ============================================================
  // STATE
  // ============================================================

  const [isRecording, setIsRecording] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);

  const [reps, setReps] = useState(0);
  const [leftReps, setLeftReps] = useState(0);
  const [rightReps, setRightReps] = useState(0);

  const [exercise, setExercise] = useState("Waiting...");
  const [confidence, setConfidence] = useState(0);

  const [leftAngle, setLeftAngle] = useState(0);
  const [rightAngle, setRightAngle] = useState(0);

  const [leftStage, setLeftStage] = useState("DOWN");
  const [rightStage, setRightStage] = useState("DOWN");

  const [error, setError] = useState("");

  // ============================================================
  // USER
  // ============================================================

  const {currentUser} = useCurrentUser();

  const userId = currentUser?._id || currentUser?.id;

  // ============================================================
  // ENV
  // ============================================================

  const API_URL =
    import.meta.env.VITE_BACKEND_URL 

  const AI_URL =
    import.meta.env.VITE_AI_URL ||
    "http://localhost:8000";


  const startCamera = async () => {
    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error(
          "Camera access is not supported by this browser."
        );
      }

      const stream =
        await navigator.mediaDevices.getUserMedia({
          video: {
            width: 640,
            height: 480,
            facingMode: "user",
          },
          audio: false,
        });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;

        await videoRef.current.play();
      }

      console.log("Camera started");
    } catch (err) {
      console.error("Camera error:", err);

      throw new Error(
        "Unable to access camera. Please allow camera permission."
      );
    }
  };

  // ============================================================
  // STOP CAMERA
  // ============================================================

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        track.stop();
      });

      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  // ============================================================
  // SEND FRAME TO AI
  // ============================================================

  const sendFrameToAI = () => {
    if (
      !videoRef.current ||
      !canvasRef.current ||
      !wsRef.current
    ) {
      return;
    }

    if (
      wsRef.current.readyState !==
      WebSocket.OPEN
    ) {
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (
      video.readyState <
      HTMLMediaElement.HAVE_CURRENT_DATA
    ) {
      return;
    }

    const ctx = canvas.getContext("2d");

    if (!ctx) {
      return;
    }

    // Use actual video dimensions
    const width = video.videoWidth || 640;
    const height = video.videoHeight || 480;

    canvas.width = width;
    canvas.height = height;

    ctx.drawImage(
      video,
      0,
      0,
      width,
      height
    );

    canvas.toBlob(
      async (blob) => {
        if (
          blob &&
          wsRef.current &&
          wsRef.current.readyState ===
            WebSocket.OPEN
        ) {
          try {
            const buffer =
              await blob.arrayBuffer();

            wsRef.current.send(buffer);
          } catch (err) {
            console.error(
              "Frame send error:",
              err
            );
          }
        }
      },
      "image/jpeg",
      0.7
    );
  };

  // ============================================================
  // CONNECT TO PYTHON AI
  // ============================================================

  const connectAI = () => {
    return new Promise((resolve, reject) => {
      const wsURL =
        AI_URL
          .replace(/^http/, "ws")
          .replace(/\/$/, "") +
        "/ws/fitness";

      console.log(
        "Connecting to AI:",
        wsURL
      );

      const ws = new WebSocket(wsURL);

      ws.binaryType = "blob";

      wsRef.current = ws;

      // --------------------------------------------------------
      // OPEN
      // --------------------------------------------------------

      ws.onopen = () => {
        console.log(
          "AI WebSocket connected"
        );

        // Start sending frames only after
        // WebSocket connection is established.
        frameIntervalRef.current =
          setInterval(() => {
            sendFrameToAI();
          }, 100);

        resolve();
      };

      // --------------------------------------------------------
      // MESSAGE
      // --------------------------------------------------------

      ws.onmessage = (event) => {
        // ======================================================
        // JSON RESULT
        // ======================================================

        if (
          typeof event.data ===
          "string"
        ) {
          try {
            const data =
              JSON.parse(event.data);

            console.log(
              "AI result:",
              data
            );

            if (
              data.type ===
              "result"
            ) {
              if (
                data.exercise !==
                undefined
              ) {
                setExercise(
                  data.exercise
                );
              }

              if (
                data.reps !==
                undefined
              ) {
                setReps(
                  data.reps
                );
              }

              if (
                data.left_reps !==
                undefined
              ) {
                setLeftReps(
                  data.left_reps
                );
              }

              if (
                data.right_reps !==
                undefined
              ) {
                setRightReps(
                  data.right_reps
                );
              }

              if (
                data.confidence !==
                undefined
              ) {
                setConfidence(
                  data.confidence
                );
              }

              if (
                data.left_angle !==
                undefined
              ) {
                setLeftAngle(
                  data.left_angle
                );
              }

              if (
                data.right_angle !==
                undefined
              ) {
                setRightAngle(
                  data.right_angle
                );
              }

              if (
                data.left_stage !==
                undefined
              ) {
                setLeftStage(
                  data.left_stage
                );
              }

              if (
                data.right_stage !==
                undefined
              ) {
                setRightStage(
                  data.right_stage
                );
              }
            }
          } catch (err) {
            console.error(
              "Invalid AI JSON:",
              err
            );
          }

          return;
        }

        // ======================================================
        // PROCESSED IMAGE
        // ======================================================

        const blob =
          event.data instanceof Blob
            ? event.data
            : new Blob(
                [event.data],
                {
                  type: "image/jpeg",
                }
              );

        const imageURL =
          URL.createObjectURL(
            blob
          );

        if (
          processedImageRef.current
        ) {
          // Remove previous object URL
          const oldURL =
            processedImageRef.current.dataset
              .imageUrl;

          if (oldURL) {
            URL.revokeObjectURL(
              oldURL
            );
          }

          processedImageRef.current.src =
            imageURL;

          processedImageRef.current.dataset
            .imageUrl = imageURL;
        }
      };

      // --------------------------------------------------------
      // ERROR
      // --------------------------------------------------------

      ws.onerror = (err) => {
        console.error(
          "AI WebSocket error:",
          err
        );

        reject(
          new Error(
            "Could not connect to AI backend."
          )
        );
      };

      // --------------------------------------------------------
      // CLOSE
      // --------------------------------------------------------

      ws.onclose = () => {
        console.log(
          "AI WebSocket disconnected"
        );
      };
    });
  };

  // ============================================================
  // START WORKOUT
  // ============================================================

  const startWorkout = async () => {
    try {
      setError("");

      setElapsedTime(0);

      setReps(0);
      setLeftReps(0);
      setRightReps(0);

      setExercise(
        "Starting AI..."
      );

      setConfidence(0);

      setLeftAngle(0);
      setRightAngle(0);

      setLeftStage("DOWN");
      setRightStage("DOWN");

      // --------------------------------------------------------
      // CAMERA
      // --------------------------------------------------------

      await startCamera();

      // --------------------------------------------------------
      // AI
      // --------------------------------------------------------

      await connectAI();

      // --------------------------------------------------------
      // RECORDING
      // --------------------------------------------------------

      setIsRecording(true);

      const startTime =
        Date.now();

      timerRef.current =
        setInterval(() => {
          setElapsedTime(
            Math.floor(
              (Date.now() -
                startTime) /
                1000
            )
          );
        }, 1000);

      console.log(
        "Workout started"
      );
    } catch (err) {
      console.error(
        "Workout start error:",
        err
      );

      setError(
        err.message ||
          "Unable to start workout."
      );

      disconnectAI();
      stopCamera();

      setIsRecording(false);
    }
  };

  // ============================================================
  // DISCONNECT AI
  // ============================================================

  const disconnectAI = () => {
    // Stop frame interval
    if (
      frameIntervalRef.current
    ) {
      clearInterval(
        frameIntervalRef.current
      );

      frameIntervalRef.current =
        null;
    }

    // Close WebSocket
    if (
      wsRef.current
    ) {
      wsRef.current.close();

      wsRef.current =
        null;
    }
  };

  // ============================================================
  // STOP WORKOUT
  // ============================================================

  const stopWorkout = async () => {
    try {
      // --------------------------------------------------------
      // STOP TIMER
      // --------------------------------------------------------

      if (
        timerRef.current
      ) {
        clearInterval(
          timerRef.current
        );

        timerRef.current =
          null;
      }

      // --------------------------------------------------------
      // STOP AI
      // --------------------------------------------------------

      disconnectAI();

      // --------------------------------------------------------
      // STOP CAMERA
      // --------------------------------------------------------

      stopCamera();

      setIsRecording(false);

      // --------------------------------------------------------
      // CHECK USER
      // --------------------------------------------------------

      if (!userId) {
        setError(
          "User not found. Please login again."
        );

        return;
      }

      // --------------------------------------------------------
      // CHECK EXERCISE
      // --------------------------------------------------------

      const detectedExercise =
        String(exercise)
          .toLowerCase()
          .replace(/\s+/g, "_");

      let exerciseKey =
        detectedExercise;

      if (
        detectedExercise.includes(
          "bicep"
        )
      ) {
        exerciseKey =
          "bicep_curl";
      } else if (
        detectedExercise.includes(
          "squat"
        )
      ) {
        exerciseKey =
          "squat";
      } else if (
        detectedExercise.includes(
          "pull"
        )
      ) {
        exerciseKey =
          "pullup";
      } else if (
        detectedExercise.includes(
          "jog"
        )
      ) {
        exerciseKey =
          "jogging";
      }

      // This page is specifically
      // for bicep curls.
      exerciseKey =
        "bicep_curl";

      // --------------------------------------------------------
      // SAVE
      // --------------------------------------------------------

      const response =
        await axios.post(
          `${API_URL}/api/fitness/save`,
          {
            userId: userId,
            exercise: exerciseKey,
            count: reps,
            time: elapsedTime,
          }
        );

      console.log(
        "Workout saved:",
        response.data
      );
    } catch (err) {
      console.error(
        "Failed to save workout:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to save workout."
      );
    }
  };

  // ============================================================
  // FORMAT TIME
  // ============================================================

  const formatTime = (
    seconds
  ) => {
    const minutes =
      Math.floor(
        seconds / 60
      );

    const remainingSeconds =
      seconds % 60;

    return `${String(
      minutes
    ).padStart(
      2,
      "0"
    )}:${String(
      remainingSeconds
    ).padStart(
      2,
      "0"
    )}`;
  };

  // ============================================================
  // CLEANUP
  // ============================================================

  useEffect(() => {
    return () => {
      if (
        timerRef.current
      ) {
        clearInterval(
          timerRef.current
        );
      }

      if (
        frameIntervalRef.current
      ) {
        clearInterval(
          frameIntervalRef.current
        );
      }

      if (
        wsRef.current
      ) {
        wsRef.current.close();
      }

      if (
        streamRef.current
      ) {
        streamRef.current
          .getTracks()
          .forEach(
            (track) =>
              track.stop()
          );
      }

      if (
        processedImageRef.current
      ) {
        const oldURL =
          processedImageRef.current
            .dataset.imageUrl;

        if (oldURL) {
          URL.revokeObjectURL(
            oldURL
          );
        }
      }
    };
  }, []);

  // ============================================================
  // UI
  // ============================================================

  return (
    <Layout>
      <div className="min-h-screen w-full px-4 sm:px-6 lg:px-10 py-8">

        {/* ================================================= */}
        {/* HEADER */}
        {/* ================================================= */}

        <div className="max-w-6xl mx-auto mb-8">

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

            <div>

              <p className="text-sm tracking-[0.3em] text-white/50 uppercase">
                AI Trainer
              </p>

              <h1 className="text-3xl sm:text-4xl font-bold text-white mt-2">
                Bicep Curl Session
              </h1>

              <p className="text-white/50 mt-2">
                Perform your exercise and let AI track your reps.
              </p>

            </div>

            <div
              className={`px-4 py-2 rounded-full text-sm font-semibold ${
                isRecording
                  ? "bg-red-500/20 text-red-300 border border-red-400/30"
                  : "bg-white/10 text-white/60 border border-white/10"
              }`}
            >
              {isRecording
                ? "● LIVE SESSION"
                : "SESSION READY"}
            </div>

          </div>

        </div>

        {/* ================================================= */}
        {/* MAIN */}
        {/* ================================================= */}

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">

          {/* ================================================= */}
          {/* VIDEO */}
          {/* ================================================= */}

          <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-black/20">

            {/* Original webcam */}
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full aspect-video object-cover"
            />

            {/* AI processed image */}
            <img
              ref={processedImageRef}
              alt="AI processed workout"
              className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            />

            {/* Hidden canvas */}
            <canvas
              ref={canvasRef}
              className="hidden"
            />

            {/* Waiting overlay */}
            {!isRecording && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/30">

                <div className="text-center">

                  <div className="text-5xl mb-4">
                    🏋️
                  </div>

                  <p className="text-white font-semibold">
                    Camera is ready
                  </p>

                  <p className="text-white/50 text-sm mt-1">
                    Click Start Workout to begin
                  </p>

                </div>

              </div>
            )}

            {/* Recording indicator */}
            {isRecording && (
              <div className="absolute top-5 left-5 flex items-center gap-2 px-3 py-2 rounded-full bg-black/50 backdrop-blur-md border border-white/10">

                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />

                <span className="text-white text-xs font-semibold">
                  AI TRACKING
                </span>

              </div>
            )}

          </div>

          {/* ================================================= */}
          {/* STATS */}
          {/* ================================================= */}

          <div className="flex flex-col gap-4">

            {/* REPS */}
            <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md p-6">

              <p className="text-white/50 text-sm uppercase tracking-wider">
                Total Reps
              </p>

              <p className="text-6xl font-bold text-white mt-3">
                {reps}
              </p>

              <p className="text-white/40 text-sm mt-2">
                Bicep Curls
              </p>

            </div>

            {/* TIMER */}
            <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md p-6">

              <p className="text-white/50 text-sm uppercase tracking-wider">
                Session Time
              </p>

              <p className="text-4xl font-bold text-white mt-3">
                {formatTime(
                  elapsedTime
                )}
              </p>

            </div>

            {/* EXERCISE */}
            <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md p-6">

              <p className="text-white/50 text-sm uppercase tracking-wider">
                Exercise
              </p>

              <p className="text-xl font-semibold text-white mt-3">
                {exercise}
              </p>

              <p className="text-white/40 text-sm mt-1">
                AI Motion Tracking
              </p>

            </div>

            {/* CONFIDENCE */}
            <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md p-6">

              <div className="flex justify-between">

                <p className="text-white/50 text-sm uppercase tracking-wider">
                  AI Confidence
                </p>

                <p className="text-white font-semibold">
                  {(
                    confidence *
                    100
                  ).toFixed(0)}
                  %
                </p>

              </div>

              <div className="w-full h-2 bg-white/10 rounded-full mt-4 overflow-hidden">

                <div
                  className="h-full bg-white rounded-full transition-all duration-300"
                  style={{
                    width: `${Math.min(
                      confidence *
                        100,
                      100
                    )}%`,
                  }}
                />

              </div>

            </div>

            {/* LEFT / RIGHT */}
            <div className="grid grid-cols-2 gap-3">

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">

                <p className="text-white/40 text-xs uppercase">
                  Left
                </p>

                <p className="text-white text-2xl font-bold mt-1">
                  {leftReps}
                </p>

                <p className="text-white/40 text-xs mt-1">
                  {leftAngle.toFixed(
                    0
                  )}
                  ° · {leftStage}
                </p>

              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">

                <p className="text-white/40 text-xs uppercase">
                  Right
                </p>

                <p className="text-white text-2xl font-bold mt-1">
                  {rightReps}
                </p>

                <p className="text-white/40 text-xs mt-1">
                  {rightAngle.toFixed(
                    0
                  )}
                  ° · {rightStage}
                </p>

              </div>

            </div>

            {/* BUTTON */}
            {!isRecording ? (
              <button
                onClick={
                  startWorkout
                }
                className="
                  w-full
                  py-4
                  rounded-2xl
                  bg-white
                  text-black
                  font-bold
                  hover:bg-white/90
                  active:scale-[0.98]
                  transition
                "
              >
                START WORKOUT
              </button>
            ) : (
              <button
                onClick={
                  stopWorkout
                }
                className="
                  w-full
                  py-4
                  rounded-2xl
                  bg-red-500/20
                  text-red-200
                  border border-red-400/30
                  font-bold
                  hover:bg-red-500/30
                  active:scale-[0.98]
                  transition
                "
              >
                STOP WORKOUT
              </button>
            )}

          </div>

        </div>

        {/* ================================================= */}
        {/* ERROR */}
        {/* ================================================= */}

        {error && (
          <div className="max-w-6xl mx-auto mt-5">

            <div className="rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-red-200 text-sm">
              {error}
            </div>

          </div>
        )}

      </div>
    </Layout>
  );
};

export default FitnessTrainer;