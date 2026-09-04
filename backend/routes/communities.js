import Player from "../models/playerModel.js";
import { haversineDistance } from "../utils/haversine.js";

export const findPeople = async (req, res) => {
    try {
        const {
            latitude,
            longitude,
            radius = 50,
            search = "",
            sport = "",
            sort = "distance",
            page = 1,
            limit = 10
        } = req.query;

        if (!latitude || !longitude) {
            return res.status(400).json({
                success: false,
                message: "Latitude and longitude are required"
            });
        }

        const userLat = Number(latitude);
        const userLon = Number(longitude);
        const maxRadius = Number(radius);

        const pageNumber = Math.max(Number(page), 1);
        const limitNumber = Math.min(Math.max(Number(limit), 1), 50);

        if (
            Number.isNaN(userLat) ||
            Number.isNaN(userLon) ||
            Number.isNaN(maxRadius)
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid latitude, longitude or radius"
            });
        }

        const mongoFilter = {};

        if (search.trim()) {
            mongoFilter.name = {
                $regex: search.trim(),
                $options: "i"
            };
        }

        if (sport.trim()) {
            mongoFilter.sports = {
                $regex: `^${sport.trim()}$`,
                $options: "i"
            };
        }

        const players = await Player.find(
            mongoFilter,
            {
                password: 0,
                email: 0
            }
        ).lean();

        let nearbyPlayers = players
            .filter(player => {
                const playerLat = player.address?.location?.latitude;
                const playerLon = player.address?.location?.longitude;

                return (
                    typeof playerLat === "number" &&
                    typeof playerLon === "number"
                );
            })
            .map(player => {

                const playerLat =
                    player.address.location.latitude;

                const playerLon =
                    player.address.location.longitude;

                const distance = haversineDistance(
                    userLat,
                    userLon,
                    playerLat,
                    playerLon
                );

                return {
                    ...player,
                    distance: Number(distance.toFixed(2))
                };
            });

        nearbyPlayers = nearbyPlayers.filter(
            player => player.distance <= maxRadius
        );

        switch (sort) {

            case "name":
                nearbyPlayers.sort((a, b) =>
                    a.name.localeCompare(b.name)
                );
                break;

            case "newest":
                nearbyPlayers.sort(
                    (a, b) =>
                        new Date(b.createdAt) -
                        new Date(a.createdAt)
                );
                break;

            case "oldest":
                nearbyPlayers.sort(
                    (a, b) =>
                        new Date(a.createdAt) -
                        new Date(b.createdAt)
                );
                break;

            case "distance":
            default:
                nearbyPlayers.sort(
                    (a, b) =>
                        a.distance - b.distance
                );
                break;
        }

        const totalPlayers = nearbyPlayers.length;

        const totalPages = Math.ceil(
            totalPlayers / limitNumber
        );

        const skip =
            (pageNumber - 1) * limitNumber;

        const paginatedPlayers =
            nearbyPlayers.slice(
                skip,
                skip + limitNumber
            );

        return res.status(200).json({
            success: true,

            data: paginatedPlayers,

            pagination: {
                currentPage: pageNumber,
                totalPages,
                totalPlayers,
                limit: limitNumber,
                hasNextPage: pageNumber < totalPages,
                hasPreviousPage: pageNumber > 1
            }
        });

    } catch (error) {

        console.error(
            "Find nearby players error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to find nearby players"
        });
    }
};