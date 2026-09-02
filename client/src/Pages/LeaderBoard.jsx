import React, { useEffect, useState } from "react";
import axios from "axios";
import { useCurrentUser } from "../Context/CurrentUserContext";
import Bg from "../Components/Bg";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import assets from "../assets/assets";
import  Layout  from "../Components/Layout";
import TerritoryMap from "../Components/TerritoryMap";

const Leaderboard = () => {
  const { currentUser } = useCurrentUser();
  const [type, setType] = useState("total");
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);

      const { data } = await axios.get(
        `http://localhost:5000/api/activity/leaderboard?type=${type}`
      );

      setLeaderboard(data.leaderboard || []);
    } catch (error) {
      console.error("Leaderboard error:", error);
      setLeaderboard([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, [type]);

  const getValue = item => {
    if (type === "total") return `${item.distance} km`;
    if (type === "today") return `${item.distance} km`;
    if (type === "maxDaily") return `${item.distance} km`;
    if (type === "fastest") return `${item.speed} km/h`;
  };

  const getLabel = () => {
    if (type === "fastest") return "Speed";
    return "Distance";
  };

  const getRankStyle = rank => {
    if (rank === 1) return "text-yellow-300";
    if (rank === 2) return "text-gray-300";
    if (rank === 3) return "text-orange-400";
    return "text-white";
  };

  return (
    <Layout>
      <TerritoryMap/>
      <div className="min-h-screen w-full px-5 pt-28 pb-10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <p className="text-white/60 uppercase tracking-[0.25em] text-sm">
              Compete • Improve • Achieve
            </p>

            <h1 className="text-4xl md:text-5xl font-bold text-white mt-2">
              🏆 Leaderboard
            </h1>

            <p className="text-white/60 mt-3">
              See how you rank against other athletes.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {[
              ["total", "Total Distance"],
              ["today", "Today"],
              ["maxDaily", "Best Day"],
              ["fastest", "Fastest"]
            ].map(([value, label]) => (
              <button
                key={value}
                onClick={() => setType(value)}
                className={`px-5 py-2.5 rounded-xl font-medium transition ${
                  type === value
                    ? "bg-white text-black"
                    : "bg-white/10 text-white border border-white/20 hover:bg-white/20"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl overflow-hidden shadow-xl">
            <div className="grid grid-cols-[70px_1fr_150px] md:grid-cols-[90px_1fr_180px] px-5 py-4 border-b border-white/10 text-white/50 text-sm uppercase tracking-wider">
              <span>Rank</span>
              <span>Athlete</span>
              <span className="text-right">{getLabel()}</span>
            </div>

            {loading ? (
              <div className="py-16 text-center text-white/60">
                Loading leaderboard...
              </div>
            ) : leaderboard.length === 0 ? (
              <div className="py-16 text-center text-white/60">
                No activity data available yet.
              </div>
            ) : (
              leaderboard.map((item) => (
                <div
                  key={item.userId}
                  className={`grid grid-cols-[70px_1fr_150px] md:grid-cols-[90px_1fr_180px] items-center px-5 py-4 border-b border-white/10 last:border-0 transition hover:bg-white/5 ${
                    item.userId === currentUser?._id
                      ? "bg-white/10"
                      : ""
                  }`}
                >
                  <div className={`font-bold text-xl ${getRankStyle(item.rank)}`}>
                    {item.rank <= 3
                      ? ["🥇", "🥈", "🥉"][item.rank - 1]
                      : `#${item.rank}`}
                  </div>

                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white font-bold">
                      {item.name?.charAt(0)?.toUpperCase() || "U"}
                    </div>

                    <div className="min-w-0">
                      <p className="text-white font-semibold truncate">
                        {item.name}
                      </p>

                      {item.userId === currentUser?._id && (
                        <p className="text-white/50 text-xs">You</p>
                      )}
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-white font-bold text-lg">
                      {getValue(item)}
                    </p>

                    {type === "total" && item.avgSpeed !== undefined && (
                      <p className="text-white/50 text-xs">
                        Avg {item.avgSpeed} km/h
                      </p>
                    )}

                    {type === "maxDaily" && (
                      <p className="text-white/50 text-xs">
                        {item.speed} km/h
                      </p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

    </Layout>
  );
};

export default Leaderboard;