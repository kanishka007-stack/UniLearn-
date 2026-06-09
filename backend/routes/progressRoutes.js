const express = require("express")

const router = express.Router()

const {
  saveProgress,
  getProgress,
  saveWatchTime,
  completeTopic,
  getResumeProgress,
} = require("../controllers/progressController")

// =========================
// SAVE PROGRESS
// =========================
router.post("/", saveProgress)

router.put("/watch-time", saveWatchTime)

router.put("/complete", completeTopic)

router.get("/resume/:courseId", getResumeProgress)

// =========================
// GET PROGRESS
// =========================
router.get("/:userId/:courseId", getProgress)

module.exports = router
