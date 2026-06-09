import { Link } from "react-router-dom"
import { useEffect, useMemo, useState } from "react"
import axios from "axios"
import { getEnrollments } from "../api/auth"

export default function CoursesPage() {

  const [courses, setCourses] = useState([])
  const [enrolledSlugs, setEnrolledSlugs] = useState(new Set())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const [searchTerm, setSearchTerm] =
    useState("")

  const [selectedCategory, setSelectedCategory] =
    useState("All")

  // =========================
  // FETCH COURSES
  // =========================
  useEffect(() => {

    const fetchCourses = async () => {

      try {
        setLoading(true)
        setError("")

        const response = await axios.get(
          "http://localhost:5000/api/courses"
        )

        if (response.data.success) {

          setCourses(response.data.courses)

        }

      } catch (error) {

        console.log(error)
        setError("Courses could not be loaded. Please try again later.")

      } finally {
        setLoading(false)
      }

    }

    fetchCourses()

  }, [])

  useEffect(() => {
    const syncEnrollments = async () => {
      const slugs = new Set()

      try {
        const storedCourses = JSON.parse(
          localStorage.getItem("enrolledCourses") || "[]"
        )

        storedCourses.forEach((course) => {
          if (course?.slug) slugs.add(course.slug)
          if (course?.id) slugs.add(String(course.id))
        })
      } catch {
        // local fallback is optional
      }

      const user = JSON.parse(localStorage.getItem("user") || "{}")

      if (user?.email) {
        try {
          const data = await getEnrollments(user.email)
          const enrollments = Array.isArray(data?.enrollments)
            ? data.enrollments
            : []

          enrollments.forEach((course) => {
            if (course?.course_slug) slugs.add(course.course_slug)
            if (course?.slug) slugs.add(course.slug)
            if (course?.course_id) slugs.add(String(course.course_id))
            if (course?.course_name) slugs.add(course.course_name)
          })
        } catch {
          // keep local enrollment state
        }
      }

      setEnrolledSlugs(slugs)
    }

    syncEnrollments()

    window.addEventListener("storage", syncEnrollments)
    window.addEventListener("focus", syncEnrollments)
    window.addEventListener("unilearn-sync", syncEnrollments)

    return () => {
      window.removeEventListener("storage", syncEnrollments)
      window.removeEventListener("focus", syncEnrollments)
      window.removeEventListener("unilearn-sync", syncEnrollments)
    }
  }, [])

  // =========================
  // CATEGORIES
  // =========================
  const categories = useMemo(() => {

    const uniqueCategories = [
      ...new Set(
        courses.map(
          (course) => course.category
        )
      ),
    ]

    return ["All", ...uniqueCategories]

  }, [courses])

  // =========================
  // FILTERED COURSES
  // =========================
  const filteredCourses = courses.filter(
    (course) => {

      const matchesSearch =

        course.title
          .toLowerCase()
          .includes(
            searchTerm.toLowerCase()
          ) ||

        course.category
          .toLowerCase()
          .includes(
            searchTerm.toLowerCase()
          )

      const matchesCategory =

        selectedCategory === "All" ||

        course.category === selectedCategory

      return (
        matchesSearch &&
        matchesCategory
      )

    }
  )

  return (

    <div className="bg-[#f5f2ee] dark:bg-[#0f172a] dark:text-gray-100 min-h-screen">

      {/* HERO */}
      <section className="relative h-[420px] overflow-hidden pt-[70px] -mt-[2px]">

        <img
          src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1600&q=80"
          alt="Courses Banner"
          className="w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-black/60"></div>

        <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-6">

          <div className="bg-[#6d6d6d]/80 backdrop-blur-md px-8 py-3 rounded-full flex items-center gap-2 shadow-xl mb-6 mt-10">

            <span className="text-orange-500 text-lg">
              ✦
            </span>

            <span className="tracking-wide">
              Home {">"} Courses
            </span>

          </div>

          <h1 className="text-5xl md:text-7xl font-black text-center mb-6">

            Explore Courses

          </h1>

          <p className="text-lg md:text-xl text-center max-w-2xl text-gray-200 leading-9">

            Discover premium courses designed to help you build
            real-world skills and advance your career.

          </p>

        </div>

      </section>

      {/* SEARCH + FILTER */}
      <section className="max-w-[1500px] mx-auto px-6 md:px-10 pt-16">

        <div className="bg-white dark:bg-[#111827] dark:border dark:border-gray-700 rounded-[32px] shadow-xl p-8 mb-16">

          {/* SEARCH */}
          <div className="mb-8">

            <input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(e.target.value)
              }
              className="w-full bg-[#f5f5f5] dark:bg-[#1f2937] border border-gray-200 dark:border-gray-700 dark:text-gray-100 rounded-2xl px-6 py-5 text-lg outline-none focus:border-red-400 transition"
            />

          </div>

          {/* FILTERS */}
          <div className="flex flex-wrap gap-4">

            {categories.map((category) => (

              <button
                key={category}
                onClick={() =>
                  setSelectedCategory(category)
                }
                className={`px-6 py-3 rounded-full font-semibold transition ${
                  selectedCategory === category

                    ? "bg-red-500 text-white shadow-lg"

                    : "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
                }`}
              >

                {category}

              </button>

            ))}

          </div>

        </div>

      </section>

      {/* COURSES */}
      <section className="max-w-[1500px] mx-auto px-6 md:px-10 pb-24">

        {/* RESULTS */}
        <div className="flex justify-between items-center mb-10 flex-wrap gap-4">

          <h2 className="text-4xl font-black text-[#111] dark:text-gray-100">

            Available Courses

          </h2>

          <p className="text-lg text-gray-500">

            {filteredCourses.length} Course
            {filteredCourses.length !== 1 && "s"} Found

          </p>

        </div>

        {/* EMPTY */}
        {loading ? (

          <div className="bg-white dark:bg-[#111827] dark:border dark:border-gray-700 rounded-[32px] p-20 text-center shadow-lg">
            <h3 className="text-4xl font-black mb-6">
              Loading Courses...
            </h3>
          </div>

        ) : error ? (

          <div className="bg-white dark:bg-[#111827] dark:border dark:border-gray-700 rounded-[32px] p-20 text-center shadow-lg">
            <h3 className="text-4xl font-black mb-6">
              Unable To Load Courses
            </h3>
            <p className="text-gray-500 text-lg">
              {error}
            </p>
          </div>

        ) : filteredCourses.length === 0 ? (

          <div className="bg-white dark:bg-[#111827] dark:border dark:border-gray-700 rounded-[32px] p-20 text-center shadow-lg">

            <h3 className="text-4xl font-black mb-6">
              No Courses Found
            </h3>

            <p className="text-gray-500 text-lg">
              Try searching with different keywords or categories.
            </p>

          </div>

        ) : (

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-12">

            {filteredCourses.map((course) => (

              <div
                key={course.id}
                className="bg-white dark:bg-[#111827] rounded-[32px] overflow-hidden border border-gray-200 dark:border-gray-700 shadow-md hover:shadow-2xl hover:-translate-y-2 transition duration-300 flex flex-col"
              >

                {/* IMAGE */}
                <div className="h-[250px] overflow-hidden relative">

                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-full object-cover hover:scale-105 transition duration-500"
                  />

                  <div className="absolute top-5 left-5">

                    <span className="bg-white/90 dark:bg-[#111827]/90 backdrop-blur-md text-gray-700 dark:text-gray-200 text-sm px-5 py-2 rounded-full shadow">

                      {course.category}

                    </span>

                  </div>

                </div>

                {/* CONTENT */}
                <div className="p-8 flex flex-col flex-1">

                  {/* LESSONS */}
                  <div className="flex justify-between items-center text-[15px] text-gray-500 mb-6">

                    <span>
                      🎓 {course.lessons}
                    </span>

                    <span>
                      ⭐ {course.rating}
                    </span>

                  </div>

                  {/* TITLE */}
                  <h2 className="text-[32px] leading-[42px] font-black text-[#111] dark:text-gray-100 mb-8 min-h-[120px]">

                    {course.title}

                  </h2>

                  {/* PRICE */}
                  <div className="flex justify-between items-center mb-10">

                    <span className="text-gray-500 font-medium">

                      Premium Course

                    </span>

                    <span className="text-red-500 text-[34px] font-black">

                      ₹{course.price}

                    </span>

                  </div>

                  {/* BUTTONS */}
                  <div className="flex flex-col gap-4 mt-auto">

                    {/* VIEW DETAILS */}
                    <Link
                      to={`/course/${course.slug}`}
                      className="block text-center bg-red-500 hover:bg-red-600 transition text-white py-5 rounded-full font-bold text-xl"
                    >

                      View Details →

                    </Link>

                    {/* ENROLL BUTTON */}
                    <Link
                      to={
                        enrolledSlugs.has(course.slug) ||
                        enrolledSlugs.has(String(course.id)) ||
                        enrolledSlugs.has(course.title)
                          ? `/learning/${course.slug}`
                          : `/enroll/${course.slug || course.id}`
                      }
                      className={`transition text-white py-4 rounded-full font-bold text-lg text-center ${
                        enrolledSlugs.has(course.slug) ||
                        enrolledSlugs.has(String(course.id)) ||
                        enrolledSlugs.has(course.title)
                          ? "bg-green-500 hover:bg-green-600"
                          : "bg-blue-500 hover:bg-blue-600"
                      }`}
                    >

                      {enrolledSlugs.has(course.slug) ||
                      enrolledSlugs.has(String(course.id)) ||
                      enrolledSlugs.has(course.title)
                        ? "Continue Learning"
                        : "Enroll Now"}

                    </Link>

                  </div>

                </div>

              </div>

            ))}

          </div>

        )}

      </section>

    </div>

  )

}
