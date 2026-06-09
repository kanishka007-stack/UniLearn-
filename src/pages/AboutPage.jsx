import { Link } from "react-router-dom"

export default function AboutPage() {
  return (

    <div className="bg-[#f5f2ee] dark:bg-[#0f172a] dark:text-gray-100 min-h-screen">

      {/* Hero Banner */}
      <section className="relative h-[280px] overflow-hidden">

        {/* Background Image */}
        <img
          src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1600&q=80"
          alt="banner"
          className="w-full h-full object-cover"
        />

        {/* Light Overlay */}
        <div className="absolute inset-0 bg-black/20"></div>

        {/* Breadcrumb */}
        <div className="absolute inset-0 flex items-center justify-center">

          <div className="bg-[#7a7a7a]/70 backdrop-blur-md px-7 py-3 rounded-full flex items-center gap-2 text-white shadow-lg">

            <span className="text-orange-500 text-lg">
              ✦
            </span>

            <span className="text-sm tracking-wide">
              Home {">"} About Us
            </span>

          </div>

        </div>

      </section>

      {/* Section 1 */}
      <section className="max-w-6xl mx-auto py-20 px-6 grid md:grid-cols-2 gap-14 items-center">

        <div>

          <p className="text-red-500 uppercase text-sm mb-3">
            Ready To Learn
          </p>

          <h1 className="text-5xl font-bold leading-tight mb-6">
            Level Up Your Semester
            With Smart Learning
          </h1>

          <p className="text-gray-600 leading-8 mb-8">
            UniLearn helps you understand complex subjects
            with structured videos, notes and exam-focused learning.
          </p>

          <div className="flex gap-4">

            <Link
              to="/contact"
              className="bg-red-500 text-white px-7 py-3 rounded-full hover:bg-red-600 transition"
            >
              Need Help
            </Link>

            <Link
              to="/contact"
              className="bg-white px-7 py-3 rounded-full border hover:bg-black hover:text-white transition"
            >
              Contact Us
            </Link>

          </div>

        </div>

        <img
          src="https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=1000&q=80"
          alt="student"
          className="rounded-3xl shadow-xl w-full"
        />

      </section>

      {/* Section 2 */}
      <section className="max-w-6xl mx-auto py-10 px-6 grid md:grid-cols-2 gap-14 items-center">

        <img
          src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1000&q=80"
          alt="student"
          className="rounded-3xl shadow-xl w-full"
        />

        <div>

          <p className="text-red-500 uppercase text-sm mb-3">
            Our Vision
          </p>

          <h2 className="text-4xl font-bold leading-tight mb-6">
            Making University Learning
            Simple & Effective
          </h2>

          <p className="text-gray-600 leading-8 mb-8">
            We focus on semester-wise education by providing
            structured lessons and practical learning methods.
          </p>

          <div className="bg-white dark:bg-[#111827] p-6 rounded-2xl shadow-sm border dark:border-gray-700 space-y-2">

            <p>✔ Learn exactly what your syllabus demands</p>

            <p>✔ Structured video lectures</p>

            <p>✔ Practice with real exam questions</p>

            <p>✔ Guided learning paths</p>

          </div>

        </div>

      </section>

      {/* Stats Section */}
      <section className="max-w-6xl mx-auto py-20 px-6">

        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 text-center">

          <div className="flex flex-col items-center">

            <div className="w-12 h-12 rounded-full bg-[#e8d6ca] flex items-center justify-center mb-4 text-xl">
              🎓
            </div>

            <h2 className="text-5xl font-bold text-black dark:text-gray-100 mb-2">
              20K+
            </h2>

            <p className="text-sm font-semibold">
              Students Learning Daily
            </p>

          </div>

          <div className="flex flex-col items-center">

            <div className="w-12 h-12 rounded-full bg-[#e8d6ca] flex items-center justify-center mb-4 text-xl">
              📚
            </div>

            <h2 className="text-5xl font-bold text-black dark:text-gray-100 mb-2">
              25K+
            </h2>

            <p className="text-sm font-semibold">
              Lessons Delivered
            </p>

          </div>

          <div className="flex flex-col items-center">

            <div className="w-12 h-12 rounded-full bg-[#e8d6ca] flex items-center justify-center mb-4 text-xl">
              📡
            </div>

            <h2 className="text-5xl font-bold text-black dark:text-gray-100 mb-2">
              20+
            </h2>

            <p className="text-sm font-semibold">
              Live Classes Every Day
            </p>

          </div>

          <div className="flex flex-col items-center">

            <div className="w-12 h-12 rounded-full bg-[#e8d6ca] flex items-center justify-center mb-4 text-xl">
              🧩
            </div>

            <h2 className="text-5xl font-bold text-black dark:text-gray-100 mb-2">
              50+
            </h2>

            <p className="text-sm font-semibold">
              Exam Categories Covered
            </p>

          </div>

        </div>

      </section>

      {/* Testimonial */}
      <section className="max-w-6xl mx-auto py-16 px-6 grid md:grid-cols-2 gap-14 items-center">

        <img
          src="https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=1000&q=80"
          alt="student"
          className="rounded-3xl shadow-xl w-full"
        />

        <div>

          <p className="text-red-500 uppercase text-sm mb-3">
            Our Testimonial
          </p>

          <h2 className="text-4xl font-bold mb-6">
            Real Students.
            Real Results.
          </h2>

          <p className="text-gray-600 leading-8 mb-8">
            I finally understood my semester subjects properly.
            The structured lessons and notes made exam preparation easier.
          </p>

          <div className="border-l-2 border-black dark:border-gray-600 pl-4">

            <h4 className="font-bold">
              Arya Verma
            </h4>

            <p className="text-gray-500">
              B.Tech Student, Semester 2
            </p>

          </div>

        </div>

      </section>

    </div>

  )
}
