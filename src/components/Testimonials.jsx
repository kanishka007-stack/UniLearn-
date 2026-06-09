import { motion } from "framer-motion"

export default function Testimonials() {
  return (
    <section className="py-24 px-10 bg-white dark:bg-[#111827] dark:text-gray-100">

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-14 items-center">

        {/* Image */}
        <motion.img
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          src="https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=1000&q=80"
          alt="student"
          className="rounded-3xl shadow-xl"
        />

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
        >

          <p className="text-red-500 italic mb-3">
            Our Testimonials
          </p>

          <h2 className="text-5xl font-bold mb-8">
            Real Students.
            Real Results.
          </h2>

          <p className="text-gray-600 text-lg leading-8 mb-8">
            “I finally understood my semester subjects properly.
            The structured videos and exams made exam prep so
            much easier. Honestly, better than random YouTube learning.”
          </p>

          <div>
            <h4 className="font-bold text-xl">
              Arya Verma
            </h4>

            <p className="text-gray-500">
              B.Tech Student, Semester 2
            </p>
          </div>

        </motion.div>

      </div>

    </section>
  )
}
