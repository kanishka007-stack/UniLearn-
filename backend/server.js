const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const db = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const courseRoutes = require("./routes/courseRoutes");
const verifyToken = require("./middleware/authMiddleware");
const enrollmentRoutes = require("./routes/enrollmentRoutes");
const app = express();
const progressRoutes = require("./routes/progressRoutes")
const curriculumRoutes =require("./routes/curriculumRoutes")

const noteRoutes = require("./routes/noteRoutes")
const quizRoutes = require("./routes/quizRoutes")
const certificateRoutes = require("./routes/certificateRoutes")
const adminRoutes = require("./routes/adminRoutes")

// =========================
// MIDDLEWARE
// =========================
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/progress", progressRoutes)
app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/enrollments", enrollmentRoutes);
app.use("/api/curriculum",curriculumRoutes)
app.use("/api/admin",adminRoutes)
app.use("/api/notes", noteRoutes)
app.use("/api/quizzes", quizRoutes)
app.use("/api/certificates", certificateRoutes)
// =========================
// TEST ROUTE
// =========================
app.get("/", (req, res) => {
  res.send("Backend Running");
});

// =========================
// PROTECTED ROUTE
// =========================
app.get("/protected", verifyToken, (req, res) => {

  res.json({
    success: true,
    message: "Protected route accessed",
    user: req.user,
  });

});

// =========================
// START SERVER
// =========================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
