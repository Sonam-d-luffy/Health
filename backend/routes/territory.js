import Territory from "../models/territory.js";

export const getTerritories = async (req, res) => {
  try {
    const territories = await Territory.find({})
      .populate("champion", "name")
      .lean();

    const result = territories.map((territory) => ({
      cellId: territory.cellId,
      center: territory.center,
      distance: territory.distance,
      championName:
        territory.championName ||
        territory.champion?.name ||
        "Unknown Player"
    }));

    res.status(200).json({
      success: true,
      territories: result
    });
  } catch (error) {
    console.error("Get territories error:", error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
export const getTerritory = async (req, res) => {
  try {
    const { name } = req.params;

    const territory = await Territory.findOne({ name })
      .populate("champion", "name")
      .lean();

    if (!territory) {
      return res.status(404).json({
        success: false,
        message: "Territory not found"
      });
    }

    res.status(200).json({
      success: true,
      territory
    });
  } catch (error) {
    console.error("Territory error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch territory"
    });
  }
};