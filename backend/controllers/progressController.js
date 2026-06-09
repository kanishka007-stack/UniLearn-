const db = require("../config/db")

const queryAsync = (query, params = []) =>
  new Promise((resolve, reject) => {
    db.query(query, params, (err, result) => {
      if (err) {
        reject(err)
        return
      }
      resolve(result)
    })
  })

const ensureProgressSchema = async () => {
  await queryAsync(`
    CREATE TABLE IF NOT EXISTS progress (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      course_id INT NOT NULL,
      lesson_index INT DEFAULT 0,
      completed_lessons INT DEFAULT 0,
      progress_percent INT DEFAULT 0,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `)

  await queryAsync(`
    CREATE TABLE IF NOT EXISTS topic_progress (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      course_id INT NOT NULL,
      topic_id INT NOT NULL,
      completed TINYINT(1) DEFAULT 0,
      completed_at DATETIME NULL,
      watch_time INT DEFAULT 0,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      UNIQUE KEY unique_user_topic (user_id, topic_id)
    )
  `)

  const columns = await queryAsync("SHOW COLUMNS FROM progress")
  const columnNames = Array.isArray(columns)
    ? columns.map((column) => column.Field)
    : []

  if (!columnNames.includes("last_topic_id")) {
    await queryAsync("ALTER TABLE progress ADD COLUMN last_topic_id INT NULL")
  }

  if (!columnNames.includes("watch_time")) {
    await queryAsync("ALTER TABLE progress ADD COLUMN watch_time INT DEFAULT 0")
  }

  if (!columnNames.includes("completed_at")) {
    await queryAsync("ALTER TABLE progress ADD COLUMN completed_at DATETIME NULL")
  }
}

// =========================
// SAVE PROGRESS
// =========================
const saveProgress = (req, res) => {

  let {
    user_id,
    course_id,
    lesson_index,
    completed_lessons,
    progress_percent,
  } = req.body

  lesson_index = Number(lesson_index) || 0
  completed_lessons = Number(completed_lessons) || 0
  progress_percent = Math.max(
    0,
    Math.min(100, Math.round(Number(progress_percent) || 0))
  )

  if (!user_id || !course_id) {
    return res.status(400).json({
      success: false,
      message: "User and course are required",
    })
  }

  const checkQuery =
    "SELECT * FROM progress WHERE user_id = ? AND course_id = ?"

  db.query(
    checkQuery,
    [user_id, course_id],
    (err, result) => {

      if (err) {

        console.log(err)

        return res.status(500).json({
          success: false,
          message: "Database error",
        })

      }

      // UPDATE EXISTING
      if (result.length > 0) {

        const updateQuery = `
          UPDATE progress
          SET
            lesson_index = ?,
            completed_lessons = ?,
            progress_percent = ?,
            updated_at = CURRENT_TIMESTAMP
          WHERE
            user_id = ?
            AND course_id = ?
        `

        db.query(
          updateQuery,
          [
            lesson_index,
            completed_lessons,
            progress_percent,
            user_id,
            course_id,
          ],
          (err) => {

            if (err) {

              console.log(err)

              return res.status(500).json({
                success: false,
                message: "Failed to update progress",
              })

            }

            res.json({
              success: true,
              message: "Progress updated",
            })

          }
        )

      }

      // INSERT NEW
      else {

        const insertQuery = `
          INSERT INTO progress
          (
            user_id,
            course_id,
            lesson_index,
            completed_lessons,
            progress_percent
          )
          VALUES (?, ?, ?, ?, ?)
        `

        db.query(
          insertQuery,
          [
            user_id,
            course_id,
            lesson_index,
            completed_lessons,
            progress_percent,
          ],
          (err) => {

            if (err) {

              console.log(err)

              return res.status(500).json({
                success: false,
                message: "Failed to save progress",
              })

            }

            res.json({
              success: true,
              message: "Progress saved",
            })

          }
        )

      }

    }
  )

}

// =========================
// GET PROGRESS
// =========================
const getProgress = (req, res) => {

  const { userId, courseId } = req.params

  const query = `
    SELECT * FROM progress
    WHERE user_id = ?
    AND course_id = ?
  `

  db.query(
    query,
    [userId, courseId],
    (err, result) => {

      if (err) {

        console.log(err)

        return res.status(500).json({
          success: false,
          message: "Failed to fetch progress",
        })

      }

      res.json({
        success: true,
        progress: result[0] || null,
      })

    }
  )

}

// =========================
// SAVE WATCH TIME
// =========================
const saveWatchTime = async (req, res) => {

  try {

    await ensureProgressSchema()

    const userId = Number(req.body?.user_id)
    const courseId = Number(req.body?.course_id)
    const topicId = Number(req.body?.topic_id)
    const watchTime = Math.max(
      0,
      Math.floor(Number(req.body?.watch_time) || 0)
    )

    if (!userId || !courseId || !topicId) {
      return res.status(400).json({
        success: false,
        message: "User, course, and topic are required",
      })
    }

    const progressRows = await queryAsync(
      `
        SELECT id
        FROM progress
        WHERE user_id = ?
        AND course_id = ?
        ORDER BY updated_at DESC
        LIMIT 1
      `,
      [userId, courseId]
    )

    if (progressRows.length > 0) {
      await queryAsync(
        `
          UPDATE progress
          SET
            last_topic_id = ?,
            watch_time = ?,
            updated_at = CURRENT_TIMESTAMP
          WHERE id = ?
        `,
        [topicId, watchTime, progressRows[0].id]
      )
    } else {
      await queryAsync(
        `
          INSERT INTO progress
          (
            user_id,
            course_id,
            lesson_index,
            completed_lessons,
            progress_percent,
            last_topic_id,
            watch_time
          )
          VALUES (?, ?, 0, 0, 0, ?, ?)
        `,
        [userId, courseId, topicId, watchTime]
      )
    }

    await queryAsync(
      `
        INSERT INTO topic_progress
        (
          user_id,
          course_id,
          topic_id,
          completed,
          watch_time
        )
        VALUES (?, ?, ?, 0, ?)
        ON DUPLICATE KEY UPDATE
          watch_time = VALUES(watch_time),
          updated_at = CURRENT_TIMESTAMP
      `,
      [userId, courseId, topicId, watchTime]
    )

    res.json({
      success: true,
      message: "Watch time saved",
    })

  } catch (error) {

    console.log(error)

    res.status(500).json({
      success: false,
      message: "Failed to save watch time",
    })

  }

}

// =========================
// COMPLETE TOPIC
// =========================
const completeTopic = async (req, res) => {

  try {

    await ensureProgressSchema()

    const userId = Number(req.body?.user_id)
    const courseId = Number(req.body?.course_id)
    const topicId = Number(req.body?.topic_id)
    const completedLessons = Math.max(
      0,
      Math.floor(Number(req.body?.completed_lessons) || 0)
    )
    const progressPercent = Math.max(
      0,
      Math.min(100, Math.round(Number(req.body?.progress_percent) || 0))
    )

    if (!userId || !courseId || !topicId) {
      return res.status(400).json({
        success: false,
        message: "User, course, and topic are required",
      })
    }

    await queryAsync(
      `
        INSERT INTO topic_progress
        (
          user_id,
          course_id,
          topic_id,
          completed,
          completed_at
        )
        VALUES (?, ?, ?, 1, NOW())
        ON DUPLICATE KEY UPDATE
          completed = 1,
          completed_at = COALESCE(completed_at, NOW()),
          updated_at = CURRENT_TIMESTAMP
      `,
      [userId, courseId, topicId]
    )

    const progressRows = await queryAsync(
      `
        SELECT id, completed_lessons, progress_percent
        FROM progress
        WHERE user_id = ?
        AND course_id = ?
        ORDER BY updated_at DESC
        LIMIT 1
      `,
      [userId, courseId]
    )

    if (progressRows.length > 0) {
      await queryAsync(
        `
          UPDATE progress
          SET
            completed_lessons = GREATEST(COALESCE(completed_lessons, 0), ?),
            progress_percent = GREATEST(COALESCE(progress_percent, 0), ?),
            last_topic_id = ?,
            completed_at = IF(? >= 100, COALESCE(completed_at, NOW()), completed_at),
            updated_at = CURRENT_TIMESTAMP
          WHERE id = ?
        `,
        [
          completedLessons,
          progressPercent,
          topicId,
          progressPercent,
          progressRows[0].id,
        ]
      )
    } else {
      await queryAsync(
        `
          INSERT INTO progress
          (
            user_id,
            course_id,
            lesson_index,
            completed_lessons,
            progress_percent,
            last_topic_id,
            completed_at
          )
          VALUES (?, ?, 0, ?, ?, ?, IF(? >= 100, NOW(), NULL))
        `,
        [
          userId,
          courseId,
          completedLessons,
          progressPercent,
          topicId,
          progressPercent,
        ]
      )
    }

    res.json({
      success: true,
      message: "Topic completed",
    })

  } catch (error) {

    console.log(error)

    res.status(500).json({
      success: false,
      message: "Failed to complete topic",
    })

  }

}

// =========================
// RESUME PROGRESS
// =========================
const getResumeProgress = async (req, res) => {

  try {

    await ensureProgressSchema()

    const courseId = Number(req.params?.courseId)
    const userId = Number(req.query?.user_id)

    if (!userId || !courseId) {
      return res.status(400).json({
        success: false,
        message: "User and course are required",
      })
    }

    const progressRows = await queryAsync(
      `
        SELECT *
        FROM progress
        WHERE user_id = ?
        AND course_id = ?
        ORDER BY updated_at DESC
        LIMIT 1
      `,
      [userId, courseId]
    )

    const completedRows = await queryAsync(
      `
        SELECT topic_id, completed, completed_at, watch_time
        FROM topic_progress
        WHERE user_id = ?
        AND course_id = ?
      `,
      [userId, courseId]
    )

    res.json({
      success: true,
      resume: progressRows[0] || null,
      completed_topics: Array.isArray(completedRows)
        ? completedRows
        : [],
    })

  } catch (error) {

    console.log(error)

    res.status(500).json({
      success: false,
      message: "Failed to fetch resume progress",
    })

  }

}

module.exports = {
  saveProgress,
  getProgress,
  saveWatchTime,
  completeTopic,
  getResumeProgress,
}
