export const createCourseSlug = (value) =>
  String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")

const normalizeProgress = (progress) => {
  const numericProgress = Number(progress)

  if (!Number.isFinite(numericProgress) || numericProgress < 0) {
    return 0
  }

  return numericProgress > 100 ? 100 : Math.round(numericProgress)
}

const normalizePrice = (value) =>
  String(value ?? "0").replace(/[^\d,]/g, "") || "0"

export const normalizeDatabaseCourse = (course) => {
  if (!course || typeof course !== "object") {
    return null
  }

  const title =
    course.title ?? course.course_name ?? course.courseName ?? ""

  const slug =
    course.slug ??
    course.course_slug ??
    course.courseSlug ??
    createCourseSlug(title)

  if (!title && !slug) {
    return null
  }

  const id =
    course.course_id ?? course.courseId ?? course.id ?? slug

  return {
    id,
    slug,
    title: title || "Untitled Course",
    category: course.category ?? "Course",
    lessons: course.lessons ?? "Lessons",
    shortLessons: course.shortLessons ?? course.lessons ?? "Lessons",
    students: course.students ?? "New Students",
    duration: course.duration ?? "Self paced",
    level: course.level ?? "Beginner",
    rating: String(course.rating ?? "4.8"),
    price: normalizePrice(course.course_price ?? course.price),
    image:
      course.image ||
      "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80",
    detailsPath: `/course/${slug}`,
    description:
      course.description ??
      "A practical, self-paced course built for modern learners.",
    about: course.about ?? course.description ?? "",
    instructor_name: course.instructor_name,
    instructor_role: course.instructor_role,
    instructor_image: course.instructor_image,
    language: course.language ?? "English",
    certificate: course.certificate ?? "Yes",
    progress: normalizeProgress(course.progress ?? course.progress_percent),
  }
}

export const toStoredEnrollment = (course) => {
  const normalizedCourse = normalizeDatabaseCourse(course)

  if (!normalizedCourse) {
    return null
  }

  return {
    id: normalizedCourse.id,
    slug: normalizedCourse.slug,
    title: normalizedCourse.title,
    image: normalizedCourse.image,
    price: normalizedCourse.price,
  }
}

export const normalizeEnrolledCourse = (enrollment) => {
  const normalizedCourse = normalizeDatabaseCourse(enrollment)

  if (!normalizedCourse) {
    return null
  }

  return {
    ...normalizedCourse,
    progress: normalizeProgress(
      enrollment?.progress ?? enrollment?.progress_percent
    ),
  }
}

const enrollmentKey = (course) =>
  String(course?.id ?? course?.slug ?? createCourseSlug(course?.title))

export const mergeEnrolledCourses = (...courseGroups) => {
  const mergedCourses = new Map()

  courseGroups.flat().forEach((enrollment) => {
    const normalizedCourse = normalizeEnrolledCourse(enrollment)

    if (!normalizedCourse) {
      return
    }

    const key = enrollmentKey(normalizedCourse)
    const existingCourse = mergedCourses.get(key)

    mergedCourses.set(key, {
      ...existingCourse,
      ...normalizedCourse,
      progress: Math.max(
        existingCourse?.progress ?? 0,
        normalizedCourse.progress ?? 0
      ),
    })
  })

  return Array.from(mergedCourses.values())
}

export const hydrateEnrolledCourses = (
  storedEnrollments = [],
  remoteEnrollments = []
) => mergeEnrolledCourses(storedEnrollments, remoteEnrollments)

export const resolveCourse = (courseReference) => {
  if (!courseReference) {
    return null
  }

  if (typeof courseReference === "object") {
    return normalizeDatabaseCourse(courseReference)
  }

  const storedCourses = (() => {
    try {
      return JSON.parse(localStorage.getItem("enrolledCourses") || "[]")
    } catch {
      return []
    }
  })()

  return (
    storedCourses
      .map(normalizeDatabaseCourse)
      .find(
        (course) =>
          String(course?.id) === String(courseReference) ||
          course?.slug === courseReference
      ) ?? null
  )
}

export const getCourseById = resolveCourse
export const getCourseBySlug = resolveCourse
export const getCourseByTitle = resolveCourse
export const courseList = []
export const courses = {}
