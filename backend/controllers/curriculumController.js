const db = require("../config/db")

const normalizeVideoUrl = (url) => {
  const value = String(url ?? "").trim()

  if (!value) {
    return null
  }

  const shortMatch = value.match(
    /^https?:\/\/youtu\.be\/([^?&/\s]+)(?:\?.*)?$/i
  )

  if (shortMatch?.[1]) {
    return `https://www.youtube.com/embed/${shortMatch[1]}`
  }

  const watchMatch = value.match(
    /^https?:\/\/(?:www\.)?youtube\.com\/watch\?v=([^&\s]+).*$/i
  )

  if (watchMatch?.[1]) {
    return `https://www.youtube.com/embed/${watchMatch[1]}`
  }

  return value
}

// =========================
// GET CURRICULUM
// =========================
const getCurriculum = (req, res) => {

  const { slug } = req.params

  const modulesQuery = `
    SELECT *
    FROM course_modules
    WHERE course_slug = ?
    ORDER BY id ASC
  `

  db.query(
    modulesQuery,
    [slug],
    (err, modules) => {

      if (err) {

        console.log(err)

        return res.status(500).json({
          success: false,
          message: "Failed to fetch modules",
        })

      }

      if (modules.length === 0) {

        return res.json({
          success: true,
          curriculum: [],
        })

      }
      const topicsQuery = `
        SELECT *
        FROM course_topics
        WHERE module_id IN (?)
        ORDER BY id ASC
      `

      db.query(
        topicsQuery,
        [modules.map((module) => module.id)],
        (err, topics) => {

          if (err) {

            console.log(err)

            return res.status(500).json({
              success: false,
              message: "Failed to fetch topics",
            })

          }

          const topicsByModule = topics.reduce((groupedTopics, topic) => {
            const moduleTopics = groupedTopics[topic.module_id] || []
            groupedTopics[topic.module_id] = [...moduleTopics, topic]
            return groupedTopics
          }, {})

          const curriculum = modules.map((module) => ({
            id: module.id,
            title: module.title,
            lessons: module.lessons,
            topics: topicsByModule[module.id] || [],
          }))

          res.json({
            success: true,
            curriculum,
          })

        }
      )

    }
  )

}

// =========================
// ADD MODULE
// =========================
const addModule = (req, res) => {

  const {
    course_slug,
    title,
    lessons,
  } = req.body

  const query = `
    INSERT INTO course_modules
    (
      course_slug,
      title,
      lessons
    )
    VALUES (?, ?, ?)
  `

  db.query(
    query,
    [
      course_slug,
      title,
      lessons,
    ],
    (err, result) => {

      if (err) {

        console.log(err)

        return res.status(500).json({
          success: false,
          message: "Failed to add module",
        })

      }

      res.json({
        success: true,
        message: "Module added successfully",
      })

    }
  )

}

// =========================
// UPDATE MODULE
// =========================
const updateModule = (req, res) => {

  const { id } = req.params

  const {
    title,
    lessons,
  } = req.body

  const query = `
    UPDATE course_modules
    SET
      title = ?,
      lessons = ?
    WHERE id = ?
  `

  db.query(
    query,
    [
      title,
      lessons,
      id,
    ],
    (err, result) => {

      if (err) {

        console.log(err)

        return res.status(500).json({
          success: false,
          message: "Failed to update module",
        })

      }

      res.json({
        success: true,
        message: "Module updated successfully",
      })

    }
  )

}

// =========================
// DELETE MODULE
// =========================
const deleteModule = (req, res) => {

  const { id } = req.params

  const deleteTopicsQuery = `
    DELETE FROM course_topics
    WHERE module_id = ?
  `

  db.query(
    deleteTopicsQuery,
    [id],
    (err) => {

      if (err) {

        console.log(err)

        return res.status(500).json({
          success: false,
          message: "Failed to delete topics",
        })

      }

      const deleteModuleQuery = `
        DELETE FROM course_modules
        WHERE id = ?
      `

      db.query(
        deleteModuleQuery,
        [id],
        (err) => {

          if (err) {

            console.log(err)

            return res.status(500).json({
              success: false,
              message: "Failed to delete module",
            })

          }

          res.json({
            success: true,
            message: "Module deleted successfully",
          })

        }
      )

    }
  )

}

// =========================
// ADD TOPIC
// =========================
const addTopic = (req, res) => {

  const {
    module_id,
    topic,
    video_url,
  } = req.body

  if (!module_id || !topic) {
    return res.status(400).json({
      success: false,
      message: "Module and topic are required",
    })
  }

  const query = `
    INSERT INTO course_topics
    (
      module_id,
      topic,
      video_url
    )
    VALUES (?, ?, ?)
  `

  db.query(
    query,
    [
      module_id,
      topic,
      video_url || null,
    ],
    (err, result) => {

      if (err) {

        console.log(err)

        return res.status(500).json({
          success: false,
          message: "Failed to add topic",
        })

      }

      res.json({
        success: true,
        message: "Topic added successfully",
      })

    }
  )

}

// =========================
// UPDATE TOPIC
// =========================
const updateTopic = (req, res) => {

  const { id } = req.params

  const { topic, video_url } = req.body
  const hasVideoUrl =
    Object.prototype.hasOwnProperty.call(req.body || {}, "video_url")
  const normalizedVideoUrl =
    hasVideoUrl ? normalizeVideoUrl(video_url) : null

  const query = hasVideoUrl
    ? `
      UPDATE course_topics
      SET
        topic = ?,
        video_url = ?
      WHERE id = ?
    `
    : `
      UPDATE course_topics
      SET topic = ?
      WHERE id = ?
    `

  db.query(
    query,
    hasVideoUrl
      ? [
          topic,
          normalizedVideoUrl,
          id,
        ]
      : [
          topic,
          id,
        ],
    (err, result) => {

      if (err) {

        console.log(err)

        return res.status(500).json({
          success: false,
          message: "Failed to update topic",
        })

      }

      res.json({
        success: true,
        message: "Topic updated successfully",
      })

    }
  )

}

// =========================
// DELETE TOPIC
// =========================
const deleteTopic = (req, res) => {

  const { id } = req.params

  const query = `
    DELETE FROM course_topics
    WHERE id = ?
  `

  db.query(
    query,
    [id],
    (err, result) => {

      if (err) {

        console.log(err)

        return res.status(500).json({
          success: false,
          message: "Failed to delete topic",
        })

      }

      res.json({
        success: true,
        message: "Topic deleted successfully",
      })

    }
  )

}

// =========================
// GET TOPIC VIDEO
// =========================
const getTopicVideo = (req, res) => {

  const { id } = req.params

  if (!id) {
    return res.status(400).json({
      success: false,
      message: "Topic id is required",
    })
  }

  const query = `
    SELECT id, module_id, topic, video_url
    FROM course_topics
    WHERE id = ?
    LIMIT 1
  `

  db.query(
    query,
    [id],
    (err, result) => {

      if (err) {

        console.log(err)

        return res.status(500).json({
          success: false,
          message: "Failed to fetch topic video",
        })

      }

      if (!result.length) {
        return res.status(404).json({
          success: false,
          message: "Topic not found",
        })
      }

      res.json({
        success: true,
        topic: result[0],
        video_url: result[0]?.video_url || "",
      })

    }
  )

}

// =========================
// UPDATE TOPIC VIDEO
// =========================
const updateTopicVideo = (req, res) => {

  try {

    const { id } = req.params
    const rawVideoUrl = req.body?.video_url
    const uploadedVideoUrl = req.file
      ? `http://localhost:5000/uploads/videos/${req.file.filename}`
      : null
    const videoUrl = uploadedVideoUrl || normalizeVideoUrl(rawVideoUrl)

    console.log("[updateTopicVideo] route hit")
    console.log("[updateTopicVideo] topic id:", id)
    console.log("[updateTopicVideo] video_url:", rawVideoUrl)
    console.log("[updateTopicVideo] uploaded file:", req.file?.filename)

    if (!id || Number.isNaN(Number(id))) {
      return res.status(400).json({
        success: false,
        message: "Valid topic id is required",
      })
    }

    if (
      !req.file &&
      (!req.body || !Object.prototype.hasOwnProperty.call(req.body, "video_url"))
    ) {
      return res.status(400).json({
        success: false,
        message: "Video file or video_url field is required",
      })
    }

    if (
      rawVideoUrl !== null &&
      rawVideoUrl !== undefined &&
      typeof rawVideoUrl !== "string"
    ) {
      return res.status(400).json({
        success: false,
        message: "video_url must be a string, empty string, or null",
      })
    }

    const query = `
      UPDATE course_topics
      SET video_url = ?
      WHERE id = ?
    `

    db.query(
      query,
      [videoUrl, id],
      (err, result) => {

        if (err) {

          console.error("[updateTopicVideo] SQL error:", err)

          return res.status(500).json({
            success: false,
            message: "Failed to update topic video",
            error: err?.message,
          })

        }

        if (result.affectedRows === 0) {
          return res.status(404).json({
            success: false,
            message: "Topic not found",
          })
        }

        const successResponse = {
          success: true,
          message: "Topic video updated successfully",
          video_url: videoUrl || "",
        }

        console.log("[updateTopicVideo] success response:", successResponse)

        return res.json(successResponse)

      }
    )

  } catch (error) {

    console.error("[updateTopicVideo] unexpected error:", error)

    return res.status(500).json({
      success: false,
      message: "Unexpected error while updating topic video",
      error: error?.message,
    })

  }

}

module.exports = {
  getCurriculum,
  getTopicVideo,

  addModule,
  updateModule,
  deleteModule,

  addTopic,
  updateTopic,
  updateTopicVideo,
  deleteTopic,
}
