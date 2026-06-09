const db = require("../config/db")

// =========================
// GET QUIZZES
// =========================
const getQuizByCourse = (req, res) => {

  const { slug } = req.params

  const query =
    "SELECT * FROM quizzes WHERE course_slug = ? ORDER BY id ASC"

  db.query(query, [slug], (err, result) => {

    if (err) {

      console.log(err)

      return res.status(500).json({
        success: false,
        message: "Failed to fetch quizzes",
      })

    }

    res.json({
      success: true,
      quizzes: result,
    })

  })

}

// =========================
// ADD QUIZ
// =========================
const addQuiz = (req, res) => {

  const {
    course_slug,
    question,
    option_a,
    option_b,
    option_c,
    option_d,
    correct_answer,
  } = req.body

  const query = `
    INSERT INTO quizzes
    (
      course_slug,
      question,
      option_a,
      option_b,
      option_c,
      option_d,
      correct_answer
    )
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `

  db.query(
    query,
    [
      course_slug,
      question,
      option_a,
      option_b,
      option_c,
      option_d,
      correct_answer,
    ],
    (err, result) => {

      if (err) {

        console.log(err)

        return res.status(500).json({
          success: false,
          message: "Failed to add quiz",
        })

      }

      res.json({
        success: true,
        message: "Quiz added successfully",
      })

    }
  )

}

const deleteQuiz = (req, res) => {

  const { id } = req.params

  db.query(
    "DELETE FROM quizzes WHERE id = ?",
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
// UPDATE QUIZ
// =========================
const updateQuiz = (req, res) => {

  const { id } = req.params

  const {
    question,
    option_a,
    option_b,
    option_c,
    option_d,
    correct_answer,
  } = req.body

  const query = `
    UPDATE quizzes
    SET
      question = ?,
      option_a = ?,
      option_b = ?,
      option_c = ?,
      option_d = ?,
      correct_answer = ?
    WHERE id = ?
  `

  db.query(
    query,
    [
      question,
      option_a,
      option_b,
      option_c,
      option_d,
      correct_answer,
      id,
    ],
    (err) => {

      if (err) {

        console.log(err)

        return res.status(500).json({
          success: false,
          message: "Failed to update quiz",
        })

      }

      res.json({
        success: true,
        message: "Quiz updated successfully",
      })

    }
  )

}
module.exports = {
  getQuizByCourse,
  addQuiz,
  deleteQuiz,
  updateQuiz,
}
