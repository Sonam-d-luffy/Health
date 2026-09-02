import Activity from "../models/activity.js";
import Player from "../models/playerModel.js";
import Territory from "../models/territory.js";

const CELL_SIZE = 0.005;

const getDistance = (lat1, lng1, lat2, lng2) => {
  const R = 6371;

  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;

  return (
    R *
    2 *
    Math.atan2(
      Math.sqrt(a),
      Math.sqrt(1 - a)
    )
  );
};

const getCellId = (lat, lng) => {
  const latCell = Math.floor(lat / CELL_SIZE);
  const lngCell = Math.floor(lng / CELL_SIZE);

  return `${latCell}_${lngCell}`;
};

const getCellCenter = cellId => {
  const [latCell, lngCell] = cellId
    .split("_")
    .map(Number);

  return {
    lat: (latCell + 0.5) * CELL_SIZE,
    lng: (lngCell + 0.5) * CELL_SIZE
  };
};

export const saveActivity = async (req, res) => {
  try {
    const {
      userId,
      distance,
      duration,
      location,
      route = []
    } = req.body;

    console.log("SAVE ACTIVITY REQUEST:", {
      userId,
      distance,
      duration,
      location,
      routePoints: route.length
    });

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "userId is required"
      });
    }

    const distanceNum = Number(distance) || 0;
    const durationNum = Number(duration) || 0;

    const player = await Player.findById(userId)
      .select("name")
      .lean();

    if (!player) {
      return res.status(404).json({
        success: false,
        message: "Player not found"
      });
    }

    const speed =
      durationNum > 0
        ? distanceNum / (durationNum / 3600)
        : 0;

    const today = new Date().toLocaleDateString(
      "en-CA",
      {
        timeZone: "Asia/Kolkata"
      }
    );

    let activity = await Activity.findOne({
      userId
    });

    if (!activity) {
      activity = await Activity.create({
        userId,

        todayDistance: distanceNum,
        todayDuration: durationNum,

        maxDailyDistance: distanceNum,
        maxDailyDistanceSpeed: speed,
        maxDailyDistanceLocation:
          location || route[0] || null,
        maxDailyDistanceDate: today,

        totalDistance: distanceNum,
        totalDuration: durationNum,
        totalAvgSpeed: speed,

        fastestDistance: distanceNum,
        fastestDistanceSpeed: speed,
        fastestDistanceLocation:
          location || route[0] || null,
        fastestDistanceDate: today,

        totalActivities: 1,
        lastActivityDate: today,

        route
      });
    } else {
      if (activity.lastActivityDate !== today) {
        activity.todayDistance = distanceNum;
        activity.todayDuration = durationNum;
        activity.lastActivityDate = today;
      } else {
        activity.todayDistance += distanceNum;
        activity.todayDuration += durationNum;
      }

      activity.totalDistance += distanceNum;
      activity.totalDuration += durationNum;
      activity.totalActivities += 1;

      activity.totalAvgSpeed =
        activity.totalDuration > 0
          ? activity.totalDistance /
            (activity.totalDuration / 3600)
          : 0;

      activity.route = route;

      if (
        activity.todayDistance >
        activity.maxDailyDistance
      ) {
        activity.maxDailyDistance =
          activity.todayDistance;

        activity.maxDailyDistanceSpeed =
          activity.todayDuration > 0
            ? activity.todayDistance /
              (activity.todayDuration / 3600)
            : 0;

        activity.maxDailyDistanceLocation =
          location || route[0] || null;

        activity.maxDailyDistanceDate = today;
      }

      if (
        speed >
        activity.fastestDistanceSpeed
      ) {
        activity.fastestDistance = distanceNum;
        activity.fastestDistanceSpeed = speed;

        activity.fastestDistanceLocation =
          location || route[0] || null;

        activity.fastestDistanceDate = today;
      }

      await activity.save();
    }

    console.log(
      "Activity saved. Processing territory..."
    );

    const cellDistances = {};

    if (Array.isArray(route)) {
      for (let i = 1; i < route.length; i++) {
        const previous = route[i - 1];
        const current = route[i];

        if (!previous || !current) {
          continue;
        }

        if (
          previous.lat == null ||
          previous.lng == null ||
          current.lat == null ||
          current.lng == null
        ) {
          continue;
        }

        const segmentDistance = getDistance(
          Number(previous.lat),
          Number(previous.lng),
          Number(current.lat),
          Number(current.lng)
        );

        console.log("Territory segment:", {
          from: {
            lat: previous.lat,
            lng: previous.lng
          },
          to: {
            lat: current.lat,
            lng: current.lng
          },
          distance: segmentDistance
        });

        const cellId = getCellId(
          Number(current.lat),
          Number(current.lng)
        );

        if (!cellDistances[cellId]) {
          cellDistances[cellId] = {
            distance: 0,
            lat: Number(current.lat),
            lng: Number(current.lng)
          };
        }

        cellDistances[cellId].distance +=
          segmentDistance;
      }
    }

    console.log(
      "TERRITORY CELLS:",
      cellDistances
    );

    for (const [cellId, data] of Object.entries(
      cellDistances
    )) {
      const center = getCellCenter(cellId);

      const territoryDistance = Number(
        data.distance.toFixed(3)
      );

      let territory =
        await Territory.findOne({
          cellId
        });

      if (!territory) {
        console.log(
          "Creating territory:",
          cellId
        );

        territory =
          await Territory.create({
            cellId,
            center,
            champion: userId,
            championName: player.name,
            distance: territoryDistance
          });

        console.log(
          "Territory created:",
          territory._id
        );
      } else {
        console.log(
          "Existing territory:",
          cellId,
          "Current:",
          territory.distance,
          "New:",
          territoryDistance
        );

        if (
          territoryDistance >
          territory.distance
        ) {
          territory.champion = userId;
          territory.championName =
            player.name;
          territory.distance =
            territoryDistance;
          territory.center = center;

          await territory.save();

          console.log(
            "Territory champion updated:",
            cellId
          );
        }
      }
    }

    return res.status(200).json({
      success: true,
      message: "Activity saved successfully",
      activity,
      territoriesProcessed:
        Object.keys(cellDistances).length
    });
  } catch (error) {
    console.error(
      "Save activity error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getLeaderboard = async (
  req,
  res
) => {
  try {
    const {
      type = "total",
      limit = 20
    } = req.query;

    let sortField;
    let fields;

    switch (type) {
      case "today":
        sortField = {
          todayDistance: -1
        };

        fields =
          "userId todayDistance todayDuration";

        break;

      case "maxDaily":
        sortField = {
          maxDailyDistance: -1
        };

        fields =
          "userId maxDailyDistance maxDailyDistanceSpeed maxDailyDistanceLocation maxDailyDistanceDate";

        break;

      case "fastest":
        sortField = {
          fastestDistanceSpeed: -1
        };

        fields =
          "userId fastestDistance fastestDistanceSpeed fastestDistanceLocation fastestDistanceDate";

        break;

      case "total":
      default:
        sortField = {
          totalDistance: -1
        };

        fields =
          "userId totalDistance totalDuration totalAvgSpeed";

        break;
    }

    const activities =
      await Activity.find({})
        .select(fields)
        .populate("userId", "name")
        .sort(sortField)
        .limit(
          Math.min(
            Number(limit) || 20,
            100
          )
        )
        .lean();

    const leaderboard =
      activities.map(
        (activity, index) => ({
          rank: index + 1,

          userId:
            activity.userId?._id,

          name:
            activity.userId?.name ||
            "Unknown User",

          ...(type === "today" && {
            distance: Number(
              (
                activity.todayDistance ||
                0
              ).toFixed(2)
            ),

            duration:
              activity.todayDuration ||
              0
          }),

          ...(type === "total" && {
            distance: Number(
              (
                activity.totalDistance ||
                0
              ).toFixed(2)
            ),

            duration:
              activity.totalDuration ||
              0,

            avgSpeed: Number(
              (
                activity.totalAvgSpeed ||
                0
              ).toFixed(2)
            )
          }),

          ...(type === "maxDaily" && {
            distance: Number(
              (
                activity.maxDailyDistance ||
                0
              ).toFixed(2)
            ),

            speed: Number(
              (
                activity.maxDailyDistanceSpeed ||
                0
              ).toFixed(2)
            ),

            location:
              activity.maxDailyDistanceLocation,

            date:
              activity.maxDailyDistanceDate
          }),

          ...(type === "fastest" && {
            distance: Number(
              (
                activity.fastestDistance ||
                0
              ).toFixed(2)
            ),

            speed: Number(
              (
                activity.fastestDistanceSpeed ||
                0
              ).toFixed(2)
            ),

            location:
              activity.fastestDistanceLocation,

            date:
              activity.fastestDistanceDate
          })
        })
      );

    return res.status(200).json({
      success: true,
      type,
      count: leaderboard.length,
      leaderboard
    });
  } catch (error) {
    console.error(
      "Leaderboard error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
export const getUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "userId is required"
      });
    }

    const player = await Player.findById(userId)
      .select("-password")
      .lean();

    if (!player) {
      return res.status(404).json({
        success: false,
        message: "Player not found"
      });
    }

    const activity = await Activity.findOne({
      userId
    }).lean();

    return res.status(200).json({
      success: true,
      player,
      activity: activity || {
        todayDistance: 0,
        todayDuration: 0,
        maxDailyDistance: 0,
        maxDailyDistanceSpeed: 0,
        maxDailyDistanceLocation: null,
        maxDailyDistanceDate: null,
        totalDistance: 0,
        totalDuration: 0,
        totalAvgSpeed: 0,
        fastestDistance: 0,
        fastestDistanceSpeed: 0,
        fastestDistanceLocation: null,
        fastestDistanceDate: null,
        totalActivities: 0
      }
    });
  } catch (error) {
    console.error("Get profile error:", error);

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
