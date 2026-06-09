const db = require("../config/db")

// =========================
// GET COURSE NOTES
// =========================
const getCourseNotes = (req, res) => {

  const { slug } = req.params

  const query = `
    SELECT *
    FROM course_notes
    WHERE course_slug = ?
    ORDER BY id ASC
  `

  db.query(
    query,
    [slug],
    (err, result) => {

      if (err) {

        console.log(err)

        return res.status(500).json({
          success: false,
          message: "Failed to fetch notes",
        })

      }

      res.json({
        success: true,
        notes: result,
      })

    }
  )

}

// =========================
// ADD NOTE
// =========================
const addNote = (req, res) => {

  const {
    course_slug,
    title,
    note_url,
  } = req.body

  const uploadedNoteUrl = req.file
    ? `http://localhost:5000/uploads/notes/${req.file.filename}`
    : ""

  const nextNoteUrl =
    uploadedNoteUrl || note_url || ""

  if (!course_slug || !title || !nextNoteUrl) {
    return res.status(400).json({
      success: false,
      message: "Course slug, title, and PDF file are required",
    })
  }

  const query = `
    INSERT INTO course_notes
    (
      course_slug,
      title,
      note_url
    )
    VALUES (?, ?, ?)
  `

  db.query(
    query,
    [
      course_slug,
      title,
      nextNoteUrl,
    ],
    (err, result) => {

      if (err) {

        console.log(err)

        return res.status(500).json({
          success: false,
          message: "Failed to add note",
        })

      }

      res.json({
        success: true,
        message: "Note added successfully",
      })

    }
  )

}
const deleteNote = (req, res) => {

  const { id } = req.params

  db.query(
    "DELETE FROM course_notes WHERE id = ?",
    [id],
    (err) => {

      if (err) {

        return res.status(500).json({
          success: false,
        })

      }

      res.json({
        success: true,
      })

    }
  )

}
// =========================
// UPDATE NOTE
// =========================
const updateNote = (req, res) => {

  const { id } = req.params

  const {
    title,
    note_url,
  } = req.body

  const uploadedNoteUrl = req.file
    ? `http://localhost:5000/uploads/notes/${req.file.filename}`
    : ""

  const nextNoteUrl =
    uploadedNoteUrl ||
    (Object.prototype.hasOwnProperty.call(req.body || {}, "note_url")
      ? note_url
      : undefined)

  const query =
    nextNoteUrl === undefined
      ? `
        UPDATE course_notes
        SET title = ?
        WHERE id = ?
      `
      : `
        UPDATE course_notes
        SET
          title = ?,
          note_url = ?
        WHERE id = ?
      `

  db.query(
    query,
    nextNoteUrl === undefined
      ? [
          title,
          id,
        ]
      : [
          title,
          nextNoteUrl,
          id,
        ],
    (err) => {

      if (err) {

        console.log(err)

        return res.status(500).json({
          success: false,
          message: "Failed to update note",
        })

      }

      res.json({
        success: true,
        message: "Note updated",
      })

    }
  )

}
module.exports = {
  getCourseNotes,
  addNote,
  deleteNote,
  updateNote,
}
