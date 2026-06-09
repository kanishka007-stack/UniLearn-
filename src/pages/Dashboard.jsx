import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
import { getEnrollments } from "../api/auth"

import {
  hydrateEnrolledCourses,
  toStoredEnrollment,
} from "../data/courses"

import {
  getRecentActivity,
  getSyncedEnrolledCourses,
  syncCourseCompletion,
} from "../utils/learningSync"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

import {
  BookOpen,
  Trophy,
  Clock,
  GraduationCap,
} from "lucide-react"

const Dashboard = () => {

  const navigate = useNavigate()

  const [courses, setCourses] = useState([])

  const [progressMap, setProgressMap] =
    useState({})

  // USER
  const user =
    JSON.parse(localStorage.getItem("user") || "{}")

  useEffect(() => {

    const fetchCourses = async () => {

      try {

        if (!user?.email) {

          setCourses([])
          return

        }

        const data =
          await getEnrollments(user.email)

        // FIX RESPONSE
        const apiCourses =
          Array.isArray(data)
            ? data
            : data.enrollments || []

        // ONLY DATABASE COURSES
        const hydratedCourses =
          hydrateEnrolledCourses(
            getSyncedEnrolledCourses(),
            apiCourses
          ).map(syncCourseCompletion)

        const nextCourses =
          hydratedCourses.length > 0
            ? hydratedCourses
            : getSyncedEnrolledCourses()

        localStorage.setItem(
          "enrolledCourses",
          JSON.stringify(nextCourses.map(toStoredEnrollment).filter(Boolean))
        )

        localStorage.setItem(
          "adminCourses",
          JSON.stringify(
            nextCourses.map((course) => ({
              id: course.id,
              title: course.title,
              category: course.category,
            }))
          )
        )

        setCourses(nextCourses)

        // FETCH MYSQL PROGRESS
        const progressData = {}

        for (const course of nextCourses) {

          try {

            const response =
              await axios.get(

                `http://localhost:5000/api/progress/${user.id}/${course.id}`

              )

            progressData[course.id] =
              response.data.progress?.progress_percent ||
              course.progress ||
              0

          } catch {

            progressData[course.id] = course.progress || 0

          }

        }

        setProgressMap(progressData)

      } catch (error) {

        console.log(error)

        setCourses(getSyncedEnrolledCourses())

      }

    }

    fetchCourses()

    const syncCourses = async () => {

      try {

        if (!user?.email) return

        const data =
          await getEnrollments(user.email)

        const apiCourses =
          Array.isArray(data)
            ? data
            : data.enrollments || []

        const hydratedCourses =
          hydrateEnrolledCourses(
            getSyncedEnrolledCourses(),
            apiCourses
          ).map(syncCourseCompletion)

        const nextCourses =
          hydratedCourses.length > 0
            ? hydratedCourses
            : getSyncedEnrolledCourses()

        localStorage.setItem(
          "enrolledCourses",
          JSON.stringify(nextCourses.map(toStoredEnrollment).filter(Boolean))
        )

        localStorage.setItem(
          "adminCourses",
          JSON.stringify(
            nextCourses.map((course) => ({
              id: course.id,
              title: course.title,
              category: course.category,
            }))
          )
        )

        setCourses(nextCourses)

      } catch (error) {

        console.log(error)

      }

    }

    window.addEventListener("focus", syncCourses)

    return () => {

      window.removeEventListener(
        "focus",
        syncCourses
      )

    }

  }, [user?.email])

  // LOGOUT
  const handleLogout = () => {

    localStorage.removeItem("token")
    localStorage.removeItem("user")

    navigate("/signin")

  }

  // ANALYTICS
  const completedCourses =
    courses.filter(
      (course) =>
        (progressMap[course.id] || 0) >= 80
    )

  const certificatesEarned =
    completedCourses.length

  const totalHours =
    courses.length * 8

  // CHART DATA
  const chartData =
    courses.map((course) => ({
      name:
        course.title.length > 12
          ? course.title.slice(0, 12) + "..."
          : course.title,

      progress:
        progressMap[course.id] || 0,
    }))

  // RECENT ACTIVITY
  const recentActivity =
    getRecentActivity().map((activity) => {

      const activityLabels = {

        enrolled: {
          title: `Enrolled in ${activity.course}`,
          badge: "New",
          color: "bg-blue-500",
        },

        lesson_completed: {
          title: `${activity.course} Lesson Completed`,
          badge: "Lesson",
          color: "bg-green-500",
        },

        quiz_passed: {
          title: `${activity.course} Quiz Passed`,
          badge: "Quiz",
          color: "bg-purple-500",
        },

        certificate_downloaded: {
          title: `${activity.course} Certificate Downloaded`,
          badge: "Certificate",
          color: "bg-green-500",
        },

      }

      return {

        ...(activityLabels[activity.type] || {
          title: activity.course,
          badge: "Update",
          color: "bg-blue-500",
        }),

        time: activity.time || "Recently",

      }

    })

  return (

    <div className="min-h-screen bg-[#f8f6f2] dark:bg-[#0f172a] dark:text-gray-100 py-28 px-6">

      <div className="max-w-7xl mx-auto">

        {/* TOP SECTION */}
        <div className="bg-white/90 dark:bg-[#111827]/95 backdrop-blur-xl border border-white/20 dark:border-gray-700 rounded-[32px] shadow-2xl p-10 mb-12">

          <h1 className="text-5xl font-black mb-4">
            Welcome, {user?.name}
          </h1>

          <p className="text-gray-500 text-xl mb-8">
            {user?.email}
          </p>

          {/* STATUS */}
          <div className="bg-green-100 text-green-700 py-4 rounded-2xl mb-8 font-semibold text-center shadow">

            Authentication Successful ✅

          </div>

          {/* ANALYTICS CARDS */}
          <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-8">

            {/* ENROLLED */}
            <div className="bg-gradient-to-br from-red-500 to-red-700 text-white p-8 rounded-[32px] shadow-2xl relative overflow-hidden">

              <div className="absolute -right-5 -top-5 opacity-20">
                <BookOpen size={120} />
              </div>

              <p className="text-lg mb-3 opacity-80">
                Enrolled Courses
              </p>

              <h2 className="text-6xl font-black">
                {courses.length}
              </h2>

            </div>

            {/* COMPLETED */}
            <div className="bg-gradient-to-br from-green-500 to-green-700 text-white p-8 rounded-[32px] shadow-2xl relative overflow-hidden">

              <div className="absolute -right-5 -top-5 opacity-20">
                <Trophy size={120} />
              </div>

              <p className="text-lg mb-3 opacity-80">
                Completed Courses
              </p>

              <h2 className="text-6xl font-black">
                {completedCourses.length}
              </h2>

            </div>

            {/* CERTIFICATES */}
            <div className="bg-gradient-to-br from-blue-500 to-indigo-700 text-white p-8 rounded-[32px] shadow-2xl relative overflow-hidden">

              <div className="absolute -right-5 -top-5 opacity-20">
                <GraduationCap size={120} />
              </div>

              <p className="text-lg mb-3 opacity-80">
                Certificates Earned
              </p>

              <h2 className="text-6xl font-black">
                {certificatesEarned}
              </h2>

            </div>

            {/* HOURS */}
            <div className="bg-gradient-to-br from-black to-gray-800 text-white p-8 rounded-[32px] shadow-2xl relative overflow-hidden">

              <div className="absolute -right-5 -top-5 opacity-20">
                <Clock size={120} />
              </div>

              <p className="text-lg mb-3 opacity-80">
                Learning Hours
              </p>

              <h2 className="text-6xl font-black">
                {totalHours}h
              </h2>

            </div>

          </div>

        </div>

        {/* ANALYTICS CHART */}
        <div className="bg-white dark:bg-[#111827] dark:border dark:border-gray-700 rounded-[32px] shadow-2xl p-10 mb-12">

          <h2 className="text-4xl font-black mb-10">
            Learning Analytics
          </h2>

          <div className="w-full h-[400px]">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              <BarChart data={chartData}>

                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--chart-tooltip-bg)",
                    color: "var(--chart-tooltip-text)",
                    borderColor: "var(--chart-tooltip-border)",
                    borderRadius: "16px",
                  }}
                  labelStyle={{
                    color: "var(--chart-tooltip-text)",
                  }}
                />

                <Bar
                  dataKey="progress"
                  radius={[10, 10, 0, 0]}
                />

              </BarChart>

            </ResponsiveContainer>

          </div>

        </div>

        {/* QUICK ACTIONS */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">

          <Link
            to="/my-courses"
            className="bg-black text-white p-10 rounded-[32px] hover:scale-105 transition shadow-2xl"
          >

            <h2 className="text-4xl font-black mb-4">
              My Courses
            </h2>

            <p className="text-lg">
              View all your enrolled courses
            </p>

          </Link>

          <Link
            to="/courses"
            className="bg-gradient-to-r from-yellow-400 to-orange-400 text-black p-10 rounded-[32px] hover:scale-105 transition shadow-2xl"
          >

            <h2 className="text-4xl font-black mb-4">
              Browse Courses
            </h2>

            <p className="text-lg">
              Explore more premium courses
            </p>

          </Link>

        </div>

        {/* RECENT COURSES */}
        <div>

          <div className="flex justify-between items-center mb-10">

            <h2 className="text-4xl font-black">
              Recently Enrolled
            </h2>

            <button
              onClick={handleLogout}
              className="bg-gradient-to-r from-red-500 to-red-700 text-white px-6 py-3 rounded-2xl font-semibold shadow-lg"
            >

              Logout

            </button>

          </div>

          {
            courses.length === 0 ? (

              <div className="bg-white dark:bg-[#111827] dark:border dark:border-gray-700 p-10 rounded-[32px] text-center shadow-2xl">

                <p className="text-2xl text-gray-500 mb-6">
                  No Courses Enrolled Yet
                </p>

                <Link
                  to="/courses"
                  className="bg-red-500 text-white px-8 py-4 rounded-full font-bold"
                >

                  Browse Courses

                </Link>

              </div>

            ) : (

              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-10">

                {
                  courses.slice(0, 3).map((course) => (

                    <div
                      key={course.id}
                      className="bg-white dark:bg-[#111827] dark:border dark:border-gray-700 rounded-[32px] overflow-hidden shadow-2xl"
                    >

                      <img
                        src={course.image}
                        alt={course.title}
                        className="w-full h-[220px] object-cover"
                      />

                      <div className="p-7">

                        <span className="bg-gray-100 px-4 py-2 rounded-full text-sm text-gray-600">
                          {course.category}
                        </span>

                        <h2 className="text-3xl font-black mt-5 mb-4">
                          {course.title}
                        </h2>

                        <div className="flex justify-between items-center mb-6">

                          <span className="font-bold">
                            ⭐ {course.rating}
                          </span>

                          <span className="text-red-500 font-black text-2xl">
                            ₹{course.price}
                          </span>

                        </div>

                        {/* PROGRESS */}
                        <div className="mb-5">

                          <div className="flex justify-between mb-2">

                            <span className="font-semibold">
                              Progress
                            </span>

                            <span className="font-bold text-red-500">
                              {progressMap[course.id] || 0}%
                            </span>

                          </div>

                          <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden">

                            <div
                              className="bg-gradient-to-r from-red-500 to-orange-500 h-3 rounded-full"
                              style={{
                                width:
                                  `${progressMap[course.id] || 0}%`
                              }}
                            ></div>

                          </div>

                        </div>

                        {/* CONTINUE */}
                        <button
                          onClick={() => {
                            navigate(
                              `/learning/${course.slug}`
                            )
                          }}
                          className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 rounded-2xl font-bold shadow-lg"
                        >

                          Continue Learning

                        </button>

                      </div>

                    </div>

                  ))
                }

              </div>

            )
          }

        </div>

      </div>

    </div>

  )

}

export default Dashboard
