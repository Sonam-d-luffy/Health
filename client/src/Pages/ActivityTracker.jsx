import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import {
  MapContainer,
  TileLayer,
  Polyline,
  Marker,
  Circle,
  useMap
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useCurrentUser } from "../Context/CurrentUserContext";
import Layout from "../Components/Layout";
import { useNavigate } from "react-router-dom";

const RecenterMap = ({ position, tracking }) => {
  const map = useMap();

  useEffect(() => {
    if (position && tracking) {
      map.setView(position, map.getZoom());
    }
  }, [position, tracking, map]);

  return null;
};

const Activity = () => {
  const [tracking, setTracking] = useState(false);
  const [position, setPosition] = useState(null);
  const [route, setRoute] = useState([]);
  const [distance, setDistance] = useState(0);
  const [duration, setDuration] = useState(0);
  const [speed, setSpeed] = useState(0);
  const [saving, setSaving] = useState(false);

  const watchId = useRef(null);
  const timerRef = useRef(null);
  const startTime = useRef(null);

  const distanceRef = useRef(0);
  const routeRef = useRef([]);

  const { currentUser } = useCurrentUser();
  const navigate = useNavigate();

  const getDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371;

    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLng = ((lng2 - lng1) * Math.PI) / 180;

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLng / 2) ** 2;

    return (
      R *
      2 *
      Math.atan2(
        Math.sqrt(a),
        Math.sqrt(1 - a)
      )
    );
  };

  const startActivity = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setTracking(true);
    setRoute([]);
    setDistance(0);
    setDuration(0);
    setSpeed(0);

    distanceRef.current = 0;
    routeRef.current = [];

    startTime.current = Date.now();

    timerRef.current = setInterval(() => {
      if (!startTime.current) return;

      const seconds = Math.floor(
        (Date.now() - startTime.current) / 1000
      );

      setDuration(seconds);

      if (seconds > 0) {
        const avgSpeed =
          distanceRef.current / (seconds / 3600);

        setSpeed(avgSpeed);
      }
    }, 1000);

    watchId.current = navigator.geolocation.watchPosition(
      ({ coords }) => {
        const {
          latitude,
          longitude,
          accuracy
        } = coords;

       
        const point = {
          lat: latitude,
          lng: longitude,
          timestamp: Date.now()
        };

        setPosition([latitude, longitude]);

        if (routeRef.current.length === 0) {
          routeRef.current = [point];
          setRoute([point]);

          console.log("FIRST GPS POINT:", point);

          return;
        }

        const lastPoint =
          routeRef.current[
            routeRef.current.length - 1
          ];

        const segmentDistance = getDistance(
          lastPoint.lat,
          lastPoint.lng,
          point.lat,
          point.lng
        );

        const timeDiff =
          (point.timestamp - lastPoint.timestamp) / 1000;

        console.log("DISTANCE UPDATE:", {
          segmentDistance,
          timeDiff
        });

        if (timeDiff <= 0) {
          return;
        }

        distanceRef.current += segmentDistance;

        routeRef.current = [
          ...routeRef.current,
          point
        ];

        setRoute([...routeRef.current]);

        setDistance(distanceRef.current);

        const elapsedSeconds =
          (Date.now() - startTime.current) / 1000;

        if (elapsedSeconds > 0) {
          const avgSpeed =
            distanceRef.current /
            (elapsedSeconds / 3600);

          setSpeed(avgSpeed);
        }

        console.log("ACTIVITY:", {
          distance: distanceRef.current,
          speed:
            distanceRef.current /
            (elapsedSeconds / 3600),
          points: routeRef.current.length
        });
      },
      error => {
        console.error("GPS ERROR:", error);
        alert(error.message);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 20000
      }
    );
  };

  const stopActivity = async () => {
    if (watchId.current !== null) {
      navigator.geolocation.clearWatch(watchId.current);
      watchId.current = null;
    }

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    setTracking(false);

    const finalRoute = routeRef.current;
    const finalDistance = distanceRef.current;

    const finalDuration = startTime.current
      ? Math.floor(
          (Date.now() - startTime.current) / 1000
        )
      : duration;

    console.log("FINAL ACTIVITY:", {
      distance: finalDistance,
      duration: finalDuration,
      points: finalRoute.length
    });

    if (!currentUser?._id && !currentUser?.id) {
      alert("User not found. Please login again.");
      return;
    }

    if (finalRoute.length === 0) {
      alert("No GPS location was recorded.");
      return;
    }

    setSaving(true);

    try {
      const lastPoint =
        finalRoute[finalRoute.length - 1];

      const userId =
        currentUser?._id || currentUser?.id;

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/activity/save`,
        {
          userId,

          distance: Number(
            finalDistance.toFixed(3)
          ),

          duration: finalDuration,

          location: {
            lat: lastPoint.lat,
            lng: lastPoint.lng
          },

          route: finalRoute.map(point => ({
            lat: point.lat,
            lng: point.lng,
            timestamp: point.timestamp
          }))
        }
      );

      console.log(
        "SAVE RESPONSE:",
        response.data
      );

      alert("Activity saved successfully!");

      setRoute([]);
      setDistance(0);
      setDuration(0);
      setSpeed(0);
      setPosition(null);

      routeRef.current = [];
      distanceRef.current = 0;
      startTime.current = null;
    } catch (error) {
      console.error(
        "SAVE ERROR:",
        error.response?.data || error
      );

      alert(
        error.response?.data?.message ||
          "Failed to save activity"
      );
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    return () => {
      if (watchId.current !== null) {
        navigator.geolocation.clearWatch(
          watchId.current
        );
      }

      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const formatTime = seconds => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;

    return `${String(h).padStart(2, "0")}:${String(
      m
    ).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  return (
    <Layout>
      
      <div className="w-full min-h-screen flex items-center justify-center p-5">
        <div className="w-full max-w-7xl flex flex-col lg:flex-row gap-6">
          <div className="w-full lg:w-1/2 h-[500px] rounded-3xl overflow-hidden border border-white/30 shadow-xl">
            <MapContainer
              center={
                position || [
                  28.4732,
                  77.5053
                ]
              }
              zoom={15}
              style={{
                width: "100%",
                height: "100%"
              }}
            >
              <TileLayer
                attribution="&copy; OpenStreetMap contributors"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              <RecenterMap
                position={position}
                tracking={tracking}
              />

              {route.length > 1 && (
                <Polyline
                  positions={route.map(point => [
                    point.lat,
                    point.lng
                  ])}
                  pathOptions={{
                    color: "#2563eb",
                    weight: 5
                  }}
                />
              )}

              {position && (
                <>
                  <Circle
                    center={position}
                    radius={10}
                    pathOptions={{
                      color: "#2563eb",
                      fillColor: "#2563eb",
                      fillOpacity: 0.2
                    }}
                  />

                  <Marker position={position} />
                </>
              )}
            </MapContainer>
          </div>

          <div className="w-full lg:w-1/2 flex flex-col justify-center px-4 lg:px-10">
            <p className="text-white/70 text-sm uppercase tracking-widest">
              Fitness Activity
            </p>

            <h1 className="text-4xl font-bold text-white mt-2">
              {tracking
                ? "Activity in Progress"
                : "Ready to Move?"}
            </h1>

            <div className="grid grid-cols-2 gap-4 mt-8">
              <div className="rounded-2xl p-5 bg-white/10 backdrop-blur-md border border-white/20">
                <p className="text-white/60">
                  Distance
                </p>

                <p className="text-3xl font-bold text-white mt-1">
                  {distance.toFixed(2)} km
                </p>
              </div>

              <div className="rounded-2xl p-5 bg-white/10 backdrop-blur-md border border-white/20">
                <p className="text-white/60">
                  Time
                </p>

                <p className="text-3xl font-bold text-white mt-1">
                  {formatTime(duration)}
                </p>
              </div>

              <div className="rounded-2xl p-5 bg-white/10 backdrop-blur-md border border-white/20">
                <p className="text-white/60">
                  Avg Speed
                </p>

                <p className="text-3xl font-bold text-white mt-1">
                  {speed.toFixed(2)} km/h
                </p>
              </div>

              <div className="rounded-2xl p-5 bg-white/10 backdrop-blur-md border border-white/20">
                <p className="text-white/60">
                  GPS Points
                </p>

                <p className="text-3xl font-bold text-white mt-1">
                  {route.length}
                </p>
              </div>
            </div>

            <div className="mt-8 flex gap-3">
              {!tracking ? (
                <button
                  onClick={startActivity}
                  disabled={saving}
                  className="flex-1 py-3 px-5 rounded-xl bg-white text-black font-semibold hover:scale-[1.02] transition disabled:opacity-50"
                >
                  Start Activity
                </button>
              ) : (
                <button
                  onClick={stopActivity}
                  disabled={saving}
                  className="flex-1 py-3 px-5 rounded-xl bg-red-500 text-white font-semibold hover:scale-[1.02] transition disabled:opacity-50"
                >
                  {saving
                    ? "Saving..."
                    : "Stop & Save"}
                </button>
              )}

              <button
                onClick={() =>
                  navigate("/leaderboard")
                }
                className="py-3 px-5 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white font-semibold hover:bg-white/20 transition"
              >
                🏆 Leaderboard
              </button>

             
            </div>

            {tracking && (
              <p className="text-center text-white/60 mt-4 text-sm">
                GPS tracking is active. Keep moving!
              </p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Activity;
