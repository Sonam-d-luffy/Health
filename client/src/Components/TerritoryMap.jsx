import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  MapContainer,
  TileLayer,
  Polygon,
  Tooltip,
  useMap
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import Layout from "../Components/Layout";
import Navbar from "../Components/Navbar";
import assets from "../assets/assets";
import { useCurrentUser } from "../Context/CurrentUserContext";

const RecenterMap = ({ territories }) => {
  const map = useMap();

  useEffect(() => {
    if (territories.length > 0) {
      const first = territories[0];

      if (first.center?.lat && first.center?.lng) {
        map.setView(
          [first.center.lat, first.center.lng],
          14
        );
      }
    }
  }, [territories, map]);

  return null;
};

const TerritoryMap = () => {
  const [territories, setTerritories] = useState([]);
  const { currentUser } = useCurrentUser();

  useEffect(() => {
    const fetchTerritories = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/territory/champs`
        );

        console.log("Territories:", response.data);

        setTerritories(
          response.data.territories || []
        );
      } catch (error) {
        console.error(
          "Territory fetch error:",
          error
        );
      }
    };

    fetchTerritories();
  }, []);

  const createPolygon = (lat, lng) => {
    const size = 0.0025;

    return [
      [lat + size, lng - size],
      [lat + size, lng + size],
      [lat - size, lng + size],
      [lat - size, lng - size]
    ];
  };

  return (
    <>
     

      <div className="w-full min-h-screen p-5 pt-24">
        <div className="w-full max-w-7xl mx-auto">
          <div className="mb-5">
            <h1 className="text-3xl font-bold text-white">
              Territory Map
            </h1>

            <p className="text-white/60 mt-1">
              Territories and their current champions
            </p>
          </div>

          <div className="w-full h-[650px] rounded-3xl overflow-hidden border border-white/20 shadow-xl">
            <MapContainer
              center={[28.474, 77.505]}
              zoom={14}
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
                territories={territories}
              />

              {territories.map((territory) => {
                const lat = territory.center?.lat;
                const lng = territory.center?.lng;

                if (
                  lat == null ||
                  lng == null
                ) {
                  return null;
                }

                const polygon =
                  createPolygon(lat, lng);

                return (
                  <Polygon
                    key={
                      territory.cellId ||
                      territory.sector ||
                      `${lat}-${lng}`
                    }
                    positions={polygon}
                    pathOptions={{
                      color: "red",
                      fillColor: "red",
                      fillOpacity: 0.25,
                      weight: 3
                    }}
                  >
                    <Tooltip
                      permanent
                      direction="center"
                      className="territory-label"
                    >
                      <div
                        style={{
                          textAlign: "center",
                          color: "red",
                          fontWeight: "700",
                          minWidth: "120px"
                        }}
                      >
                        <div
                          style={{
                            fontSize: "16px"
                          }}
                        >
                          {territory.sector ||
                            territory.name ||
                            "Territory"}
                        </div>

                        <div
                          style={{
                            fontSize: "13px",
                            marginTop: "3px"
                          }}
                        >
                          🏆{" "}
                          {territory.championName ||
                            territory.winner ||
                            "No Champion"}
                        </div>

                        <div
                          style={{
                            fontSize: "12px",
                            marginTop: "2px"
                          }}
                        >
                          {Number(
                            territory.distance || 0
                          ).toFixed(2)}{" "}
                          km
                        </div>
                      </div>
                    </Tooltip>
                  </Polygon>
                );
              })}
            </MapContainer>
          </div>
        </div>
      </div>
    </>
  );
};

export default TerritoryMap;
