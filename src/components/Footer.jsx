import { Link } from "react-router-dom"

export default function Footer() {
  return (

    <footer className="bg-black text-white py-16 px-10">

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">

        {/* Logo & Description */}
        <div>

          <h2 className="text-3xl font-bold text-yellow-400 mb-5">
            UniLearn
          </h2>

          <p className="text-gray-400 leading-8">
            Modern learning platform helping students
            build careers and skills online.
          </p>

        </div>

        {/* Platform Links */}
        <div>

          <h3 className="text-xl font-bold mb-5">
            Platform
          </h3>

          <ul className="space-y-3 text-gray-400">

            <li>
              Courses
            </li>

            <li>
              Live Classes
            </li>

            <li>
              Study Material
            </li>

            <li>
              Certifications
            </li>

          </ul>

        </div>

        {/* Contact */}
        <div>

          <h3 className="text-xl font-bold mb-5">
            Contact
          </h3>

          <ul className="space-y-3 text-gray-400">

            <li>
              support@unilearn.com
            </li>

            <li>
              +91 9876543210
            </li>

            <li>
              India
            </li>

          </ul>

        </div>

        {/* CTA */}
        <div>

          <h3 className="text-xl font-bold mb-5">
            Get Started
          </h3>

          <p className="text-gray-400 mb-6">
            Get study tips, notes &
            updates — straight to your inbox.
          </p>

          <Link
            to="/signin"
            className="inline-block bg-red-500 px-6 py-3 rounded-full hover:bg-red-600 transition"
          >
            Join Now
          </Link>

        </div>

      </div>

      {/* Bottom Line */}
      <div className="border-t border-gray-800 mt-14 pt-6 text-center text-gray-500 text-sm">

        © 2026 UniLearn. All Rights Reserved.

      </div>

    </footer>

  )
}