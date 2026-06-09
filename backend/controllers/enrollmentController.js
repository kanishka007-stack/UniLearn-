const db = require("../config/db");

// =========================
// ENROLL COURSE
// =========================
const enrollCourse = (req, res) => {

  const {
    user_email,
    course_slug,
    course_name,
    course_price,
  } = req.body;

  const courseReference = course_slug || course_name;

  if (!user_email || !courseReference) {
    return res.status(400).json({
      success: false,
      message: "User email and course are required",
    });
  }

  // CHECK DUPLICATE
  const checkQuery = `
    SELECT * FROM enrollments
    WHERE user_email = ?
    AND course_name IN (?, ?)
  `;

  db.query(
    checkQuery,
    [user_email, courseReference, course_name || courseReference],
    (err, result) => {

      if (err) {

        console.log(err);

        return res.status(500).json({
          success: false,
          message: "Database Error",
        });

      }

      // ALREADY ENROLLED
      if (result.length > 0) {

        return res.status(400).json({
          success: false,
          message: "Already enrolled",
        });

      }

      // INSERT ENROLLMENT
      const insertQuery = `
        INSERT INTO enrollments
        (user_email, course_name, course_price)
        VALUES (?, ?, ?)
      `;

      db.query(
        insertQuery,
        [user_email, courseReference, course_price || "0"],
        (err, result) => {

          if (err) {

            console.log(err);

            return res.status(500).json({
              success: false,
              message: "Enrollment Failed",
            });

          }

          res.json({
            success: true,
            message: "Enrollment Successful",
          });

        }
      );

    }
  );

};

// =========================
// GET USER ENROLLMENTS
// =========================
const getEnrollments = (req, res) => {

  const { email } = req.params;

  const query = `
    SELECT
      e.*,
      c.id AS course_id,
      c.slug AS course_slug,
      c.title,
      c.category,
      c.lessons,
      c.duration,
      c.level,
      c.rating,
      c.price,
      c.image,
      c.description,
      c.about,
      c.instructor_name,
      c.instructor_role,
      c.instructor_image,
      c.language,
      c.students,
      c.certificate
    FROM enrollments e
    LEFT JOIN courses c
      ON c.title = e.course_name
      OR c.slug = e.course_name
    WHERE e.user_email = ?
  `;

  db.query(
    query,
    [email],
    (err, result) => {

      if (err) {

        console.log(err);

        return res.status(500).json({
          success: false,
          message: "Failed to fetch enrollments",
        });

      }

      res.json({
        success: true,
        enrollments: result,
      });

    }
  );

};

module.exports = {
  enrollCourse,
  getEnrollments,
};
