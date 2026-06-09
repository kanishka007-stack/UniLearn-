const express = require("express");

const router = express.Router();

const {
  enrollCourse,
  getEnrollments,
} = require("../controllers/enrollmentController");

// ENROLL
router.post("/", enrollCourse);

// GET USER ENROLLMENTS
router.get("/:email", getEnrollments);

module.exports = router;