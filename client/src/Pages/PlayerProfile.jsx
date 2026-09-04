import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Layout } from "lucide";


const PlayerProfile = () => {
  const { playerId } = useParams();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (!playerId) {
          setError("Invalid player");
          setLoading(false);
          return;
        }

        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/community/${playerId}/userProfile`
        );

        if (response.data.success) {
          setProfile(response.data);
        } else {
          setError("Unable to load profile");
        }
      } catch (err) {
        console.error("User profile fetch error:", err);
        setError(
          err.response?.data?.message || "Unable to load profile"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [playerId]);

  const formatDuration = (minutes = 0) => {
    const totalMinutes = Math.round(Number(minutes) || 0);

    const hours = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;

    if (hours === 0) {
      return `${mins}m`;
    }

    return `${hours}h ${mins}m`;
  };

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <Layout>
        <div className="flex min-h-screen items-center justify-center px-5 pt-24 text-white">
          <div className="text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white" />

            <p className="mt-4 text-sm text-white/50">
              Loading profile...
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  /* ================= ERROR ================= */

  if (error || !profile) {
    return (
      <Layout>
        <div className="flex min-h-screen items-center justify-center px-5 pt-24 text-white">
          <div className="text-center">
            <p className="text-sm text-white/50">
              {error || "Profile not found"}
            </p>

            <button
              onClick={() => navigate("/community")}
              className="
                mt-5
                rounded-full
                bg-white
                px-5
                py-2.5
                text-sm
                font-bold
                text-black
                transition
                hover:bg-white/85
              "
            >
              Back to Community
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  const player = profile.player || {};
  const activity = profile.activity || {};

  const profileImage =
    player.profileImage ||
    player.image ||
    player.avatar 

  const coverImage =
    player.coverImage ||
    player.bannerImage 

  return (
    <Layout>
      <main className="min-h-screen w-full px-4 pb-16 pt-24 text-white sm:px-6 md:px-10 lg:px-16">
        <div className="mx-auto max-w-6xl">

          {/* ================= PROFILE HEADER ================= */}

          <section className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03]">

            {/* Cover */}
            <div className="relative h-44 overflow-hidden sm:h-56 md:h-64 lg:h-72">
              <img
                src={coverImage}
                alt="Athlete cover"
                className="h-full w-full object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/20 to-black/90" />
            </div>

            {/* Profile Information */}
            <div className="relative px-5 pb-7 sm:px-8 md:px-10">

              <div className="-mt-14 flex flex-col items-center sm:-mt-20 sm:flex-row sm:items-end sm:gap-6">

                {/* Profile Image */}
                <div
                  className="
                    h-28
                    w-28
                    shrink-0
                    overflow-hidden
                    rounded-full
                    border-4
                    border-black
                    bg-black
                    sm:h-36
                    sm:w-36
                    md:h-40
                    md:w-40
                  "
                >
                  <img
                    src={profileImage}
                    alt={player.name || "Player"}
                    className="h-full w-full object-cover"
                  />
                </div>

                {/* Name + Details */}
                <div className="mt-4 flex-1 text-center sm:mb-3 sm:mt-0 sm:text-left">

                  <h1 className="text-2xl font-black sm:text-3xl md:text-4xl">
                    {player.name || "Athlete"}
                  </h1>

                  {player.username && (
                    <p className="mt-1 text-sm text-white/45">
                      @{player.username}
                    </p>
                  )}

                  {player.sports?.length > 0 && (
                    <div className="mt-3 flex flex-wrap justify-center gap-2 sm:justify-start">
                      {player.sports.map((sport, index) => (
                        <span
                          key={index}
                          className="
                            rounded-full
                            border
                            border-white/10
                            bg-white/[0.06]
                            px-3
                            py-1
                            text-xs
                            text-white/60
                          "
                        >
                          {sport}
                        </span>
                      ))}
                    </div>
                  )}

                  {player.gender && (
                    <p className="mt-2 text-xs uppercase tracking-[0.2em] text-white/30">
                      {player.gender}
                    </p>
                  )}
                </div>

              </div>
            </div>
          </section>

          {/* ================= ACTIVITY ================= */}

          <section className="mt-8">

            <div className="mb-5">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/35">
                Player Activity
              </p>

              <h2 className="mt-1 text-2xl font-black sm:text-3xl">
                Activity Overview
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">

              {/* Distance */}
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                <p className="text-xs uppercase tracking-[0.15em] text-white/35">
                  Distance
                </p>

                <p className="mt-3 text-2xl font-black sm:text-3xl">
                  {Number(activity.totalDistance || 0).toFixed(1)}

                  <span className="ml-1 text-sm font-medium text-white/35">
                    km
                  </span>
                </p>
              </div>

              {/* Activities */}
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                <p className="text-xs uppercase tracking-[0.15em] text-white/35">
                  Activities
                </p>

                <p className="mt-3 text-2xl font-black sm:text-3xl">
                  {activity.totalActivities || 0}
                </p>
              </div>

              {/* Active Time */}
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                <p className="text-xs uppercase tracking-[0.15em] text-white/35">
                  Active Time
                </p>

                <p className="mt-3 text-2xl font-black sm:text-3xl">
                  {formatDuration(activity.totalDuration)}
                </p>
              </div>

              {/* Average Speed */}
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                <p className="text-xs uppercase tracking-[0.15em] text-white/35">
                  Avg Speed
                </p>

                <p className="mt-3 text-2xl font-black sm:text-3xl">
                  {Number(activity.totalAvgSpeed || 0).toFixed(1)}

                  <span className="ml-1 text-sm font-medium text-white/35">
                    km/h
                  </span>
                </p>
              </div>

            </div>
          </section>

          {/* ================= BEST ACTIVITY ================= */}

          <section className="mt-8">

            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/35">
              Highlights
            </p>

            <h2 className="mt-1 text-2xl font-black sm:text-3xl">
              Best Performance
            </h2>

            <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">

              {/* Best Daily Distance */}
              <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">

                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/35">
                  Best Daily Distance
                </p>

                <div className="mt-4 flex items-end gap-2">

                  <p className="text-4xl font-black">
                    {Number(
                      activity.maxDailyDistance || 0
                    ).toFixed(2)}
                  </p>

                  <span className="mb-1 text-sm text-white/40">
                    km
                  </span>

                </div>

                {activity.maxDailyDistanceSpeed && (
                  <p className="mt-3 text-sm text-white/45">
                    Speed{" "}
                    <span className="font-semibold text-white">
                      {Number(
                        activity.maxDailyDistanceSpeed
                      ).toFixed(2)}{" "}
                      km/h
                    </span>
                  </p>
                )}

                {activity.maxDailyDistanceDate && (
                  <p className="mt-1 text-xs text-white/30">
                    {activity.maxDailyDistanceDate}
                  </p>
                )}

              </div>

              {/* Fastest Activity */}
              <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">

                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/35">
                  Fastest Activity
                </p>

                <div className="mt-4 flex items-end gap-2">

                  <p className="text-4xl font-black">
                    {Number(
                      activity.fastestDistanceSpeed || 0
                    ).toFixed(2)}
                  </p>

                  <span className="mb-1 text-sm text-white/40">
                    km/h
                  </span>

                </div>

                <p className="mt-3 text-sm text-white/45">
                  Distance{" "}
                  <span className="font-semibold text-white">
                    {Number(
                      activity.fastestDistance || 0
                    ).toFixed(2)}{" "}
                    km
                  </span>
                </p>

                {activity.fastestDistanceDate && (
                  <p className="mt-1 text-xs text-white/30">
                    {activity.fastestDistanceDate}
                  </p>
                )}

              </div>

            </div>
          </section>

        </div>
      </main>
    </Layout>
  );
};

export default PlayerProfile;