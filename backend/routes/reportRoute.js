import express from 'express';
import Report from '../models/report.js';
import Player from '../models/playerModel.js';
import Institute from '../models/InstituteModel.js';
import upload from '../middleware/multer.js';
import mongoose from 'mongoose';
const router = express.Router();

router.post('/:playerId/:academyId', upload.single('image'), async (req, res) => {
  try {
    const { playerId, academyId } = req.params;
    const {
      height,
      weight,
      bmi,
      bloodPressure,
      experience,
      sports,
      achievements,
      status,
    } = req.body;

    const player = await Player.findById(playerId);
    const academy = await Institute.findById(academyId);

    if (!player || !academy) {
      return res.status(404).json({ message: 'Player or Academy not found.' });
    }

    if (!height || !sports || sports.length === 0) {
      return res.status(400).json({
        message: 'Height and at least one sport are required.',
      });
    }

    const newReport = new Report({
      playerId: player._id,
      academyId: academy._id,
      name: player.name,
      age: player.age,
      height,
      weight,
      bmi,
      bloodPressure,
      experience,
      sports: Array.isArray(sports) ? sports : sports.split(','), // handle array or CSV
      achievements,
      image: req.file?.path || '', // optional image
      status: status || 'Pending',
     
    });

    const savedReport = await newReport.save();

    res.status(201).json({
      message: 'Report submitted successfully',
      report: savedReport,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});
router.get('/:academyId/report', async (req, res) => {
  try {
    const { academyId } = req.params;
    const { search, status, sortBy = 'createdAt', order = 'desc' } = req.query;
    const filter = { academyId };
    if (status && status !== 'All') {
      filter.status = status;
    }
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { sports: { $regex: search, $options: 'i' } }
      ];
    }
    const allowedSortFields = ['name', 'age', 'height', 'weight', 'bmi', 'experience', 'status', 'createdAt'];
    const sortField = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt';
    const sortOrder = order === 'asc' ? 1 : -1;
    const reports = await Report.find(filter).sort({ [sortField]: sortOrder });
    if (reports.length === 0) {
      return res.status(404).json({
        message: 'Sorry, you do not have any submissions',
        reports: []
      });
    }
    return res.status(200).json({
      message: 'Your submissions',
      count: reports.length,
      reports
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
});


router.get('/player/:playerId', async (req, res) => {
  try {
    const { playerId } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(playerId)) {
      return res.status(400).json({ success: false, message: 'Invalid player ID' });
    }

    const reports = await Report.find({ playerId }).populate("academyId", "name"); 

    if (!reports || reports.length === 0) {
      return res.status(404).json({ success: false, message: 'No reports found for this player' });
    }

    return res.status(200).json({
      success: true,
      message: 'Reports fetched successfully',
      count: reports.length,
      reports,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
});

router.patch('/:reportId/status', async (req, res) => {
  try {
    const { reportId } = req.params;
    const { status } = req.body;

    if (!['Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const report = await Report.findByIdAndUpdate(
      reportId,
      { status },
      { new: true }
    );

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    res.json({ message: `Report marked as ${status}`, report });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
