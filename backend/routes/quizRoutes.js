const express = require("express")

const router = express.Router()

const {
  getQuizByCourse,
  addQuiz,
  deleteQuiz,
  updateQuiz,
} = require("../controllers/quizController")
const verifyAdmin = require("../middleware/adminMiddleware")

router.get("/:slug", getQuizByCourse)

router.post("/add", verifyAdmin ,addQuiz)
router.delete("/:id", verifyAdmin, deleteQuiz)
router.put("/:id", verifyAdmin, updateQuiz)
module.exports = router