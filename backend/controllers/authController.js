const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const db = require("../config/db");

// =========================
// REGISTER
// =========================
const registerUser = async (req, res) => {

  const { name, email, password } = req.body;

  const checkUserQuery =
    "SELECT * FROM users WHERE email = ?";

  db.query(
    checkUserQuery,
    [email],
    async (err, result) => {

      if (err) {

        console.log(err);

        return res.status(500).json({
          success: false,
          message: "Server Error",
        });

      }

      if (result.length > 0) {

        return res.status(400).json({
          success: false,
          message: "User already exists",
        });

      }

      const hashedPassword =
        await bcrypt.hash(password, 10);

      const insertQuery =
        "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";

      db.query(
        insertQuery,
        [name, email, hashedPassword],
        (err) => {

          if (err) {

            console.log(err);

            return res.status(500).json({
              success: false,
              message: "Registration Failed",
            });

          }

          res.json({
            success: true,
            message: "Registration Successful",
          });

        }
      );

    }
  );

};

// =========================
// LOGIN
// =========================
const loginUser = async (req, res) => {

  const { email, password } = req.body;

  const query =
    "SELECT * FROM users WHERE email = ?";

  db.query(
    query,
    [email],
    async (err, result) => {

      if (err) {

        console.log(err);

        return res.status(500).json({
          success: false,
          message: "Server Error",
        });

      }

      if (result.length === 0) {

        return res.status(400).json({
          success: false,
          message: "User not found",
        });

      }

      const user = result[0];

      const isMatch =
        await bcrypt.compare(
          password,
          user.password
        );

      if (!isMatch) {

        return res.status(400).json({
          success: false,
          message: "Invalid Password",
        });

      }

      const token = jwt.sign(

        {
          id: user.id,
          email: user.email,
        },

        process.env.JWT_SECRET,

        {
          expiresIn: "1d",
        }

      );

      res.json({
        success: true,
        message: "Login Successful",
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      });

    }
  );

};

// =========================
// FORGOT PASSWORD
// =========================
const forgotPassword = (req, res) => {

  const { email } = req.body;

  const token =
    crypto.randomBytes(32).toString("hex");

  const expiry =
    Date.now() + 1000 * 60 * 15;

  const query = `
    UPDATE users
    SET
      reset_token = ?,
      reset_token_expiry = ?
    WHERE email = ?
  `;

  db.query(
    query,
    [token, expiry, email],
    (err, result) => {

      if (err) {

        console.log(err);

        return res.status(500).json({
          success: false,
          message: "Server Error",
        });

      }

      if (result.affectedRows === 0) {

        return res.status(404).json({
          success: false,
          message: "Email not found",
        });

      }

      const resetLink =
        `http://localhost:5173/reset-password/${token}`;

      console.log(resetLink);

      res.json({
        success: true,
        message: "Reset link generated",
        resetLink,
      });

    }
  );

};

// =========================
// RESET PASSWORD
// =========================
const resetPassword = async (req, res) => {

  const { token, password } = req.body;

  const query =
    `
    SELECT * FROM users
    WHERE reset_token = ?
    AND reset_token_expiry > ?
  `;

  db.query(
    query,
    [token, Date.now()],
    async (err, result) => {

      if (err) {

        console.log(err);

        return res.status(500).json({
          success: false,
          message: "Server Error",
        });

      }

      if (result.length === 0) {

        return res.status(400).json({
          success: false,
          message: "Invalid or expired token",
        });

      }

      const hashedPassword =
        await bcrypt.hash(password, 10);

      const updateQuery =
        `
        UPDATE users
        SET
          password = ?,
          reset_token = NULL,
          reset_token_expiry = NULL
        WHERE reset_token = ?
      `;

      db.query(
        updateQuery,
        [hashedPassword, token],
        (err) => {

          if (err) {

            console.log(err);

            return res.status(500).json({
              success: false,
              message: "Password reset failed",
            });

          }

          res.json({
            success: true,
            message: "Password reset successful",
          });

        }
      );

    }
  );

};

module.exports = {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
};