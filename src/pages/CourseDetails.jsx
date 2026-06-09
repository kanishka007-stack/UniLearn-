import axios from "axios"
import { useEffect, useMemo, useState } from "react"

import {
  PlayCircle,
  CheckCircle,
  Star,
} from "lucide-react"

import { Link, useParams } from "react-router-dom"


import {
  normalizeDatabaseCourse,
} from "../data/courses"
import { getEnrollments } from "../api/auth"

const API = "http://localhost:5000/api/courses"

const normalizeSlug = (value) =>
  String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "")

const getStoredReviews = (slug) => {

  try {

    return JSON.parse(
      localStorage.getItem(`reviews-${slug}`)
    ) || []

  } catch {

    return []

  }

}

const formatPrice = (value) => {

  const rawValue = String(value ?? "0")
    .replace(/[^\d,]/g, "")

  return `Rs. ${rawValue || "0"}`

}

const mergeCourseDetails = (
  slug,
  apiCourse,
  dbCurriculum = []
) => {

  const normalizedSlug =
    normalizeSlug(slug)

  const dynamicCourse =
    normalizeDatabaseCourse(apiCourse)

  if (!dynamicCourse) {

    return null

  }

  const course = {

    ...dynamicCourse,

    slug:
      dynamicCourse.slug ??
      normalizedSlug,

    title:
      dynamicCourse.title ??
      normalizedSlug,

    description:
      dynamicCourse.description ??
      "A practical course for modern learners.",

    image:
      dynamicCourse.image ??
      "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80",

    price:
      dynamicCourse.price ?? "0",

    rating:
      dynamicCourse.rating ?? "4.8",

    lessons:
      dynamicCourse.lessons ?? "0 Lessons",

    duration:
      dynamicCourse.duration ?? "Self paced",

    level:
      dynamicCourse.level ?? "Beginner",

    language:
      dynamicCourse.language ?? "English",

    certificate:
      dynamicCourse.certificate ?? "Yes",

    students:
      dynamicCourse.students ?? "100+ Students",

  }

  return {

    course,

    breadcrumb:
      `Home / Courses / ${course.category ?? "Course"}`,

    about:
      dynamicCourse.about ??
      dynamicCourse.description,

    learnPoints: [

  `Master ${course.category} concepts`,
  "Build real-world projects",
  "Learn industry-level workflows",
  "Structured beginner-to-advanced roadmap",
  "Hands-on practical implementation",
  "Improve problem solving skills",
  "Portfolio-ready learning experience",
  "Certificate after completion",

],

    curriculum: dbCurriculum,

    instructor: {

      name:
        dynamicCourse.instructor_name ??
        "UniLearn Instructor",

      role:
        dynamicCourse.instructor_role ??
        "Course Mentor",

      image:
        dynamicCourse.instructor_image ??
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=500&q=80",

      bio:
        "Experienced instructor focused on practical learning.",

     stats: [

  `⭐ ${course.rating} Instructor Rating`,
  `🎓 ${course.students ?? "1000+"} Students`,
  `📚 ${course.lessons} Included`,

],
    },

    faq: [

  {
    question:
      "Is this course beginner friendly?",

    answer:
      "Yes, this course starts from fundamentals and moves to advanced concepts.",
  },

  {
    question:
      "Will I receive a certificate?",

    answer:
      "Yes, certificate is provided after completion.",
  },

  {
    question:
      "Do I need prior experience before taking this course?",

    answer:
      "No prior experience is required. The course is designed for beginners and gradually moves toward advanced concepts.",
  },

  {
    question:
      "Will I build projects during the course?",

    answer:
      "Yes, the course includes practical exercises and real-world projects to help you gain hands-on experience.",
  },

],

    reviews: [],

  }

}

export default function CourseDetails() {

  const { slug } = useParams()

  const routeSlug = String(slug ?? "").trim()

  const normalizedSlug =
    normalizeSlug(routeSlug)

  const [apiCourse, setApiCourse] =
    useState(null)
  
  const [dbCurriculum, setDbCurriculum] =
  useState([])

  const [curriculumError, setCurriculumError] =
    useState(false)

  const [loading, setLoading] =
    useState(true)

  const [isEnrolled, setIsEnrolled] =
    useState(false)

  const [openSections, setOpenSections] =
    useState([0])

  const [reviewTitle, setReviewTitle] =
    useState("")

  const [reviewContent, setReviewContent] =
    useState("")

  const [userReviews, setUserReviews] =
    useState(() =>
      getStoredReviews(normalizedSlug)
    )

  useEffect(() => {

    let isMounted = true

    const fetchCourse = async () => {

      setLoading(true)
      setApiCourse(null)
      setDbCurriculum([])
      setCurriculumError(false)

      try {

        const response =
          await axios.get(
            `${API}/${routeSlug}`
          )

        if (
          isMounted &&
          response.data?.success
        ) {

          setApiCourse(
            response.data.course
          )
          const curriculumResponse =
            await axios.get(
              `http://localhost:5000/api/curriculum/${routeSlug}`
            )

          if (
            curriculumResponse.data?.success
          ) {

            {
              const raw = Array.isArray(curriculumResponse.data.curriculum)
                ? curriculumResponse.data.curriculum
                : []

              const normalized = raw.map((module) => ({
                ...module,
                topics: Array.isArray(module?.topics)
                  ? module.topics.map((t) =>
                      typeof t === "string"
                        ? t
                        : t?.topic ?? t?.title ?? t?.name ?? JSON.stringify(t)
                    )
                  : [],
              }))

              setDbCurriculum(normalized)
            }
            setCurriculumError(false)

          } else {

            setDbCurriculum([])
            setCurriculumError(true)

          }
        }

      } catch {

        if (isMounted) {

          setApiCourse(null)
          setCurriculumError(true)

        }

      } finally {

        if (isMounted) {

          setLoading(false)

        }

      }

    }

    fetchCourse()

    return () => {

      isMounted = false

    }

  }, [routeSlug])

  useEffect(() => {
    let isMounted = true

    const syncEnrollmentStatus = async () => {
      if (!apiCourse) {
        setIsEnrolled(false)
        return
      }

      const storedCourses = (() => {
        try {
          return JSON.parse(localStorage.getItem("enrolledCourses") || "[]")
        } catch {
          return []
        }
      })()

      const localMatch = storedCourses.some(
        (item) =>
          String(item?.id) === String(apiCourse.id) ||
          item?.slug === apiCourse.slug
      )

      let remoteMatch = false
      const user = JSON.parse(localStorage.getItem("user") || "{}")

      if (user?.email) {
        try {
          const data = await getEnrollments(user.email)
          const enrollments = Array.isArray(data?.enrollments)
            ? data.enrollments
            : []

          remoteMatch = enrollments.some(
            (item) =>
              String(item?.course_id ?? item?.id) === String(apiCourse.id) ||
              item?.course_slug === apiCourse.slug ||
              item?.slug === apiCourse.slug ||
              item?.course_name === apiCourse.slug ||
              item?.course_name === apiCourse.title
          )
        } catch {
          remoteMatch = false
        }
      }

      if (isMounted) {
        setIsEnrolled(localMatch || remoteMatch)
      }
    }

    syncEnrollmentStatus()

    window.addEventListener("storage", syncEnrollmentStatus)
    window.addEventListener("focus", syncEnrollmentStatus)
    window.addEventListener("unilearn-sync", syncEnrollmentStatus)

    return () => {
      isMounted = false
      window.removeEventListener("storage", syncEnrollmentStatus)
      window.removeEventListener("focus", syncEnrollmentStatus)
      window.removeEventListener("unilearn-sync", syncEnrollmentStatus)
    }
  }, [apiCourse])

  const details = useMemo(
    () =>
      mergeCourseDetails(
        normalizedSlug,
        apiCourse,
        dbCurriculum
      ),
    [apiCourse, dbCurriculum, normalizedSlug]
  )

  const toggleSection = (index) => {

    setOpenSections(
      (currentSections) =>

        currentSections.includes(index)

          ? currentSections.filter(
              (item) => item !== index
            )

          : [...currentSections, index]
    )

  }

  const submitReview = () => {

    if (
      !reviewTitle.trim() ||
      !reviewContent.trim()
    ) {

      alert(
        "Please add a review title and content"
      )

      return

    }

    const user = JSON.parse(
      localStorage.getItem("user") || "{}"
    )

    const nextReview = {

      name:
        user?.name || "Student",

      title:
        reviewTitle.trim(),

      text:
        reviewContent.trim(),

    }

    const nextReviews = [
      nextReview,
      ...userReviews,
    ]

    localStorage.setItem(
      `reviews-${normalizedSlug}`,
      JSON.stringify(nextReviews)
    )

    setUserReviews(nextReviews)

    setReviewTitle("")
    setReviewContent("")

  }

  if (loading) {

    return (

      <div className="min-h-screen bg-[#f5f2ee] dark:bg-[#0f172a] dark:text-gray-100 pt-36 flex items-center justify-center text-3xl font-black">

        Loading Course...

      </div>

    )

  }

  if (!details) {

    return (

      <div className="min-h-screen bg-[#f5f2ee] dark:bg-[#0f172a] dark:text-gray-100 pt-36 flex flex-col items-center justify-center text-center px-6">

        <h1 className="text-5xl font-black mb-6">
          Course Not Found
        </h1>

        <Link
          to="/courses"
          className="bg-red-500 hover:bg-red-600 text-white px-8 py-4 rounded-full font-bold"
        >
          Browse Courses
        </Link>

      </div>

    )

  }

  const {
    course,
    breadcrumb,
    about,
    learnPoints,
    curriculum,
    instructor,
    faq,
    reviews,
  } = details

  const allReviews = [
    ...userReviews,
    ...reviews,
  ]

  const courseSlug =
    course.slug ?? normalizedSlug

  return (

    <div className="bg-[#f5f2ee] dark:bg-[#0f172a] dark:text-gray-100 min-h-screen pt-36 pb-20">

      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-3 gap-10">

        <div className="lg:col-span-2">

          <p className="text-sm text-gray-500 mb-4">
            {breadcrumb}
          </p>

          <p className="text-orange-500 font-semibold mb-2">
            Rating {course.rating} / 5
          </p>

          <h1 className="text-5xl font-black leading-tight mb-8">
            {course.title}
          </h1>

          <div className="flex flex-wrap gap-4 mb-10">

            {[
              ["Course info", "course-info"],
              ["Curriculum", "course-curriculum"],
              ["Instructors", "course-instructor"],
              ["Faq", "course-faq"],
              ["Reviews", "course-reviews"],
            ].map(([tab, target]) => (

              <a
                key={target}
                href={`#${target}`}
                className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-full font-semibold transition"
              >
                {tab}
              </a>

            ))}

          </div>

          <section
            id="course-info"
            className="mb-16 scroll-mt-32"
          >

            <h2 className="text-2xl font-bold mb-6">
              About This Course
            </h2>

            <p className="text-gray-700 leading-8 mb-8">
              {about}
            </p>

            <h3 className="text-xl font-bold mb-5">
              What You&apos;ll Learn
            </h3>

            <div className="grid sm:grid-cols-2 gap-5">

              {learnPoints.map(
                (point, index) => (

                  <div
                    key={index}
                    className="flex items-start gap-3"
                  >

                    <CheckCircle
                      size={20}
                      className="text-green-500 mt-1 shrink-0"
                    />

                    <p className="text-gray-700 leading-7">
                      {point}
                    </p>

                  </div>

                )
              )}

            </div>

          </section>

          <section
            id="course-curriculum"
            className="mb-20 scroll-mt-32"
          >

            <h2 className="text-3xl font-bold mb-10">
              Course Curriculum
            </h2>

            <div className="space-y-8">

              {curriculumError ? (

                <div className="rounded-3xl bg-red-50 dark:bg-red-950 p-8 text-red-900 dark:text-red-200">

                  <h3 className="text-2xl font-semibold mb-2">
                    Course curriculum could not be loaded.
                  </h3>

                  <p>Please refresh the page or try again later.</p>

                </div>

              ) : curriculum.length === 0 ? (

                <div className="rounded-3xl bg-gray-50 dark:bg-[#111827] p-8 text-gray-700 dark:text-gray-300">

                  Curriculum is currently unavailable.

                </div>

              ) : (

                curriculum.map((section, index) => {

                  const isOpen = openSections.includes(index)

                  return (

                    <div key={`${section.title}-${index}`}>

                      <button
                        type="button"
                        onClick={() => toggleSection(index)}
                        className="w-full bg-gray-200 dark:bg-[#1f2937] rounded-xl px-5 py-4 flex justify-between items-center mb-4 cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-700 transition text-left gap-4"
                      >

                        <h3 className="font-bold text-lg flex items-center gap-2">

                          <span className="text-2xl">
                            {isOpen ? "-" : "+"}
                          </span>

                          {section.title}

                        </h3>

                        <span className="bg-white dark:bg-[#111827] px-4 py-1 rounded-full text-sm shrink-0">
                          {section.lessons}
                        </span>

                      </button>

                      {isOpen && (
                        <div className="space-y-3">
                          {(section.topics ?? []).map((topic, topicIndex) => (
                            <div
                              key={`${topic}-${topicIndex}`}
                              className="bg-white dark:bg-[#111827] dark:border dark:border-gray-700 rounded-xl px-5 py-4 flex justify-between items-center gap-4"
                            >
                              <span className="text-gray-700 flex items-center gap-2">
                                <PlayCircle size={18} className="text-red-500 shrink-0" />
                                {topic}
                              </span>
                              <button className="bg-red-500 text-white px-4 py-1 rounded-full text-sm hover:bg-red-600 transition">
                                Preview
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                    </div>

                  )
                })
              )}

            </div>

          </section>

          <section
            id="course-instructor"
            className="mb-20 scroll-mt-32"
          >

            <h2 className="text-3xl font-bold mb-10">
              Your Instructors
            </h2>

            <div className="flex flex-col sm:flex-row gap-6 items-start bg-white dark:bg-[#111827] dark:border dark:border-gray-700 rounded-3xl p-8">

              <img
                src={instructor.image}
                alt={instructor.name}
                className="w-28 h-28 rounded-full object-cover"
              />

              <div>

                <h3 className="text-2xl font-bold mb-2">

                  {instructor.name}

                </h3>

                <p className="text-gray-500 mb-4">

                  {instructor.role}

                </p>

                <p className="text-gray-700 leading-7 mb-5">

                  {instructor.bio}

                </p>

                <div className="space-y-2">

                  {(instructor.stats ?? []).map(
                    (stat, index) => (

                      <p key={index}>
                        {stat}
                      </p>

                    )
                  )}

                </div>

              </div>

            </div>

          </section>

          <section
            id="course-faq"
            className="mb-20 scroll-mt-32"
          >

            <h2 className="text-3xl font-bold mb-10">
              FAQ
            </h2>

            <div className="space-y-5">

              {faq.map((item, index) => (

                <div
                  key={index}
                  className="bg-white dark:bg-[#111827] dark:border dark:border-gray-700 rounded-xl p-5"
                >

                  <h3 className="font-bold mb-2">
                    {item.question}
                  </h3>

                  <p className="text-gray-600">
                    {item.answer}
                  </p>

                </div>

              ))}

            </div>

          </section>

          <section
            id="course-reviews"
            className="mb-20 scroll-mt-32"
          >

            <div className="grid md:grid-cols-2 gap-16">

              <div>

                <h2 className="text-3xl font-bold mb-8">

                  Ratings & Reviews

                </h2>
{/* PREMIUM RATINGS */}
<div className="bg-[#111827] rounded-[28px] p-8 border border-gray-800 mb-10">

  <div className="grid md:grid-cols-[220px_1fr] gap-10 items-center">

    {/* LEFT */}
    <div className="flex flex-col items-center md:items-start">

      <div className="flex items-end gap-2 mb-3">

        <h1 className="text-6xl font-black text-yellow-400 leading-none">

          {course.rating}

        </h1>

        <span className="text-2xl text-white font-bold mb-1">

          /5

        </span>

      </div>

      {/* STARS */}
      <div className="flex gap-1 mb-2">

        {[1, 2, 3, 4, 5].map((star) => (

          <Star
            key={star}
            size={20}
            className="fill-yellow-400 text-yellow-400"
          />

        ))}

      </div>

      <p className="text-sm text-gray-400">

        Based on {allReviews.length || 1} reviews

      </p>

    </div>

    {/* RIGHT */}
    <div className="space-y-3">

      {[
        ["5", "85%"],
        ["4", "10%"],
        ["3", "5%"],
        ["2", "0%"],
        ["1", "0%"],
      ].map(([label, width]) => (

        <div
          key={label}
          className="flex items-center gap-3"
        >

          <span className="text-gray-300 text-sm w-5">

            {label}

          </span>

          <Star
            size={14}
            className="fill-yellow-400 text-yellow-400 shrink-0"
          />

          <div className="flex-1 h-2.5 bg-gray-700 rounded-full overflow-hidden">

            <div
              className="h-full bg-yellow-400 rounded-full"
              style={{
                width,
              }}
            ></div>

          </div>

          <span className="text-gray-400 text-sm w-12 text-right">

            {width}

          </span>

        </div>

      ))}

    </div>

  </div>

</div>

                <div className="space-y-8 text-gray-700">

                  {allReviews.map(
                    (review, index) => (

                      <div key={index}>

                        <div className="flex gap-1 mb-3">

                          {[1, 2, 3, 4, 5].map(
                            (star) => (

                              <Star
                                key={star}
                                size={18}
                                className="fill-yellow-400 text-yellow-400"
                              />

                            )
                          )}

                        </div>

                        {review.title && (

                          <h3 className="font-bold mb-2">

                            {review.title}

                          </h3>

                        )}

                        <p className="leading-7 mb-2">

                          &quot;{review.text}&quot;

                        </p>

                        <span className="text-sm text-gray-500">

                          - {review.name}

                        </span>

                      </div>

                    )
                  )}

                </div>

              </div>

              <div>

                <h2 className="text-3xl font-bold mb-8">

                  Write a Review

                </h2>

                <p className="text-gray-700 mb-5">

                  What is it like to take this course?

                </p>

                <input
                  type="text"
                  placeholder="Review Title"
                  value={reviewTitle}
                  onChange={(event) =>
                    setReviewTitle(
                      event.target.value
                    )
                  }
                  className="w-full bg-gray-300 rounded-2xl px-6 py-4 outline-none mb-6"
                />

                <textarea
                  rows="6"
                  placeholder="Review Content"
                  value={reviewContent}
                  onChange={(event) =>
                    setReviewContent(
                      event.target.value
                    )
                  }
                  className="w-full bg-gray-300 rounded-2xl px-6 py-5 outline-none resize-none mb-6"
                ></textarea>

                <button
                  onClick={submitReview}
                  className="bg-red-500 hover:bg-red-600 transition text-white px-8 py-3 rounded-full font-semibold"
                >

                  Submit Review

                </button>

              </div>

            </div>

          </section>

        </div>

<aside>

  <div className="bg-white dark:bg-[#111827] rounded-3xl p-6 sticky top-32 border border-gray-200 dark:border-gray-700">

    <img
      src={course.image}
      alt={course.title}
      className="rounded-2xl h-[220px] w-full object-cover mb-6"
    />

    <h2 className="text-4xl font-black mb-6">

      {formatPrice(course.price)}

    </h2>

    {/* ENROLL / CONTINUE */}
{isEnrolled ? (

      <Link
        to={`/learning/${course.slug}`}
        className="block w-full text-center bg-green-500 hover:bg-green-600 text-white py-4 rounded-xl font-bold text-xl mb-4 transition"
      >

        Continue Learning

      </Link>

    ) : (

      <Link
        to={`/enroll/${courseSlug}`}
        className="block w-full text-center bg-red-500 hover:bg-red-600 text-white py-4 rounded-xl font-bold text-xl mb-4 transition"
      >

        Enroll Now

      </Link>

    )}

    <a
      href="#course-curriculum"
      className="block w-full text-center border border-gray-300 dark:border-gray-700 py-4 rounded-xl font-bold text-xl mb-10"
    >

      Preview Course

    </a>

    <div className="space-y-5 text-sm">

      {[
        ["Lessons", course.lessons],
        ["Duration", course.duration],
        ["Skill Level", course.level],
        ["Language", course.language],
        ["Certificate", course.certificate],
      ].map(([label, value]) => (

        <div
          key={label}
          className="flex justify-between border-b pb-3 gap-4 last:border-b-0"
        >

          <span>{label}</span>

          <span className="text-right">

            {value}

          </span>

        </div>

      ))}

    </div>

  </div>

</aside>

      </div>

    </div>

  )

}
