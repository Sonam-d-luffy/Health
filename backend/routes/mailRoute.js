import express from 'express';
import Report from '../models/report.js';
import Player from '../models/playerModel.js';
import { sendStatusEmail } from '../utils/email.js';

const router = express.Router();

router.post("/:reportId/send-mail", async (req, res) => {
  try {
    const { reportId } = req.params

    const report = await Report.findById(reportId)

    if (!report) {
      return res.status(404).json({
        message: "Report not found"
      })
    }

    if (report.mailSent) {
      return res.status(400).json({
        message: "Mail has already been sent for this report"
      })
    }

    const player = await Player.findById(report.playerId)

    if (!player || !player.email) {
      return res.status(404).json({
        message: "Player email not found"
      })
    }

    await sendStatusEmail(
      player.email,
      player.name,
      report.status
    )

    report.mailSent = true
    await report.save()

    return res.status(200).json({
      message: `Mail sent to ${player.email}`,
      mailSent: true
    })
  } catch (error) {
    console.error("Report Email Error:", error)

    return res.status(500).json({
      message: "Server error",
      error: error.message
    })
  }
})
export default router;
