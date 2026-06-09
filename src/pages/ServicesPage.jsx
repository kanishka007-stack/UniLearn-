const services = [
  {
    title: "Semester Courses",
    desc: "Learn subjects exactly as per your syllabus",
  },

  {
    title: "Video Lectures",
    desc: "Clear concepts with structured videos",
  },

  {
    title: "Exam Preparation",
    desc: "Practice PYQs and mock tests",
  },

  {
    title: "Study Materials",
    desc: "Notes, PDFs, revision content",
  },

  {
    title: "Progress Tracking",
    desc: "Track your learning progress",
  },

  {
    title: "Career Guidance",
    desc: "Get direction for future",
  },
]

export default function ServicesPage() {

  return (

    <div className="bg-[#f5f2ee] dark:bg-[#0f172a] dark:text-gray-100 min-h-screen">

      {/* Hero Banner */}
      <section className="relative h-[280px] overflow-hidden">

        <img
          src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1600&q=80"
          alt="banner"
          className="w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-black/20"></div>

        {/* Breadcrumb */}
        <div className="absolute inset-0 flex items-center justify-center">

          <div className="bg-[#7a7a7a]/70 backdrop-blur-md px-7 py-3 rounded-full flex items-center gap-2 text-white shadow-lg">

            <span className="text-orange-500 text-lg">
              ✦
            </span>

            <span className="text-sm tracking-wide">
              Home {">"} Services
            </span>

          </div>

        </div>

      </section>

      {/* Heading */}
      <section className="pt-24 pb-16 px-6 text-center">

        <div className="flex justify-center items-center gap-2 mb-5">

          <span className="text-red-500 text-lg">
            🎓
          </span>

          <p className="text-black dark:text-gray-200 uppercase text-sm tracking-wide">
            Explore Learning
          </p>

        </div>

        <h2 className="text-4xl md:text-6xl font-serif leading-tight text-[#1f1f1f] dark:text-gray-100">

          Everything You Need To Master
          <br />

          Your Semester

        </h2>

      </section>

      {/* Services Grid */}
      <section className="max-w-6xl mx-auto px-6 pb-28">

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 justify-items-center">

          {services.map((item, index) => (

            <div
              key={index}
              className={`
                border border-gray-500 rounded-3xl
                w-[220px] h-[220px]
                bg-transparent dark:bg-[#111827]
                px-7 py-7
                flex flex-col
                transition duration-300
                hover:shadow-lg

                ${index >= 4 ? "md:translate-x-[120px]" : ""}
              `}
            >

              {/* Circle */}
              <div className="w-7 h-7 rounded-full bg-[#e5b6b6] mb-6"></div>

              {/* Title */}
              <h3 className="text-[20px] leading-9 font-serif text-center mb-5 text-[#1f1f1f] dark:text-gray-100">

                {item.title}

              </h3>

              {/* Description */}
              <p className="text-[13px] uppercase text-center leading-7 tracking-wide text-[#2b2b2b] dark:text-gray-300">

                {item.desc}

              </p>

            </div>

          ))}

        </div>

      </section>

      {/* Career Guidance */}
      <section className="max-w-6xl mx-auto px-6 pb-24 grid md:grid-cols-2 gap-16 items-center">

        {/* Image */}
        <img
          src="https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1100&q=80"
          alt="coding"
          className="rounded-3xl shadow-xl w-full"
        />

        {/* Content */}
        <div>

          <div className="flex items-center gap-2 mb-5">

            <span className="text-red-500">
              🎓
            </span>

            <p className="uppercase text-sm">
              Explore Learning
            </p>

          </div>

          <h2 className="text-4xl font-light mb-6">
            Career Guidance
          </h2>

          <p className="text-gray-700 leading-8 mb-10">
            UniLearn not only helps you pass exams,
            but also prepares you with practical skills
            for your future career.
          </p>

          {/* Features */}
          <div className="grid grid-cols-2 gap-10">

            <div>

              <div className="text-2xl mb-3">
                🧠
              </div>

              <h4 className="font-semibold mb-2">
                Study Help
              </h4>

              <p className="text-sm text-gray-600 leading-6">
                High-quality educational support.
              </p>

            </div>

            <div>

              <div className="text-2xl mb-3">
                ✍️
              </div>

              <h4 className="font-semibold mb-2">
                Writing Help
              </h4>

              <p className="text-sm text-gray-600 leading-6">
                Improve academic and writing skills.
              </p>

            </div>

          </div>

        </div>

      </section>

    </div>

  )
}
