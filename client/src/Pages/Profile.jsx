import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Layout from "../Components/Layout";
import assets from "../assets/assets";
import { useCurrentUser } from "../Context/CurrentUserContext";

const Profile = () => {
  const navigate = useNavigate();
  const { currentUser } = useCurrentUser();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const matchingAcademy = (id) => {
    navigate(`/${id}/academies`)
  }
const application = (id) => {
  navigate(`/${id}/report`)
}
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userId = currentUser?._id || currentUser?.id;

        if (!userId) {
          setLoading(false);
          return;
        }

        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/activity/profile/${userId}`
        );

        if (response.data.success) {
          setProfile(response.data);
        } else {
          setError("Unable to load profile");
        }
      } catch (err) {
        console.error("Profile fetch error:", err);
        setError("Unable to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [currentUser]);

  const formatDuration = (minutes = 0) => {
    const totalMinutes = Math.round(Number(minutes) || 0);

    const hours = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;

    if (hours === 0) {
      return `${mins}m`;
    }

    return `${hours}h ${mins}m`;
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex min-h-screen items-center justify-center px-5 pt-24 text-white">
          <p className="text-sm text-white/50">
            Loading profile...
          </p>
        </div>
      </Layout>
    );
  }

  if (error || !profile) {
    return (
      <Layout>
        <div className="flex min-h-screen items-center justify-center px-5 pt-24 text-white">
          <div className="text-center">
            <p className="text-sm text-white/50">
              {error || "Profile not found"}
            </p>

            <button
              onClick={() => navigate("/")}
              className="mt-4 rounded-full bg-white px-5 py-2 text-sm font-bold text-black"
            >
              Go Home
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
    player.avatar ||
    assets.profile;

  const coverImage =
    player.coverImage ||
    player.bannerImage ||
    assets.s1;

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

            {/* Profile information */}
            <div className="relative px-5 pb-6 sm:px-8 md:px-10">

              <div className="-mt-14 flex flex-col items-center sm:-mt-20 sm:flex-row sm:items-end sm:gap-6">

                {/* Profile Image */}
                <div className="h-28 w-28 shrink-0 overflow-hidden rounded-full border-4 border-black bg-black sm:h-36 sm:w-36 md:h-40 md:w-40">
                  <img
                    src={profileImage}
                    alt={player.name || "Player"}
                    className="h-full w-full object-cover"
                  />
                </div>

                {/* Name */}
                <div className="mt-4 flex-1 text-center sm:mb-3 sm:mt-0 sm:text-left">
                  <h1 className="text-2xl font-black sm:text-3xl md:text-4xl">
                    {player.name || "Athlete"}
                  </h1>

                  {player.username && (
                    <p className="mt-1 text-sm text-white/45">
                      @{player.username}
                    </p>
                  )}

                  {player.email && (
                    <p className="mt-1 text-xs text-white/35">
                      {player.email}
                    </p>
                  )}

                  {player.sport && (
                    <p className="mt-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
                      {player.sport}
                    </p>
                  )}
                </div>

                {/* Edit */}
                <button
                  onClick={() => navigate("/editProfile")}
                  className="
                    mt-4
                    rounded-full
                    border
                    border-white/20
                    bg-white/[0.06]
                    px-5
                    py-2.5
                    text-sm
                    font-semibold
                    text-white
                    transition-all
                    hover:bg-white
                    hover:text-black
                    sm:mb-3
                    sm:mt-0
                  "
                >
                  Edit Profile
                </button>
              </div>
            </div>
          </section>

          {/* ================= ACTIVITY ================= */}

          <section className="mt-8">

            <div className="mb-5">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/35">
                Your Activity
              </p>

              <h2 className="mt-1 text-2xl font-black sm:text-3xl">
                Activity Overview
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">

              {/* Total Distance */}
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
              Your Best
            </h2>

            <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">

              {/* Best Daily */}
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

              {/* Fastest */}
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

          {/* ================= NEARBY ACADEMIES ================= */}

          <section className="relative mt-8 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-6 sm:p-8">

            <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-white/10 blur-3xl" />

            <div className="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">

              <div className="max-w-2xl">

                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/35">
                  Discover
                </p>

                <h2 className="mt-2 text-2xl font-black sm:text-3xl">
                  Find Nearby Academies
                </h2>

                <p className="mt-2 text-sm leading-6 text-white/45">
                  Explore sports academies, training facilities,
                  and places where you can improve your game.
                </p>

              </div>

              <button
                onClick={() => matchingAcademy(currentUser._id)}
                className="
                  shrink-0
                  rounded-full
                  bg-white
                  px-6
                  py-3
                  text-sm
                  font-bold
                  text-black
                  transition-all
                  hover:scale-105
                  hover:bg-white/85
                "
              >
                Visit Academies
              </button>

            </div>
          </section>
   <section className="relative mt-8 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-6 sm:p-8">

            <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-white/10 blur-3xl" />

            <div className="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">

              <div className="max-w-2xl">

                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/35">
                  Discover
                </p>

                <h2 className="mt-2 text-2xl font-black sm:text-3xl">
                  See your submissions
                </h2>

                <p className="mt-2 text-sm leading-6 text-white/45">
                  Explore sports academies, training facilities,
                  and places where you can improve your game.
                </p>

              </div>

              <button
                onClick={() => application(currentUser._id)}
                className="
                  shrink-0
                  rounded-full
                  bg-white
                  px-6
                  py-3
                  text-sm
                  font-bold
                  text-black
                  transition-all
                  hover:scale-105
                  hover:bg-white/85
                "
              >
                Submissions
              </button>

            </div>
          </section>
          {/* ================= AI TRAINER ================= */}

          <section className="relative mt-6 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-6 sm:p-8">

            <div className="absolute -left-20 -top-20 h-48 w-48 rounded-full bg-white/10 blur-3xl" />

            <div className="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">

              <div className="max-w-2xl">

                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/35">
                  Personal AI Trainer
                </p>

                <h2 className="mt-2 text-2xl font-black sm:text-3xl">
                  Train Smarter With AI
                </h2>

                <p className="mt-2 text-sm leading-6 text-white/45 sm:text-base">
                  Get personalized training guidance and improve
                  your performance with your personal AI trainer.
                </p>

              </div>

              <button
                onClick={() => navigate("/aiTrainer")}
                className="
                  shrink-0
                  rounded-full
                  bg-white
                  px-6
                  py-3
                  text-sm
                  font-bold
                  text-black
                  transition-all
                  hover:scale-105
                  hover:bg-white/85
                "
              >
                Open AI Trainer
              </button>

            </div>
          </section>

        </div>
      </main>
    </Layout>
  );
};

export default Profile;
