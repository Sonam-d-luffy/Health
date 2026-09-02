import axios from "axios";

export const getNearbySports = async (req, res) => {
    try {
        const {
            lat,
            lng,
            radius = 5,
            sport = ""
        } = req.query;

        // -----------------------------
        // Validate location
        // -----------------------------

        if (!lat || !lng) {
            return res.status(400).json({
                success: false,
                message: "Latitude and longitude are required"
            });
        }

        const latitude = Number(lat);
        const longitude = Number(lng);
        const radiusMeters = Number(radius) * 1000;

        if (
            !Number.isFinite(latitude) ||
            !Number.isFinite(longitude) ||
            !Number.isFinite(radiusMeters)
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid latitude, longitude or radius"
            });
        }

        // -----------------------------
        // Geoapify categories
        // -----------------------------

        const categories = [
            "sport",
            "sport.sports_centre",
            "sport.stadium",
            "sport.pitch",
            "sport.swimming_pool"
        ].join(",");

        // -----------------------------
        // API request
        // -----------------------------

        console.log("Searching Geoapify...");
        console.log({
            latitude,
            longitude,
            radiusMeters,
            sport
        });

        const response = await axios.get(
            "https://api.geoapify.com/v2/places",
            {
                params: {
                    categories,

                    filter:
                        `circle:${longitude},${latitude},${radiusMeters}`,

                    bias:
                        `proximity:${longitude},${latitude}`,

                    limit: 50,

                    apiKey:
                        process.env.GEOAPIFY_API_KEY
                },

                timeout: 30000
            }
        );

        const features = response.data.features || [];

        console.log(
            `Geoapify returned ${features.length} places`
        );

        // -----------------------------
        // Convert Geoapify response
        // -----------------------------

      let facilities = features
    .filter((feature) => {
        return feature.properties?.name;
    })
    .map((feature) => {

        const properties = feature.properties || {};
        const coordinates =
            feature.geometry?.coordinates || [];

        return {
            id:
                properties.place_id ||
                `${coordinates[0]}-${coordinates[1]}`,

            name: properties.name,

            latitude: coordinates[1],
            longitude: coordinates[0],

            categories:
                properties.categories || [],

            sport:
                properties.sport ||
                "Not specified",

            address:
                properties.formatted ||
                "",

            street:
                properties.street ||
                "",

            city:
                properties.city ||
                "",

            postcode:
                properties.postcode ||
                "",

            country:
                properties.country ||
                "",

            phone:
                properties.contact?.phone ||
                properties.phone ||
                null,

            website:
                properties.website ||
                null,

            openingHours:
                properties.opening_hours ||
                null
        };
    });

        return res.status(200).json({
            success: true,
            count: facilities.length,
            facilities
        });

    } catch (error) {

        console.error(
            "================================"
        );

        console.error(
            "GEOAPIFY ERROR"
        );

        console.error(
            "================================"
        );

        console.error(
            "Message:",
            error.message
        );

        if (error.response) {

            console.error(
                "Status:",
                error.response.status
            );

            console.error(
                "Data:",
                error.response.data
            );
        }

        console.error(
            "================================"
        );

        return res.status(500).json({
            success: false,
            message:
                "Failed to fetch nearby sports facilities",

            error:
                error.response?.data ||
                error.message
        });
    }
};