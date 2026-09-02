import React, { useRef, useEffect, useState, useCallback } from "react";
import * as tf from "@tensorflow/tfjs";
import * as poseDetection from "@tensorflow-models/pose-detection";
import "@tensorflow/tfjs-backend-webgl";
import {
  Play,
  Pause,
  RotateCcw,
  Activity,
  Target,
  Trophy,
  MessageCircle,
} from "lucide-react";

export default function Ai() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const rafRef = useRef(null);

  const [detector, setDetector] = useState(null);
  const [isActive, setIsActive] = useState(false);
  const [exercise, setExercise] = useState("squat");

  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "coach",
      text: "Welcome — select an exercise and press Start.",
      timestamp: new Date(),
    },
  ]);
  const [stats, setStats] = useState({ reps: 0, sets: 0, score: 100 });
  const [logs, setLogs] = useState([]);

  console.log(stats);
  const lastChatTimeRef = useRef(0);

  const squatCountRef = useRef(0);
  const squatStateRef = useRef("up");
  const leftCurlCountRef = useRef(0);
  const leftCurlStateRef = useRef("down");
  const rightCurlCountRef = useRef(0);
  const rightCurlStateRef = useRef("down");

  const addMessage = (text, type = "coach") => {
    const now = Date.now();
    lastChatTimeRef.current = now;
    setMessages((m) => [
      ...m,
      { id: now, type, text, timestamp: new Date(now) },
    ]);
  };

  const initCamera = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      addMessage("Camera not available in this browser.");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: "user" },
        audio: false,
      });
      videoRef.current.srcObject = stream;
      await new Promise((res) => (videoRef.current.onloadedmetadata = res));
      videoRef.current.play();
      addMessage("Camera initialized.");
    } catch (err) {
      console.error(err);
      addMessage("Failed to access camera: " + err.message);
    }
  };

  const initModel = async () => {
    try {
      await tf.setBackend("webgl");
      await tf.ready();

      const detector = await poseDetection.createDetector(
        poseDetection.SupportedModels.MoveNet,
        {
          modelType: poseDetection.movenet.modelType.SINGLEPOSE_THUNDER,
        }
      );

      setDetector(detector);
      addMessage("AI model loaded (MoveNet Thunder). Higher accuracy mode.");
    } catch (err) {
      console.error("Model init error", err);
      addMessage("Failed to load model: " + err.message);
    }
  };

  useEffect(() => {
    (async () => {
      await initCamera();
      await initModel();
    })();
    return () => {
      try {
        videoRef.current?.srcObject?.getTracks()?.forEach((t) => t.stop());
      } catch (e) {}
    };
  }, []);

  const getKeypoint = (keypoints, name) =>
    keypoints.find((kp) => kp.name === name && kp.score > 0.35);

  const angleBetween = (A, B, C) => {
    if (!A || !B || !C) return null;
    const AB = { x: A.x - B.x, y: A.y - B.y };
    const CB = { x: C.x - B.x, y: C.y - B.y };
    const dot = AB.x * CB.x + AB.y * CB.y;
    const magAB = Math.hypot(AB.x, AB.y);
    const magCB = Math.hypot(CB.x, CB.y);
    const cos = Math.max(-1, Math.min(1, dot / (magAB * magCB)));
    return (Math.acos(cos) * 180) / Math.PI;
  };

  const checkSquat = (keypoints, ctx) => {
    const hip =
      getKeypoint(keypoints, "left_hip") || getKeypoint(keypoints, "right_hip");
    const knee =
      getKeypoint(keypoints, "left_knee") ||
      getKeypoint(keypoints, "right_knee");
    const ankle =
      getKeypoint(keypoints, "left_ankle") ||
      getKeypoint(keypoints, "right_ankle");
    if (!hip || !knee || !ankle) return null;

    const kneeAngle = angleBetween(hip, knee, ankle);
    if (!kneeAngle) return null;

    let msg = "";
    if (kneeAngle < 70) msg = "Too deep — control your descent";
    else if (kneeAngle > 100) msg = "Not deep enough — go lower";
    else msg = "Good squat depth";

    if (kneeAngle < 90 && squatStateRef.current === "up") {
      squatStateRef.current = "down";
    }
    if (kneeAngle > 100 && squatStateRef.current === "down") {
      squatStateRef.current = "up";
      squatCountRef.current += 1;
      console.log("Squat rep ->", squatCountRef.current);
    }

    ctx.fillStyle = "yellow";
    ctx.font = "18px Arial";
    ctx.fillText(
      `${msg} | Reps: ${squatCountRef.current}`,
      knee.x + 12,
      knee.y - 12
    );

    const score = Math.max(40, 100 - Math.abs(90 - kneeAngle));
    return { msg, reps: squatCountRef.current, score };
  };

  const checkBicepCurls = (keypoints, ctx) => {
    const sL = getKeypoint(keypoints, "left_shoulder");
    const eL = getKeypoint(keypoints, "left_elbow");
    const wL = getKeypoint(keypoints, "left_wrist");
    const sR = getKeypoint(keypoints, "right_shoulder");
    const eR = getKeypoint(keypoints, "right_elbow");
    const wR = getKeypoint(keypoints, "right_wrist");

    const results = [];

    if (sL && eL && wL) {
      const angL = angleBetween(sL, eL, wL);
      let msgL = "";
      if (angL > 150) msgL = "Left arm extended";
      else if (angL < 60) msgL = "Left full curl";
      else msgL = "Left curling";

      if (angL < 60 && leftCurlStateRef.current === "down") {
        leftCurlStateRef.current = "up";
      }
      if (angL > 150 && leftCurlStateRef.current === "up") {
        leftCurlStateRef.current = "down";
        leftCurlCountRef.current += 1;
        console.log("Left curl ->", leftCurlCountRef.current);
      }

      ctx.fillStyle = "cyan";
      ctx.font = "16px Arial";
      ctx.fillText(
        `${msgL} | Reps: ${leftCurlCountRef.current}`,
        eL.x + 10,
        eL.y - 12
      );

      results.push({
        side: "left",
        msg: msgL,
        reps: leftCurlCountRef.current,
        score: Math.max(40, 100 - Math.abs(90 - angL)),
      });
    }

    if (sR && eR && wR) {
      const angR = angleBetween(sR, eR, wR);
      let msgR = "";
      if (angR > 150) msgR = "Right arm extended";
      else if (angR < 60) msgR = "Right full curl";
      else msgR = "Right curling";

      if (angR < 60 && rightCurlStateRef.current === "down") {
        rightCurlStateRef.current = "up";
      }
      if (angR > 150 && rightCurlStateRef.current === "up") {
        rightCurlStateRef.current = "down";
        rightCurlCountRef.current += 1;
        console.log("Right curl ->", rightCurlCountRef.current);
      }

      ctx.fillStyle = "cyan";
      ctx.font = "16px Arial";
      ctx.fillText(
        `${msgR} | Reps: ${rightCurlCountRef.current}`,
        eR.x + 10,
        eR.y - 12
      );

      results.push({
        side: "right",
        msg: msgR,
        reps: rightCurlCountRef.current,
        score: Math.max(40, 100 - Math.abs(90 - angR)),
      });
    }
  };

  const drawOverlay = (poses) => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;

    const vw = videoRef.current.videoWidth || 640;
    const vh = videoRef.current.videoHeight || 480;
    if (canvasRef.current.width !== vw || canvasRef.current.height !== vh) {
      canvasRef.current.width = vw;
      canvasRef.current.height = vh;
    }

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    poses.forEach((pose) => {
      pose.keypoints.forEach((kp) => {
        const alpha = Math.max(0.15, Math.min(1, kp.score));
        if (kp.x && kp.y) {
          ctx.beginPath();
          ctx.arc(kp.x, kp.y, 6, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(0,255,136,${alpha})`;
          ctx.fill();
        }
      });

      const adjacentPairs = poseDetection.util.getAdjacentPairs(
        poseDetection.SupportedModels.MoveNet
      );
      adjacentPairs.forEach(([i, j]) => {
        const kp1 = pose.keypoints[i];
        const kp2 = pose.keypoints[j];
        if (!kp1 || !kp2) return;
        if (kp1.score > 0.2 && kp2.score > 0.2) {
          const grad = ctx.createLinearGradient(kp1.x, kp1.y, kp2.x, kp2.y);
          grad.addColorStop(0, "#00ff88");
          grad.addColorStop(1, "#0066ff");
          ctx.beginPath();
          ctx.moveTo(kp1.x, kp1.y);
          ctx.lineTo(kp2.x, kp2.y);
          ctx.strokeStyle = grad;
          ctx.lineWidth = 3;
          ctx.stroke();
        }
      });

      if (exercise === "squat") {
        const fb = checkSquat(pose.keypoints, ctx);
        if (fb) {
          if (fb.reps !== stats.reps) {
            setStats((s) => ({
              ...s,
              reps: fb.reps,
              score: Math.round(fb.score),
            }));
            addMessage(fb.msg);
          }
        }
      }
      if (exercise === "bicepCurl") {
        const curlResults = checkBicepCurls(pose.keypoints, ctx);
        if (curlResults && curlResults.length) {
          const totalReps =
            (curlResults[0]?.reps || 0) + (curlResults[1]?.reps || 0);
          const avgScore = Math.round(
            curlResults.reduce((a, r) => a + r.score, 0) / curlResults.length ||
              0
          );
          if (totalReps !== stats.reps) {
            setStats((s) => ({ ...s, reps: totalReps, score: avgScore }));
            addMessage(curlResults.map((r) => r.msg).join(" | "));
          }
        }
      }
    });
  };

  const runDetection = useCallback(async () => {
    if (!detector || !isActive) return;
    try {
      if (!videoRef.current || videoRef.current.readyState < 2) {
        rafRef.current = requestAnimationFrame(runDetection);
        return;
      }
      const poses = await detector.estimatePoses(videoRef.current, {
        flipHorizontal: false,
      });
      drawOverlay(poses);
    } catch (err) {
      console.error("detect error", err);
    }
    rafRef.current = requestAnimationFrame(runDetection);
  }, [detector, isActive, exercise, stats]);

  useEffect(() => {
    if (isActive && detector) {
      rafRef.current = requestAnimationFrame(runDetection);
    } else {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    }
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isActive, detector, runDetection]);

  const handleReset = () => {
    squatCountRef.current = 0;
    leftCurlCountRef.current = 0;
    rightCurlCountRef.current = 0;
    squatStateRef.current = "up";
    leftCurlStateRef.current = "down";
    rightCurlStateRef.current = "down";
    setStats({ reps: 0, sets: 0, score: 100 });
    addMessage("Session reset.");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white p-6">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-6">
        {/* Left: Controls + Video */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Activity className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">AI Exercise Coach</h1>
                <p className="text-sm text-gray-300">Live feedback & reps</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-sm text-gray-300">
                Model: MoveNet (Thunder)
              </div>
              <button
                onClick={() => setIsActive((s) => !s)}
                className={`px-4 py-2 rounded-md ${
                  isActive ? "bg-red-600" : "bg-green-600"
                }`}
              >
                {isActive ? (
                  <>
                    <Pause className="inline-block mr-2" /> Pause
                  </>
                ) : (
                  <>
                    <Play className="inline-block mr-2" /> Start
                  </>
                )}
              </button>
              <button
                onClick={handleReset}
                className="px-3 py-2 bg-white/10 rounded-md ml-2"
              >
                <RotateCcw />
              </button>
            </div>
          </div>

          <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
            <div className="flex gap-3 mb-4">
              <button
                onClick={() => setExercise("squat")}
                className={`flex-1 py-3 rounded-md ${
                  exercise === "squat"
                    ? "bg-purple-500 text-white"
                    : "bg-white/5"
                }`}
              >
                🏋️ Squat
              </button>
              <button
                onClick={() => setExercise("bicepCurl")}
                className={`flex-1 py-3 rounded-md ${
                  exercise === "bicepCurl"
                    ? "bg-purple-500 text-white"
                    : "bg-white/5"
                }`}
              >
                💪 Bicep Curl
              </button>
            </div>

            <div className="relative bg-black/60 rounded-lg overflow-hidden">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-auto"
                // style={{ transform: "scaleX(-1)" }}
              />
              <canvas
                ref={canvasRef}
                className="absolute top-0 left-0 w-full h-full pointer-events-none"
              />
              {!isActive && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                  <div className="text-center text-gray-300">
                    <Play className="w-12 h-12 mx-auto" />
                    <p>Press Start to begin</p>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-3 grid grid-cols-3 gap-3">
              <div className="p-3 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-md text-center">
                <div className="text-2xl font-bold text-purple-300">
                  {stats?.reps}
                </div>
                <div className="text-sm text-gray-400">Reps</div>
              </div>
              <div className="p-3 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-md text-center">
                <div className="text-2xl font-bold text-blue-300">
                  {stats.sets}
                </div>
                <div className="text-sm text-gray-400">Sets</div>
              </div>
              <div className="p-3 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-md text-center">
                <div className="text-2xl font-bold text-green-300">
                  {stats.score}%
                </div>
                <div className="text-sm text-gray-400">Form Score</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Chat & Tips */}
        <div className="space-y-4">
          <div className="bg-white/5 rounded-2xl p-4 border border-white/10 h-[520px] flex flex-col">
            <div className="flex items-center gap-2 mb-3">
              <MessageCircle className="w-5 h-5 text-purple-400" />
              <h3 className="font-semibold">Response</h3>
            </div>
            <div className="flex-1 overflow-y-auto space-y-3 pr-2">
              {messages.map((m) => (
                <div key={m.id} className="bg-white/6 p-3 rounded-lg">
                  <div className="text-sm">{m.text}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {new Date(m.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-3">
              <div className="bg-yellow-900/10 p-3 rounded-md text-sm text-gray-300">
                Tip: Make sure camera captures your full body. Move slightly
                back if joints disappear.
              </div>
            </div>
          </div>

          <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
            <div className="flex items-center gap-3">
              <Trophy className="w-5 h-5 text-yellow-400" />
              <div>
                <div className="text-sm text-gray-300">Achievement</div>
                <div className="font-medium">Consistency Streak: 3 days</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
