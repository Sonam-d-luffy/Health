import axios from "axios";

export const reverseGeocode = async (lat, lng) => {
  try {
    const response = await axios.get(
      "https://api.opencagedata.com/geocode/v1/json",
      {
        params: {
          key: process.env.OPENCAGE_API_KEY,
          q: `${lat},${lng}`,
          language: "en",
          limit: 1
        }
      }
    );

    const result = response.data?.results?.[0];

    if (!result) {
      return {
        areaName: "Unknown Area",
        city: "",
        state: "",
        country: ""
      };
    }

    const components = result.components || {};

    return {
      areaName:
        components.suburb ||
        components.neighbourhood ||
        components.quarter ||
        components.residential ||
        components.city_district ||
        "Unknown Area",

      city:
        components.city ||
        components.town ||
        components.village ||
        "",

      state: components.state || "",

      country: components.country || ""
    };
  } catch (error) {
    console.error(
      "Reverse geocoding error:",
      error.response?.data || error.message
    );

    return {
      areaName: "Unknown Area",
      city: "",
      state: "",
      country: ""
    };
  }
};