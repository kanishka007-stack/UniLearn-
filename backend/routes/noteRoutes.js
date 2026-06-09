const express = require("express")

const router = express.Router()

const {
  getCourseNotes,
  addNote,
  deleteNote,
  updateNote,
} = require("../controllers/noteController")

const {
  uploadNote,
} = require("../middleware/upload")

const verifyAdmin =
require(
  "../middleware/adminMiddleware"
)

// =========================
// GET NOTES
// =========================
router.get(
  "/:slug",
  getCourseNotes
)

// =========================
// ADD NOTE
// =========================
router.post(
  "/add",
  verifyAdmin,
  uploadNote.single("note"),
  addNote
)

// =========================
// DELETE NOTE
// =========================
router.delete(
  "/:id",
  verifyAdmin,
  deleteNote
)

// =========================
// UPDATE NOTE
// =========================
router.put(
  "/:id",
  verifyAdmin,
  uploadNote.single("note"),
  updateNote
)

module.exports = router