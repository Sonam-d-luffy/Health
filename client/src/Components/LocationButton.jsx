import { useMap } from "react-leaflet";

const LocationButton = ({ setPosition }) => {
  const map = useMap();

  const locateUser = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const pos = [coords.latitude, coords.longitude];
        setPosition(pos);
        map.setView(pos, 17);
      },
      error => {
        console.error("Location error:", error);
        alert("Unable to get your location");
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  return (
    <button
      onClick={locateUser}
      className="absolute z-[1000] bottom-5 right-5 bg-white p-3 rounded-full shadow-lg hover:scale-105 transition"
      title="My Location"
    >
      📍
    </button>
  );
};

export default LocationButton;