import { Link } from "react-router-dom"

export default function Showcase() {
  return (
    <section className="py-24 px-10 bg-white dark:bg-[#111827] dark:text-gray-100">

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">

        {/* Left Content */}
        <div>

          <p className="text-red-500 italic mb-3">
            Personal Learning
          </p>

          <h2 className="text-5xl font-bold leading-tight mb-6">
            Find Your Stream,
            <br />
            Start Your Journey
          </h2>

          <p className="text-gray-600 text-lg mb-8">
            Explore modern learning paths designed for
            students, professionals and career-focused learners.
          </p>

          <Link
            to="/courses"
            className="inline-block bg-red-500 hover:bg-red-600 text-white px-7 py-3 rounded-full font-semibold transition"
          >
            Browse Streams
          </Link>

        </div>

        {/* Right Images */}
        <div className="grid grid-cols-2 gap-5">

          <img
            src="https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=900&q=80"
            alt="student"
            className="rounded-3xl h-80 w-full object-cover shadow-xl"
          />

          <img
            src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=900&q=80"
            alt="students"
            className="rounded-3xl h-80 w-full object-cover shadow-xl mt-16"
          />

        </div>

      </div>

    </section>
  )
}
