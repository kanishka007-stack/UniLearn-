import { Link } from "react-router-dom"

export default function Hero() {
  return (
    <section className="relative h-screen w-full">

      {/* Background Image */}
      <img
        src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1800&q=80"
        alt="students"
        className="absolute w-full h-full object-cover"
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-center h-full px-10 md:px-20 text-white">

        <p className="text-yellow-400 text-xl mb-3">
          Online Courses
        </p>

        <h1 className="text-5xl md:text-7xl font-bold leading-tight max-w-3xl">
          For Remote Learning & Education
        </h1>

        <p className="mt-6 text-lg max-w-xl text-gray-200">
          Acquire global knowledge and build your educational skills
          with modern online learning.
        </p>

        <div className="mt-8 flex gap-4">
          <Link
            to="/courses"
            className="bg-red-500 hover:bg-red-600 px-6 py-3 rounded-full font-semibold transition"
          >
            Explore Now
          </Link>

          <Link
            to="/about"
            className="border border-white px-6 py-3 rounded-full hover:bg-white hover:text-black transition"
          >
            Learn More
          </Link>
        </div>

      </div>
    </section>
  )
}
