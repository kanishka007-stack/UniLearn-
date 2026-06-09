import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import axios from "axios"
import {
  normalizeDatabaseCourse,
  normalizeEnrolledCourse,
  resolveCourse,
} from "../data/courses"
import { saveEnrollment } from "../utils/learningSync"
import { enrollCourse } from "../api/auth"

const readEnrolledCourses = () => {
  try {
    const storedCourses = JSON.parse(
      localStorage.getItem("enrolledCourses") || "[]"
    )

    return Array.isArray(storedCourses) ? storedCourses : []
  } catch {
    return []
  }
}

const getEnrollmentSlug = (course) =>
  String(
    course?.slug ??
      course?.course_slug ??
      course?.courseSlug ??
      course?.title ??
      course?.course_name ??
      course?.courseName ??
      course?.id ??
      ""
  )
    .trim()
    .toLowerCase()

const removeDuplicateEnrollments = (courses) => {
  const uniqueCourses = new Map()

  courses.forEach((item) => {
    const normalizedItem = normalizeEnrolledCourse(item)
    const slug = getEnrollmentSlug(normalizedItem || item)

    if (slug && !uniqueCourses.has(slug)) {
      uniqueCourses.set(slug, item)
    }
  })

  const nextCourses = Array.from(uniqueCourses.values())

  localStorage.setItem(
    "enrolledCourses",
    JSON.stringify(nextCourses)
  )

  return nextCourses
}

const EnrollPage = () => {

  const navigate = useNavigate()

  const { courseId = "" } = useParams()

  const [course, setCourse] = useState(() => resolveCourse(courseId))
  const [loading, setLoading] = useState(!resolveCourse(courseId))

  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}")
    return user?.email || ""
  })
  const [phone, setPhone] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("Credit / Debit Card")

  useEffect(() => {
    const localCourse = resolveCourse(courseId)

    if (localCourse) {
      return
    }

    let isMounted = true

    const fetchCourse = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/courses/${courseId}`
        )

        if (isMounted && response.data?.success) {
          setCourse(normalizeDatabaseCourse(response.data.course))
        }
      } catch (error) {
        console.log(error)
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
  }, [courseId])

  const handleEnrollment = async () => {

    if (!fullName || !email || !phone) {

      alert("Please fill all details")
      return

    }

    // LOCAL STORAGE FIRST
    const existingCourses =
      removeDuplicateEnrollments(readEnrolledCourses())

    const courseSlug = getEnrollmentSlug(course)

    // CHECK DUPLICATE BEFORE API
    const alreadyEnrolled = existingCourses.some(
      (item) => {
        const normalizedItem = normalizeEnrolledCourse(item)
        const itemSlug = getEnrollmentSlug(normalizedItem || item)

        return itemSlug && itemSlug === courseSlug
      }
    )

    if (alreadyEnrolled) {

      alert("You already enrolled in this course")

      navigate("/my-courses")

      return

    }

    try {

      // SAVE TO DATABASE
      const data = await enrollCourse({

        user_email: email,
        course_id: course.id,
        course_slug: course.slug,
        course_name: course.title,
        course_price: course.price,

      })

      saveEnrollment(course)
      removeDuplicateEnrollments(readEnrolledCourses())

        localStorage.setItem(
          "studentName",
          fullName
        )

        alert(data.message || "Enrollment Successful")

      navigate("/my-courses")

    } catch (error) {

      console.log(error)

      // EVEN IF DATABASE FAILS
      // SAVE LOCALLY

      saveEnrollment(course)
      removeDuplicateEnrollments(readEnrolledCourses())

      localStorage.setItem(
        "studentName",
        fullName
      )

      alert("Enrollment Successful")

      navigate("/my-courses")

    }

  }

  if (loading) {

    return (

      <div className="min-h-screen bg-[#f5f2ee] dark:bg-[#0f172a] dark:text-gray-100 flex items-center justify-center text-3xl font-bold">
        Loading Course...
      </div>

    )

  }

  if (!course) {

    return (

      <div className="min-h-screen flex items-center justify-center text-3xl font-bold">
        Course Not Found
      </div>

    )

  }

  return (

    <div className="bg-[#f5f2ee] dark:bg-[#0f172a] dark:text-gray-100 min-h-screen px-6 md:px-10 py-32">

      <div className="max-w-[1400px] mx-auto">

        {/* TOP */}
        <div className="mb-14">

          <p className="text-gray-500 mb-6">
            Home / Courses / {course.title} / Enroll Now
          </p>

          <h1 className="text-5xl md:text-7xl font-black leading-tight mb-8">
            Enroll in {course.title}
          </h1>

          <p className="text-xl text-gray-600 max-w-4xl leading-relaxed">
            Learn the foundations of user research, wireframing,
            visual design, and prototyping with practical projects.
          </p>

        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* LEFT SIDE */}
          <div className="lg:col-span-2 space-y-10">

            {/* STUDENT INFO */}
            <div className="bg-white dark:bg-[#111827] rounded-[32px] p-8 border border-gray-200 dark:border-gray-700 shadow-md">

              <h2 className="text-4xl font-black mb-10">
                🔴 Student Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                <div>

                  <label className="block font-bold mb-4">
                    Full Name
                  </label>

                  <input
                    type="text"
                    placeholder="Enter your full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full border border-gray-300 dark:border-gray-700 dark:bg-[#1f2937] dark:text-gray-100 rounded-2xl px-6 py-5 outline-none"
                  />

                </div>

                <div>

                  <label className="block font-bold mb-4">
                    Email Address
                  </label>

                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border border-gray-300 dark:border-gray-700 dark:bg-[#1f2937] dark:text-gray-100 rounded-2xl px-6 py-5 outline-none"
                  />

                </div>

                <div>

                  <label className="block font-bold mb-4">
                    Phone Number
                  </label>

                  <input
                    type="text"
                    placeholder="Enter your phone number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full border border-gray-300 dark:border-gray-700 dark:bg-[#1f2937] dark:text-gray-100 rounded-2xl px-6 py-5 outline-none"
                  />

                </div>

              </div>

            </div>

            {/* PAYMENT */}
            <div className="bg-white dark:bg-[#111827] rounded-[32px] p-8 border border-gray-200 dark:border-gray-700 shadow-md">

              <h2 className="text-4xl font-black mb-10">
                💳 Payment Method
              </h2>

              <div className="space-y-5">

                <button
                  onClick={() => setPaymentMethod("Credit / Debit Card")}
                  className={`w-full text-left px-6 py-5 rounded-2xl border text-lg font-bold transition ${
                    paymentMethod === "Credit / Debit Card"
                      ? "bg-red-500 text-white border-red-500"
                      : "border-gray-300 dark:border-gray-700"
                  }`}
                >
                  Credit / Debit Card
                </button>

                <button
                  onClick={() => setPaymentMethod("UPI")}
                  className={`w-full text-left px-6 py-5 rounded-2xl border text-lg font-bold transition ${
                    paymentMethod === "UPI"
                      ? "bg-red-500 text-white border-red-500"
                      : "border-gray-300 dark:border-gray-700"
                  }`}
                >
                  UPI Payment
                </button>

                <button
                  onClick={() => setPaymentMethod("Net Banking")}
                  className={`w-full text-left px-6 py-5 rounded-2xl border text-lg font-bold transition ${
                    paymentMethod === "Net Banking"
                      ? "bg-red-500 text-white border-red-500"
                      : "border-gray-300 dark:border-gray-700"
                  }`}
                >
                  Net Banking
                </button>

              </div>

            </div>

          </div>

          {/* RIGHT SIDE */}
          <div>

            <div className="bg-white dark:bg-[#111827] rounded-[32px] p-6 border border-gray-200 dark:border-gray-700 shadow-md sticky top-28">

              <img
                src={course.image}
                alt={course.title}
                className="w-full h-[260px] object-cover rounded-3xl mb-8"
              />

              <h2 className="text-5xl font-black mb-8">
                ₹{course.price}
              </h2>

              <div className="space-y-5 text-lg mb-10">

                <div className="flex justify-between">
                  <span>Lessons</span>
                  <span>{course.shortLessons}</span>
                </div>

                <div className="flex justify-between">
                  <span>Students</span>
                  <span>{course.students}</span>
                </div>

                <div className="flex justify-between">
                  <span>Rating</span>
                  <span>⭐ {course.rating}</span>
                </div>

                <div className="flex justify-between">
                  <span>Category</span>
                  <span>{course.category}</span>
                </div>

              </div>

              <button
                onClick={handleEnrollment}
                className="w-full bg-red-500 hover:bg-red-600 text-white py-5 rounded-full text-xl font-bold transition"
              >
                Complete Enrollment
              </button>

            </div>

          </div>

        </div>

      </div>

    </div>

  )

}

export default EnrollPage
