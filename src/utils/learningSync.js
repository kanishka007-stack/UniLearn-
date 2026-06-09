import {
  mergeEnrolledCourses,
  normalizeEnrolledCourse,
  toStoredEnrollment,
} from "../data/courses"

const readJson = (key, fallback) => {
  try {
    const value = JSON.parse(localStorage.getItem(key))
    return value ?? fallback
  } catch {
    return fallback
  }
}

const emitLearningSync = () => {
  window.dispatchEvent(new Event("unilearn-sync"))
}

const normalizeProgress = (progress) => {
  const value = Number(progress)

  if (!Number.isFinite(value) || value < 0) {
    return 0
  }

  return value > 100 ? 100 : Math.round(value)
}

const toAdminCourse = (course) => ({
  id: course.id,
  title: course.title,
  category: course.category,
})

export const getAdminCourses = () =>
  readJson("adminCourses", null)

export const saveAdminCourse = (course) => {
  const adminCourses = getAdminCourses()
  const currentCourses = Array.isArray(adminCourses)
    ? adminCourses
    : []

  const alreadyExists = currentCourses.some(
    (item) => Number(item.id) === Number(course.id)
  )

  if (alreadyExists) {
    return currentCourses
  }

  const nextCourses = [...currentCourses, toAdminCourse(course)]
  localStorage.setItem("adminCourses", JSON.stringify(nextCourses))
  emitLearningSync()
  return nextCourses
}

export const getRecentActivity = () =>
  readJson("recentActivity", []).filter(Boolean)

export const addRecentActivity = (activity) => {
  const currentActivity = getRecentActivity()
  const nextActivity = [
    {
      ...activity,
      time: activity.time || "Recently",
      date: activity.date || new Date().toISOString(),
    },
    ...currentActivity,
  ].slice(0, 20)

  localStorage.setItem("recentActivity", JSON.stringify(nextActivity))
  emitLearningSync()
  return nextActivity
}

export const getCourseProgress = (course) => {
  const courseId = course?.id

  if (!courseId) {
    return 0
  }

  const savedProgress = readJson(`progress-${courseId}`, null)

  if (typeof savedProgress === "number") {
    return normalizeProgress(savedProgress)
  }

  if (typeof savedProgress === "string") {
    return normalizeProgress(savedProgress)
  }

  return normalizeProgress(course?.progress)
}

export const hasCertificate = (course) =>
  localStorage.getItem(`certificate-${course?.id}`) === "true" ||
  getCourseProgress(course) >= 80

export const syncCourseCompletion = (course) => {
  const progress = getCourseProgress(course)

  if (progress >= 80) {
    localStorage.setItem(`completed-${course.id}`, "true")
    localStorage.setItem(`certificate-${course.id}`, "true")
  }

  return {
    ...course,
    progress,
    enrolled: true,
    completed: progress >= 80,
    certificateUnlocked: progress >= 80 || hasCertificate(course),
  }
}

export const getSyncedEnrolledCourses = () => {
  const storedCourses = readJson("enrolledCourses", [])
  const adminCourses = getAdminCourses()
  let syncedCourses = mergeEnrolledCourses(storedCourses).map(
    syncCourseCompletion
  )

if (
  !Array.isArray(adminCourses) &&
  syncedCourses.length > 0
) {

  localStorage.setItem(
    "adminCourses",
    JSON.stringify(
      syncedCourses.map(toAdminCourse)
    )
  )

} else if (syncedCourses.length > 0) {
    localStorage.setItem(
      "adminCourses",
      JSON.stringify(syncedCourses.map(toAdminCourse))
    )
  }

  localStorage.setItem(
    "enrolledCourses",
    JSON.stringify(syncedCourses.map(toStoredEnrollment).filter(Boolean))
  )
  return syncedCourses
}

export const saveEnrollment = (course) => {
  const normalizedCourse = normalizeEnrolledCourse({
    ...course,
    progress: getCourseProgress(course),
  })

  if (!normalizedCourse) {
    return getSyncedEnrolledCourses()
  }

  const enrolledCourse = {
    ...normalizedCourse,
    progress: getCourseProgress(normalizedCourse),
    enrolled: true,
  }

  saveAdminCourse(enrolledCourse)

  const enrolledCourses = getSyncedEnrolledCourses()
  const alreadyEnrolled = enrolledCourses.some(
    (item) => Number(item.id) === Number(enrolledCourse.id)
  )

  if (!alreadyEnrolled) {
    localStorage.setItem(`progress-${enrolledCourse.id}`, "0")
    localStorage.setItem(
      "enrolledCourses",
      JSON.stringify(
        [...enrolledCourses, enrolledCourse]
          .map(toStoredEnrollment)
          .filter(Boolean)
      )
    )

    addRecentActivity({
      type: "enrolled",
      course: enrolledCourse.title,
    })
  }

  emitLearningSync()
  return getSyncedEnrolledCourses()
}

export const setCourseProgress = (course, progress) => {
  const nextProgress = normalizeProgress(progress)

  localStorage.setItem(`progress-${course.id}`, String(nextProgress))

  const enrolledCourses = getSyncedEnrolledCourses().map((item) =>
    Number(item.id) === Number(course.id)
      ? syncCourseCompletion({
          ...item,
          progress: nextProgress,
        })
      : item
  )

  localStorage.setItem(
    "enrolledCourses",
    JSON.stringify(enrolledCourses.map(toStoredEnrollment).filter(Boolean))
  )

  if (nextProgress >= 80 && localStorage.getItem(`completed-${course.id}`) !== "true") {
    localStorage.setItem(`completed-${course.id}`, "true")
    localStorage.setItem(`certificate-${course.id}`, "true")
  }

  emitLearningSync()
  return enrolledCourses
}

export const removeEnrolledCourse = (courseId) => {
  const enrolledCourses = getSyncedEnrolledCourses().filter(
    (course) => Number(course.id) !== Number(courseId)
  )
  const adminCourses = getAdminCourses()

  localStorage.setItem(
    "enrolledCourses",
    JSON.stringify(enrolledCourses.map(toStoredEnrollment).filter(Boolean))
  )

  if (Array.isArray(adminCourses)) {
    localStorage.setItem(
      "adminCourses",
      JSON.stringify(
        adminCourses.filter(
          (course) => Number(course.id) !== Number(courseId)
        )
      )
    )
  }

  localStorage.removeItem(`progress-${courseId}`)
  localStorage.removeItem(`completedTopics-${courseId}`)
  localStorage.removeItem(`completed-${courseId}`)
  localStorage.removeItem(`certificate-${courseId}`)

  emitLearningSync()
  return enrolledCourses
}

export const getCompletedCourses = () =>
  getSyncedEnrolledCourses().filter((course) => getCourseProgress(course) >= 80)

export const getCertificatesCount = () =>
  getSyncedEnrolledCourses().filter(hasCertificate).length

export const getLearningStreak = () => {
  const dates = [
    ...new Set(
      getRecentActivity()
        .map((activity) => activity.date)
        .filter(Boolean)
        .map((date) => new Date(date).toDateString())
    ),
  ]

  return dates.length > 0 ? dates.length : 0
}
