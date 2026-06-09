import {
  BookOpen,
  GraduationCap,
  Compass,
  FolderOpen
} from "lucide-react"
import { Link } from "react-router-dom"

const features = [
  {
    icon: <BookOpen size={28} />,
    title: "Online Courses",
    desc: "Turn complex topics into crystal-clear concepts with guided video lessons.",
  },

  {
    icon: <GraduationCap size={28} />,
    title: "Exam Preparation",
    desc: "Score higher with smart practice, PYQs, and exam-focused strategies.",
  },

  {
    icon: <Compass size={28} />,
    title: "Career Roadmap",
    desc: "From confusion to clarity — discover the path that fits you.",
  },

  {
    icon: <FolderOpen size={28} />,
    title: "Study Materials",
    desc: "Everything you need to revise faster and retain longer.",
  },
]

export default function Features() {

  return (

    <section className="py-24 px-6 bg-[#f5f2ee] dark:bg-[#0f172a] dark:text-gray-100">

      {/* Heading */}
      <div className="text-center mb-16">

        <p className="text-red-500 italic text-xl mb-5">
          Guiding Every Learner
        </p>

        <h2 className="text-3xl md:text-5xl font-light uppercase tracking-wide leading-tight text-[#2b2b2b] dark:text-gray-100">

          From Lectures To Careers —
          <br />

          All In One Place

        </h2>

      </div>

      {/* Cards */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">

        {features.map((item, index) => (

          <div
            key={index}
            className="bg-[#dcdcdc] dark:bg-[#111827] dark:border dark:border-gray-700 rounded-3xl p-7 hover:shadow-xl transition duration-300"
          >

            {/* Icon Circle */}
            <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center text-[#ff5a36] mb-6 shadow-sm">

              {item.icon}

            </div>

            {/* Title */}
            <h3 className="text-xl font-bold mb-4 text-black dark:text-gray-100">

              {item.title}

            </h3>

            {/* Description */}
            <p className="text-gray-700 leading-7 text-sm mb-6">

              {item.desc}

            </p>

            {/* Button */}
            <Link
              to={index === 2 ? "/services" : "/courses"}
              className="font-bold text-black dark:text-gray-100 hover:text-red-500 transition"
            >

              Learn More

            </Link>

          </div>

        ))}

      </div>

    </section>

  )
}
