import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import Layout from "../Components/Layout";
import { useCurrentUser } from "../Context/CurrentUserContext";

const Communities = () => {
  const {currentUser} = useCurrentUser()
  const navigate = useNavigate();

  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNearbyPlayers = () => {
      if (!currentUser?.address?.location) {
        setLoading(false);
        return;
      }

      const { latitude, longitude } =
        currentUser.address.location;

      if (!latitude || !longitude) {
        setLoading(false);
        return;
      }

      axios
        .get(`${import.meta.env.VITE_BACKEND_URL}/api/community/findPeople`, {
          params: {
            latitude,
            longitude,
            radius: 50,
            page: 1,
            limit: 20,
            sort: "distance",
          },
        })
        .then((response) => {
          setPlayers(response.data.data || []);
        })
        .catch((error) => {
          console.error("Error fetching nearby players:", error);
        })
        .finally(() => {
          setLoading(false);
        });
    };

    fetchNearbyPlayers();
  }, [currentUser]);

  const visitProfile = (playerId) => {
    navigate(`/player/${playerId}`);
  };

  return (
    <Layout>
      <div className="min-h-screen w-full bg-transparent px-4 py-8 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-4xl">

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Communities
            </h1>

            <p className="mt-1 text-sm text-white/50">
              Discover players around you
            </p>
          </div>

          {/* Loading */}
          {loading && (
            <div className="flex justify-center py-20">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white" />
            </div>
          )}

          {/* Players */}
          {!loading && players.length > 0 && (
            <div className="space-y-3">
              {players.map((player) => (
                <div
                  key={player._id}
                  className="
                    group
                    flex items-center
                    gap-4
                    rounded-2xl
                    border border-white/10
                    bg-white/[0.06]
                    px-4 py-3
                    backdrop-blur-xl
                    transition-all duration-300
                    hover:bg-white/[0.10]
                    hover:border-white/20
                  "
                >
                  {/* Profile Image */}
                  <div
                    className="
                      h-12 w-12
                      shrink-0
                      overflow-hidden
                      rounded-full
                      border border-white/20
                      bg-white/5
                    "
                  >
                    {player.image ? (
                      <img
                        src={player.image}
                        alt={player.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-lg font-semibold text-white/70">
                        {player.name?.charAt(0)?.toUpperCase()}
                      </div>
                    )}
                  </div>

                  {/* Player Info */}
                  <div className="min-w-0 flex-1">
                    <h2 className="truncate text-sm font-semibold text-white">
                      {player.name}
                    </h2>

                    <div className="mt-1 flex flex-wrap gap-1.5">
                      {player.sports?.map((sport, index) => (
                        <span
                          key={index}
                          className="text-xs text-white/50"
                        >
                          {sport}
                          {index !== player.sports.length - 1 && (
                            <span className="ml-1.5 text-white/20">
                              •
                            </span>
                          )}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Visit Profile Button */}
                  <button
                    onClick={() => visitProfile(player._id)}
                    className="
                      shrink-0
                      rounded-full
                      border border-white/15
                      bg-white/[0.08]
                      px-4 py-2
                      text-xs font-semibold text-white
                      backdrop-blur-md
                      transition-all duration-300
                      hover:bg-white/[0.16]
                      hover:border-white/30
                      active:scale-95
                    "
                  >
                    Visit Profile
                  </button>

                  {/* Distance */}
                  <div className="hidden shrink-0 text-right sm:block">
                    <p className="text-xs text-white/40">
                      {player.distance} km
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* No players */}
          {!loading && players.length === 0 && (
            <div className="py-20 text-center">
              <p className="text-sm text-white/50">
                No players found nearby.
              </p>
            </div>
          )}

        </div>
      </div>
    </Layout>
  );
};

export default Communities;