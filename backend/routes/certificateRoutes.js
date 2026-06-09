const express = require("express")

const router = express.Router()

const {
  generateCertificate,
} = require("../controllers/certificateController")

// =========================
// GENERATE CERTIFICATE
// =========================
router.post("/generate", generateCertificate)

module.exports = router
