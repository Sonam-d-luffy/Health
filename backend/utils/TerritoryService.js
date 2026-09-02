import Territory from "../models/territory.js";

const CELL_SIZE = 0.01;

export const getCellId = (lat, lng) => {
  const latCell = Math.floor(lat / CELL_SIZE);
  const lngCell = Math.floor(lng / CELL_SIZE);

  return `${latCell}_${lngCell}`;
};

export const getCellCenter = (lat, lng) => {
  const latCell = Math.floor(lat / CELL_SIZE);
  const lngCell = Math.floor(lng / CELL_SIZE);

  return {
    lat: (latCell + 0.5) * CELL_SIZE,
    lng: (lngCell + 0.5) * CELL_SIZE
  };
};

export const getOrCreateTerritory = async ({
  lat,
  lng,
  areaName = "Unknown Area",
  city = "",
  state = "",
  country = ""
}) => {
  const cellId = getCellId(lat, lng);

  let territory = await Territory.findOne({ cellId });

  if (territory) {
    return territory;
  }

  territory = await Territory.create({
    cellId,
    name: areaName,
    city,
    state,
    country,
    center: getCellCenter(lat, lng),
    champion: null,
    championDistance: 0
  });

  return territory;
};

export const updateTerritoryChampion = async ({
  userId,
  distance,
  lat,
  lng,
  areaName,
  city,
  state,
  country
}) => {
  const territory = await getOrCreateTerritory({
    lat,
    lng,
    areaName,
    city,
    state,
    country
  });

  if (distance > territory.championDistance) {
    territory.champion = userId;
    territory.championDistance = distance;

    await territory.save();

    return {
      territory,
      newChampion: true
    };
  }

  return {
    territory,
    newChampion: false
  };
};