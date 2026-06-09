const db = require("../config/db")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

exports.adminLogin = (req, res) => {

  const { email, password } = req.body

  db.query(
    "SELECT * FROM admins WHERE email = ?",
    [email],
    async (err, results) => {

      if (err) {
        return res.status(500).json({
          message: "Server Error",
        })
      }

      if (results.length === 0) {
        return res.status(401).json({
          message: "Invalid Email",
        })
      }

      const admin = results[0]

      const isMatch =
        await bcrypt.compare(
          password,
          admin.password
        )

      if (!isMatch) {
        return res.status(401).json({
          message: "Invalid Credentials",
        })
      }

      const token = jwt.sign(
        {
          id: admin.id,
          role: admin.role,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "7d",
        }
      )

      res.json({
        token,
        admin: {
          id: admin.id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
        },
      })

    }
  )

}