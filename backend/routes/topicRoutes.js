const express = require("express")

const router = express.Router()

const {
  updateTopicVideo,
} = require("../controllers/curriculumController")

const verifyAdmin =
require(
  "../middleware/adminMiddleware"
)

router.put(
  "/:id/video",
  verifyAdmin,
  updateTopicVideo
)

module.exports = router