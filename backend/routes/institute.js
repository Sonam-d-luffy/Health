import Institute from "../models/InstituteModel.js";

export const getInstituteProfile = async (req, res) => {
  try {
    const institute = await Institute.findById(req.params.id).select("-password");

    if (!institute) {
      return res.status(404).json({
        success: false,
        message: "Institute not found"
      });
    }

    return res.status(200).json({
      success: true,
      institute
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};