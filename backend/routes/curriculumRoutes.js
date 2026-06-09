const express = require("express")

const router = express.Router()

const {
  uploadVideo,
} = require("../middleware/upload")
const verifyAdmin =
require(
  "../middleware/adminMiddleware"
)
const {

  getCurriculum,
  getTopicVideo,

  addModule,
  updateModule,
  deleteModule,

  addTopic,
  updateTopic,
  updateTopicVideo,
  deleteTopic,

} = require("../controllers/curriculumController")

// =========================
// MODULE ROUTES
// =========================
router.post(
  "/module/add",
  verifyAdmin,
  addModule
)

router.put(
  "/module/:id",
  verifyAdmin,
  updateModule
)

router.delete(
  "/module/:id",
  verifyAdmin,
  deleteModule
)

// =========================
// TOPIC ROUTES
// =========================
router.post(
  "/topic/add",
  verifyAdmin,
  addTopic
)

router.get(
  "/topic/:id/video",
  getTopicVideo
)

router.get(
  "/topics/:id/video",
  getTopicVideo
)

router.put(
  "/topic/:id",
  verifyAdmin,
  updateTopic
)


router.put(
  "/topic/:id/video",
  verifyAdmin,
  uploadVideo.single("video"),
  updateTopicVideo
)

router.put(
  "/topics/:id/video",
  verifyAdmin,
  uploadVideo.single("video"),
  updateTopicVideo
)

router.delete(
  "/topic/:id",
  verifyAdmin,
  deleteTopic
)

// =========================
// GET CURRICULUM
// =========================
router.get("/:slug", getCurriculum)

module.exports = router
