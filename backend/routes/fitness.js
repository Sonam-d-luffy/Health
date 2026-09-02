import Fitness from "../models/fitness.js";

export const saveExercise = async (req, res) => {
  try {
    const {
      userId,
      exercise,
      count,
      time
    } = req.body;

    if (!userId || !exercise) {
      return res.status(400).json({
        success: false,
        message: "userId and exercise are required"
      });
    }

    const exerciseMap = {
      bicep_curl: "bicepCurls",
      squat: "squats",
      pullup: "pullUps",
      jogging: "jogging"
    };

    const field = exerciseMap[exercise];

    if (!field) {
      return res.status(400).json({
        success: false,
        message: "Invalid exercise"
      });
    }

    let fitness = await Fitness.findOne({
      user: userId
    });

    if (!fitness) {
      fitness = new Fitness({
        user: userId
      });
    }

    // Make sure nested object exists
    if (!fitness[field]) {
      fitness[field] = {
        maxCount: 0,
        maxCountTime: 0
      };
    }

    // Update only if this workout is a new maximum
    if (Number(count) > fitness[field].maxCount) {
      fitness[field].maxCount = Number(count);
      fitness[field].maxCountTime = Number(time) || 0;
    }

    await fitness.save();

    return res.status(200).json({
      success: true,
      message: "Fitness data updated",
      data: fitness
    });

  } catch (error) {
    console.error("Fitness update error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};