const db = require("../config/db");

// =========================
// GET ALL COURSES
// =========================
const getCourses = (req, res) => {

  const query = "SELECT * FROM courses ORDER BY id DESC";

  db.query(query, (err, result) => {

    if (err) {

      console.log("MYSQL ERROR:")
      console.log(err)

      return res.status(500).json({
        success: false,
        message: "Failed to fetch courses",
      });

    }

    res.json({
      success: true,
      courses: result,
    });

  });

};

// =========================
// ADD COURSE
// =========================
const addCourse = (req, res) => {

  const {
    title,
    slug,
    category,
    lessons,
    duration,
    level,
    rating,
    price,
    image: bodyImage,
    description,

    about,
    instructor_name,
    instructor_role,
    instructor_image,
    language,
    students,
    certificate,

  } = req.body;
  const image = req.file
    ? `http://localhost:5000/uploads/images/${req.file.filename}`
    : bodyImage || ""
  console.log(req.body)

  const query = `
    INSERT INTO courses
    (
      title,
      slug,
      category,
      lessons,
      duration,
      level,
      rating,
      price,
      image,
      description,

      about,
      instructor_name,
      instructor_role,
      instructor_image,
      language,
      students,
      certificate

    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    query,
    [
      title,
      slug,
      category,
      lessons,
      duration,
      level,
      rating,
      price,
      image,
      description,

      about,
      instructor_name,
      instructor_role,
      instructor_image,
      language,
      students,
      certificate,

    ],
    (err, result) => {

      if (err) {

        console.log(err);

        return res.status(500).json({
          success: false,
          message: "Failed to add course",
        });

      }

      res.json({
        success: true,
        message: "Course added successfully",
      });

    }
  );

};

// =========================
// DELETE COURSE
// =========================
const deleteCourse = (req, res) => {

  const { id } = req.params;

  const query = "DELETE FROM courses WHERE id = ?";

  db.query(query, [id], (err, result) => {

    if (err) {

      console.log(err);

      return res.status(500).json({
        success: false,
        message: "Failed to delete course",
      });

    }

    res.json({
      success: true,
      message: "Course deleted successfully",
    });

  });

};
// =========================
// GET SINGLE COURSE
// =========================
const getCourseBySlug = (req, res) => {

  const { slug } = req.params;

  const query = `
    SELECT *
    FROM courses
    WHERE slug = ?
      OR id = ?
    LIMIT 1
  `;

  db.query(query, [slug, slug], (err, result) => {

    if (err) {

      console.log(err);

      return res.status(500).json({
        success: false,
        message: "Server error",
      });

    }

    if (result.length === 0) {

      return res.status(404).json({
        success: false,
        message: "Course not found",
      });

    }

    res.json({
      success: true,
      course: result[0],
    });

  });

};
// =========================
// GET CURRICULUM
// =========================

const getCurriculum = (req, res) => {

  const moduleQuery = `
    SELECT *
    FROM course_modules
    ORDER BY id ASC
  `;

  db.query(moduleQuery, (err, modules) => {

    if (err) {

      console.log(err);

      return res.status(500).json({
        success: false,
        message: "Failed to fetch modules"
      });

    }

    const topicQuery = `
      SELECT *
      FROM course_topics
      ORDER BY id ASC
    `;

    db.query(topicQuery, (err, topics) => {

      if (err) {

        console.log(err);

        return res.status(500).json({
          success: false,
          message: "Failed to fetch topics"
        });

      }

      res.json({
        success: true,
        modules,
        topics
      });

    });

  });

};
// =========================
// UPDATE COURSE
// =========================
const updateCourse = (req, res) => {

  const { id } = req.params;

  const {
    title,
    slug,
    category,
    lessons,
    duration,
    level,
    rating,
    price,
    image: bodyImage,
    description,
    about,
    instructor_name,
    instructor_role,
    instructor_image,
    language,
    students,
    certificate,
  } = req.body;
  const image = req.file
    ? `http://localhost:5000/uploads/images/${req.file.filename}`
    : bodyImage || ""

  const query = `
    UPDATE courses
    SET
      title = ?,
      slug = ?,
      category = ?,
      lessons = ?,
      duration = ?,
      level = ?,
      rating = ?,
      price = ?,
      image = ?,
      description = ?,
      about = ?,
      instructor_name = ?,
      instructor_role = ?,
      instructor_image = ?,
      language = ?,
      students = ?,
      certificate = ?
    WHERE id = ?
  `;

  db.query(
    query,
    [
      title,
      slug,
      category,
      lessons,
      duration,
      level,
      rating,
      price,
      image,
      description,
      about,
      instructor_name,
      instructor_role,
      instructor_image,
      language,
      students,
      certificate,
      id,
    ],
    (err, result) => {

      if (err) {

        console.log(err);

        return res.status(500).json({
          success: false,
          message: "Failed to update course",
        });

      }

      res.json({
        success: true,
        message: "Course updated successfully",
      });

    }
  );

};
module.exports = {
  getCourses,
  getCourseBySlug,
  addCourse,
  deleteCourse,
  getCurriculum,
  updateCourse,
  
};
