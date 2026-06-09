import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import axios from "axios"

import { getEnrollments } from "../api/auth"

import {
  hydrateEnrolledCourses,
  toStoredEnrollment,
} from "../data/courses"

import {
  getSyncedEnrolledCourses,
  syncCourseCompletion,
} from "../utils/learningSync"

const MyCourses = () => {

  const [courses, setCourses] = useState([])

  const [progressMap, setProgressMap] =
    useState({})

  useEffect(() => {

    const fetchCourses = async () => {

      try {

        const user = JSON.parse(
          localStorage.getItem("user") || "{}"
        )

        // NO USER
        if (!user?.email) {

          setCourses([])
          return

        }

        // FETCH USER ENROLLMENTS
        const data =
          await getEnrollments(user.email)

        // GET ONLY ENROLLMENTS ARRAY
        const apiCourses =
          Array.isArray(data?.enrollments)
            ? data.enrollments
            : []

        // HYDRATE DATABASE COURSES
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

        // SET COURSES
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

  }, [])

  return (

    <div className="min-h-screen bg-[#f8f6f2] dark:bg-[#0f172a] dark:text-gray-100 py-24 px-6">

      <div className="max-w-7xl mx-auto">

        <h1 className="text-5xl font-black mb-14 text-center">
          My Courses
        </h1>

        {courses.length === 0 ? (

          <div className="text-center">

            <p className="text-2xl text-gray-500 mb-8">
              No Courses Enrolled Yet
            </p>

            <Link
              to="/courses"
              className="bg-red-500 hover:bg-red-600 text-white px-8 py-4 rounded-full font-bold"
            >
              Browse Courses
            </Link>

          </div>

        ) : (

          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-10">

            {courses.map((course) => (

              <div
                key={course.id}
                className="bg-white dark:bg-[#111827] dark:border dark:border-gray-700 rounded-3xl overflow-hidden shadow-xl"
              >

                <div className="p-7">

                  <span className="bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-full text-sm text-gray-600 dark:text-gray-300">
                    Enrolled Course
                  </span>

                  <h2 className="text-3xl font-black mt-5 mb-4">
                    {course.title}
                  </h2>

                  <div className="flex justify-between items-center mb-6">

                    <span className="font-bold text-green-600">
                      Enrolled
                    </span>

                    <span className="text-red-500 font-black text-2xl">
                      &#8377;{course.price}
                    </span>

                  </div>

                  {/* PROGRESS */}
                  <div className="mb-6">

                    <div className="flex justify-between mb-2">

                      <span className="font-semibold">
                        Progress
                      </span>

                      <span className="font-bold text-red-500">
                        {progressMap[course.id] || 0}%
                      </span>

                    </div>

                    <div className="w-full bg-gray-200 dark:bg-gray-700 h-3 rounded-full overflow-hidden">

                      <div
                        className="bg-gradient-to-r from-red-500 to-orange-500 h-3 rounded-full"
                        style={{
                          width:
                            `${progressMap[course.id] || 0}%`
                        }}
                      ></div>

                    </div>

                  </div>

                  <Link
                    to={`/learning/${course.slug}`}
                    className="block w-full bg-green-500 text-white py-4 rounded-2xl font-bold text-center"
                  >
                    Continue Learning
                  </Link>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>

  )

}

export default MyCourses
