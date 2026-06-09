import { useEffect, useState } from "react"
import {
  Trophy,
  Flame,
  GraduationCap,
  BookOpen,
} from "lucide-react"
import {
  getCertificatesCount,
  getCompletedCourses,
  getLearningStreak,
  getRecentActivity,
  getSyncedEnrolledCourses,
} from "../utils/learningSync"

const ProfilePage = () => {

  const user =
    JSON.parse(localStorage.getItem("user"))

  const [enrolledCourses, setEnrolledCourses] =
    useState([])

  const [completedCourses, setCompletedCourses] =
    useState([])

  const [certificates, setCertificates] =
    useState(0)

  const [streak, setStreak] =
    useState(0)

  const [recentActivity, setRecentActivity] =
    useState([])

  useEffect(() => {

    const syncProfile = () => {

      setEnrolledCourses(getSyncedEnrolledCourses())
      setCompletedCourses(getCompletedCourses())
      setCertificates(getCertificatesCount())
      setStreak(getLearningStreak())
      setRecentActivity(getRecentActivity())

    }

    syncProfile()

    window.addEventListener("storage", syncProfile)
    window.addEventListener("focus", syncProfile)
    window.addEventListener("unilearn-sync", syncProfile)

    return () => {
      window.removeEventListener("storage", syncProfile)
      window.removeEventListener("focus", syncProfile)
      window.removeEventListener("unilearn-sync", syncProfile)
    }

  }, [])

  return (

    <div className="min-h-screen bg-[#f8f6f2] dark:bg-[#0f172a] dark:text-gray-100 pt-28 px-6">

      <div className="max-w-7xl mx-auto">

        {/* PROFILE HEADER */}
        <div className="bg-white/90 dark:bg-[#111827]/95 backdrop-blur-xl rounded-[40px] shadow-2xl p-10 mb-12 dark:border dark:border-gray-700">

          <div className="flex flex-col lg:flex-row items-center gap-10">

            {/* AVATAR */}
            <div className="w-44 h-44 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-white text-6xl font-black shadow-2xl">

              {user?.name?.charAt(0) || "U"}

            </div>

            {/* INFO */}
            <div className="flex-1">

              <h1 className="text-6xl font-black mb-4">

                {user?.name || "Student"}

              </h1>

              <p className="text-2xl text-gray-500 mb-6">

                {user?.email || "student@gmail.com"}

              </p>

              <p className="text-lg text-gray-600 leading-relaxed max-w-3xl">

                Passionate learner focused on building
                technical and creative skills through
                online learning and real-world projects.

              </p>

            </div>

          </div>

        </div>

        {/* STATS */}
        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-8 mb-12">

          {/* ENROLLED */}
          <div className="bg-gradient-to-br from-red-500 to-red-700 text-white p-8 rounded-[32px] shadow-2xl relative overflow-hidden">

            <div className="absolute -right-5 -top-5 opacity-20">

              <BookOpen size={120} />

            </div>

            <p className="text-lg opacity-80 mb-3">

              Enrolled Courses

            </p>

            <h2 className="text-6xl font-black">

              {enrolledCourses.length}

            </h2>

          </div>

          {/* COMPLETED */}
          <div className="bg-gradient-to-br from-green-500 to-green-700 text-white p-8 rounded-[32px] shadow-2xl relative overflow-hidden">

            <div className="absolute -right-5 -top-5 opacity-20">

              <Trophy size={120} />

            </div>

            <p className="text-lg opacity-80 mb-3">

              Completed Courses

            </p>

            <h2 className="text-6xl font-black">

              {completedCourses.length}

            </h2>

          </div>

          {/* STREAK */}
          <div className="bg-gradient-to-br from-orange-500 to-yellow-500 text-white p-8 rounded-[32px] shadow-2xl relative overflow-hidden">

            <div className="absolute -right-5 -top-5 opacity-20">

              <Flame size={120} />

            </div>

            <p className="text-lg opacity-80 mb-3">

              Learning Streak

            </p>

            <h2 className="text-6xl font-black">

              {streak}🔥

            </h2>

          </div>

          {/* CERTIFICATES */}
          <div className="bg-gradient-to-br from-blue-500 to-indigo-700 text-white p-8 rounded-[32px] shadow-2xl relative overflow-hidden">

            <div className="absolute -right-5 -top-5 opacity-20">

              <GraduationCap size={120} />

            </div>

            <p className="text-lg opacity-80 mb-3">

              Certificates

            </p>

            <h2 className="text-6xl font-black">

              {certificates}

            </h2>

          </div>

        </div>

        {/* ACHIEVEMENTS */}
        <div className="bg-white dark:bg-[#111827] dark:border dark:border-gray-700 rounded-[32px] shadow-2xl p-10 mb-12">

          <h2 className="text-5xl font-black mb-10">

            Achievements

          </h2>

          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">

            {/* FAST LEARNER */}
            <div className="bg-gradient-to-r from-yellow-400 to-orange-400 p-8 rounded-[28px] shadow-xl">

              <h3 className="text-3xl font-black mb-4">

                Fast Learner 🚀

              </h3>

              <p className="text-lg">

                Completed first course successfully

              </p>

            </div>

            {/* QUIZ MASTER */}
            <div className="bg-gradient-to-r from-green-400 to-emerald-500 p-8 rounded-[28px] shadow-xl text-white">

              <h3 className="text-3xl font-black mb-4">

                Quiz Master 🧠

              </h3>

              <p className="text-lg">

                Passed all course quizzes

              </p>

            </div>

            {/* DEDICATED */}
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-8 rounded-[28px] shadow-xl text-white">

              <h3 className="text-3xl font-black mb-4">

                Dedicated Student 🎓

              </h3>

              <p className="text-lg">

                Maintained continuous learning streak

              </p>

            </div>

          </div>

        </div>

        {/* COMPLETED COURSES */}
        <div className="bg-white dark:bg-[#111827] dark:border dark:border-gray-700 rounded-[32px] shadow-2xl p-10">

          <h2 className="text-5xl font-black mb-10">

            Completed Courses

          </h2>

          {
            completedCourses.length > 0
            ? (

              <div className="grid md:grid-cols-2 gap-6">

                {
                  completedCourses.map((course) => (

                    <div
                      key={course.id}
                      className="bg-gray-100 rounded-[24px] p-6"
                    >

                      <h3 className="text-2xl font-black mb-3">

                        {course.title}

                      </h3>

                      <p className="text-gray-500 mb-5">

                        {course.category}

                      </p>

                      <div className="inline-block bg-green-100 text-green-700 px-5 py-2 rounded-xl font-bold">

                        Completed ✅

                      </div>

                    </div>

                  ))
                }

              </div>

            )
            : (

              <div className="bg-gray-100 rounded-3xl p-10 text-center">

                <h3 className="text-3xl font-black mb-3">

                  No Completed Courses Yet

                </h3>

                <p className="text-gray-500 text-lg">

                  Finish 80% of a course to see it here.

                </p>

              </div>

            )
          }

        </div>

        {/* RECENT ACTIVITY */}
        <div className="bg-white dark:bg-[#111827] dark:border dark:border-gray-700 rounded-[32px] shadow-2xl p-10 mt-12">

          <h2 className="text-5xl font-black mb-10">

            Recent Activity

          </h2>

          {
            recentActivity.length > 0
            ? (

              <div className="space-y-5">

                {
                  recentActivity.slice(0, 5).map((activity, index) => (

                    <div
                      key={index}
                      className="bg-gray-100 dark:bg-[#1f2937] rounded-[24px] p-6"
                    >

                      <h3 className="text-2xl font-black mb-2">

                        {activity.course}

                      </h3>

                      <p className="text-gray-500">

                        {activity.type} · {activity.time || "Recently"}

                      </p>

                    </div>

                  ))
                }

              </div>

            )
            : (

              <div className="bg-gray-100 dark:bg-[#1f2937] rounded-3xl p-10 text-center">

                <h3 className="text-3xl font-black mb-3">

                  No Recent Activity Yet

                </h3>

                <p className="text-gray-500 text-lg">

                  Start learning to see activity updates.

                </p>

              </div>

            )
          }

        </div>

      </div>

    </div>

  )

}

export default ProfilePage
