const multer = require("multer")

const path = require("path")
const fs = require("fs")

const ensureUploadDir = (relativePath) => {
  const targetPath = path.join(__dirname, relativePath)
  fs.mkdirSync(targetPath, {
    recursive: true,
  })
  return targetPath
}

// =========================
// IMAGE STORAGE
// =========================
const imageStorage = multer.diskStorage({

  destination: (req, file, cb) => {

    cb(
  null,
  ensureUploadDir("../uploads/images")
)

  },

  filename: (req, file, cb) => {

    const uniqueName =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      path.extname(file.originalname)

    cb(null, uniqueName)

  },

})

// =========================
// VIDEO STORAGE
// =========================
const videoStorage = multer.diskStorage({

  destination: (req, file, cb) => {

    cb(
      null,
      ensureUploadDir("../uploads/videos")
    )

  },

  filename: (req, file, cb) => {

    const uniqueName =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      path.extname(file.originalname)

    cb(null, uniqueName)

  },

})
// =========================
// PDF STORAGE
// =========================
const noteStorage = multer.diskStorage({

  destination: (req, file, cb) => {

    cb(
      null,
      ensureUploadDir("../uploads/notes")
    )

  },

  filename: (req, file, cb) => {

    const uniqueName =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      path.extname(file.originalname)

    cb(null, uniqueName)

  },

})
// =========================
// IMAGE FILTER
// =========================
const imageFilter = (
  req,
  file,
  cb
) => {

  const allowedTypes =
    /jpg|jpeg|png|webp/

  const isValid =
    allowedTypes.test(
      path.extname(file.originalname).toLowerCase()
    )

  if (isValid) {

    cb(null, true)

  } else {

    cb(
      new Error(
        "Only image files are allowed"
      )
    )

  }

}

// =========================
// VIDEO FILTER
// =========================
const videoFilter = (
  req,
  file,
  cb
) => {

  const allowedTypes =
    /mp4|webm|mov/

  const isValid =
    allowedTypes.test(
      path.extname(file.originalname).toLowerCase()
    )

  if (isValid) {

    cb(null, true)

  } else {

    cb(
      new Error(
        "Only video files are allowed"
      )
    )

  }

}
// =========================
// PDF FILTER
// =========================
const noteFilter = (
  req,
  file,
  cb
) => {

  const allowedTypes =
    /pdf/

  const isValid =
    allowedTypes.test(
      path.extname(file.originalname).toLowerCase()
    )

  if (isValid) {

    cb(null, true)

  } else {

    cb(
      new Error(
        "Only PDF files are allowed"
      )
    )

  }

}
// =========================
// EXPORTS
// =========================
const uploadImage = multer({
  storage: imageStorage,
  fileFilter: imageFilter,
})

const uploadVideo = multer({
  storage: videoStorage,
  fileFilter: videoFilter,
})
const uploadNote = multer({
  storage: noteStorage,
  fileFilter: noteFilter,
})
module.exports = {
  uploadImage,
  uploadVideo,
  uploadNote,
}
