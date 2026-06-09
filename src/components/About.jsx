import { Link } from "react-router-dom"

export default function About() {
  return (
    <section className="py-24 px-10 bg-gray-50 dark:bg-[#0f172a] dark:text-gray-100">

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-14 items-center">

        {/* Image */}
        <div>
          <img
            src="https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=1100&q=80"
            alt="student"
            className="rounded-3xl shadow-xl w-full"
          />
        </div>

        {/* Content */}
        <div>

          <p className="text-red-500 italic mb-3">
            About Us
          </p>

          <h2 className="text-5xl font-bold leading-tight mb-6">
            Empowering Students Beyond The Classroom
          </h2>

          <p className="text-gray-600 text-lg mb-8">
            UniLearn is built for modern learners —
            combining lectures, notes, career guidance
            and live mentorship into one powerful platform.
          </p>

          {/* Features */}
          <div className="space-y-4 mb-8">

            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>

              <p>
                Learn from structured, semester-wise content
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>

              <p>
                Practice with real exam questions
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>

              <p>
                Career guidance and mentorship support
              </p>
            </div>

          </div>

          {/* Buttons */}
          <div className="flex gap-5">

            <Link
              to="/about"
              className="bg-red-500 hover:bg-red-600 text-white px-7 py-3 rounded-full font-semibold transition"
            >
              ABOUT US
            </Link>

            <Link
              to="/contact"
              className="border border-black dark:border-gray-600 px-7 py-3 rounded-full hover:bg-black dark:hover:bg-gray-800 hover:text-white transition"
            >
              Call Us Anytime
            </Link>

          </div>

        </div>

      </div>

    </section>
  )
}
