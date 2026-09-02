export const getCellId = (lat, lng) => {
  const size = 0.005;
  const latCell = Math.floor(lat / size);
  const lngCell = Math.floor(lng / size);

  return `${latCell}_${lngCell}`;
};