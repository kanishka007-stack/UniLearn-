const express = require("express");

const router = express.Router();

const {
  getCourses,
  getCourseBySlug,
  addCourse,
  deleteCourse,
  getCurriculum,
  updateCourse,
} = require("../controllers/courseController");
const {
  uploadImage,
} = require("../middleware/upload")
const verifyAdmin =
require(
  "../middleware/adminMiddleware"
)
// =========================
// GET ALL COURSES
// =========================
router.get("/", getCourses);

// =========================
// GET CURRICULUM
// =========================
router.get("/curriculum/all", getCurriculum);

// =========================
// GET SINGLE COURSE
// =========================
router.get("/:slug", getCourseBySlug);

// =========================
// ADD COURSE
// =========================
router.post(
  "/",
  verifyAdmin,
  uploadImage.single("image"),
  addCourse
);

// =========================
// UPDATE COURSE
// =========================
router.put(
  "/:id",
  verifyAdmin,
  uploadImage.single("image"),
  updateCourse
);

// =========================
// DELETE COURSE
// =========================
router.delete(
  "/:id",
  verifyAdmin,
  deleteCourse
);


module.exports = router;
