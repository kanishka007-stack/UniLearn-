const db = require("../config/db")

const createCertificateId = (courseSlug) => {
  const courseCode = String(courseSlug || "course")
    .replace(/[^a-z0-9]/gi, "")
    .slice(0, 6)
    .toUpperCase()

  return `UL-${courseCode}-${Date.now()}`
}

// =========================
// GENERATE CERTIFICATE
// =========================
const generateCertificate = (req, res) => {

  const {
    user_email,
    course_slug,
    student_name,
    completion_date,
  } = req.body

  if (!course_slug || !student_name) {
    return res.status(400).json({
      success: false,
      message: "Course and student name are required",
    })
  }

  const certificateId =
    createCertificateId(course_slug)

  const completionDate =
    completion_date ||
    new Date().toLocaleDateString()

  const query = `
    INSERT INTO certificates
    (
      user_email,
      course_slug,
      student_name,
      certificate_id,
      completion_date
    )
    VALUES (?, ?, ?, ?, ?)
  `

  db.query(
    query,
    [
      user_email || "",
      course_slug,
      student_name,
      certificateId,
      completionDate,
    ],
    (err) => {

      if (err) {

        console.log(err)

        return res.status(500).json({
          success: false,
          message: "Failed to generate certificate",
        })

      }

      res.json({
        success: true,
        message: "Certificate generated",
        certificate: {
          user_email: user_email || "",
          course_slug,
          student_name,
          certificate_id: certificateId,
          completion_date: completionDate,
        },
      })

    }
  )

}

module.exports = {
  generateCertificate,
}
