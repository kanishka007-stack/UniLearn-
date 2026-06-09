import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { useEffect, useState } from "react"
import axios from "axios"

export default function Courses() {
  const [featuredCourses, setFeaturedCourses] = useState([])

  useEffect(() => {
    const fetchFeaturedCourses = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/courses")

        if (response.data?.success) {
          setFeaturedCourses((response.data.courses || []).slice(0, 4))
        }
      } catch (error) {
        console.log(error)
      }
    }

    fetchFeaturedCourses()
  }, [])

  return (
    <section className="py-24 px-10 bg-gray-50 dark:bg-[#0f172a] dark:text-gray-100">

      <div className="text-center mb-16">

        <p className="text-red-500 italic">
          Our Courses
        </p>

        <h2 className="text-5xl font-bold mt-3">
          Explore Popular Courses
        </h2>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-7xl mx-auto">

        {featuredCourses.map((course, index) => (

          <motion.div
            key={index}
            whileHover={{ y: -10 }}
            className="bg-white dark:bg-[#111827] dark:border dark:border-gray-700 p-8 rounded-3xl shadow-lg"
          >

            <div className="w-16 h-16 bg-red-100 rounded-2xl mb-6 overflow-hidden">
              <img
                src={course.image}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>

            <h3 className="text-2xl font-bold mb-4">
              {course.title}
            </h3>

            <p className="text-gray-600 mb-6">
              {course.description}
            </p>

            <Link
              to={`/course/${course.slug}`}
              className="inline-block bg-red-500 text-white px-5 py-2 rounded-full hover:bg-red-600 transition"
            >
              Learn More
            </Link>

          </motion.div>

        ))}

      </div>

    </section>
  )
}
