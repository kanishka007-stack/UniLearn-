import { useState, useEffect } from "react"
import {
  Menu,
  X,
  ChevronDown,
  Moon,
  Sun,
} from "lucide-react"

import {
  Link,
  useNavigate,
  useLocation,
} from "react-router-dom"

export default function Navbar() {

  const [open, setOpen] = useState(false)

  const [pagesOpen, setPagesOpen] =
    useState(false)

  const [darkMode, setDarkMode] =
    useState(

      localStorage.getItem("theme") === "dark"

    )

  const navigate = useNavigate()

  const location = useLocation()

  // APPLY THEME
  useEffect(() => {

    if (darkMode) {

      document.documentElement.classList.add("dark")

      document.body.style.background =
        "#0f172a"

      localStorage.setItem(
        "theme",
        "dark"
      )

    } else {

      document.documentElement.classList.remove(
        "dark"
      )

      document.body.style.background =
        "#f5f2ee"

      localStorage.setItem(
        "theme",
        "light"
      )

    }

  }, [darkMode])

  // LIGHT BACKGROUND PAGES
  const lightNavbarPages = [
    "/courses",
    "/dashboard",
    "/profile",
    "/contact",
    "/about",
    "/my-courses",
  ]

  const isLightPage =
    lightNavbarPages.includes(location.pathname) ||
    location.pathname.startsWith("/course/") ||
    location.pathname.startsWith("/learning/") ||
    location.pathname.startsWith("/certificate/")

  // CHECK LOGIN
  const isLoggedIn =
    localStorage.getItem("user")

  // GET USER
  const user =
    JSON.parse(localStorage.getItem("user"))

  // LOGOUT FUNCTION
  const handleLogout = () => {

    localStorage.removeItem("token")

    localStorage.removeItem("user")

    alert("Logged Out Successfully")

    navigate("/signin")

  }

  return (

    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        darkMode
          ? "bg-[#111827] text-white shadow-lg"
          : isLightPage
          ? "bg-white shadow-md text-black"
          : "bg-transparent text-white"
      }`}
    >

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 md:px-8 py-5">

        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-bold text-yellow-400"
        >

          UniLearn

        </Link>

        {/* Desktop Menu */}
        <ul
          className={`hidden md:flex gap-8 font-medium items-center ${
            darkMode
              ? "text-white"
              : isLightPage
              ? "text-black"
              : "text-white"
          }`}
        >

          {/* Home */}
          <li className="hover:text-yellow-400 transition">

            <Link to="/">
              Home
            </Link>

          </li>

          {/* Pages Dropdown */}
          <li className="relative">

            <button
              onClick={() =>
                setPagesOpen(!pagesOpen)
              }
              className="flex items-center gap-1 cursor-pointer hover:text-yellow-400 transition"
            >

              Pages

              <ChevronDown size={18} />

            </button>

            {/* Dropdown */}
            {pagesOpen && (

              <div className="absolute top-10 left-0 bg-white dark:bg-[#111827] text-black dark:text-gray-100 border border-transparent dark:border-gray-700 rounded-xl shadow-xl w-48 overflow-hidden z-50">

                <Link
                  to="/about"
                  onClick={() =>
                    setPagesOpen(false)
                  }
                  className="block px-5 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                >

                  About Us

                </Link>

                <Link
                  to="/signin"
                  onClick={() =>
                    setPagesOpen(false)
                  }
                  className="block px-5 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                >

                  Sign In

                </Link>

                <Link
                  to="/services"
                  onClick={() =>
                    setPagesOpen(false)
                  }
                  className="block px-5 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                >

                  Services

                </Link>

              </div>

            )}

          </li>

          {/* Courses */}
          <li className="hover:text-yellow-400 transition">

            <Link to="/courses">
              Courses
            </Link>

          </li>

          {/* Dashboard */}
          <li className="hover:text-yellow-400 transition">

            <Link to="/dashboard">
              Dashboard
            </Link>

          </li>

          {/* Profile */}
          <li className="hover:text-yellow-400 transition">

            <Link to="/profile">
              Profile
            </Link>

          </li>

          {/* Contact */}
          <li className="hover:text-yellow-400 transition">

            <Link to="/contact">
              Contact Us
            </Link>

          </li>

        </ul>

        {/* RIGHT SIDE */}
        <div className="hidden md:flex items-center gap-4">

          {/* THEME TOGGLE */}
          <button

            onClick={() =>
              setDarkMode(!darkMode)
            }

            className={`p-3 rounded-full transition ${
              darkMode
                ? "bg-yellow-400 text-black"
                : "bg-black text-white"
            }`}
          >

            {darkMode

              ? <Sun size={20} />

              : <Moon size={20} />}

          </button>

          {/* LOGIN / LOGOUT */}
          {
            isLoggedIn ? (

              <button
                onClick={handleLogout}
                className="bg-black text-white px-5 py-2 rounded-full hover:bg-red-600 transition font-bold"
              >

                {user?.name} | LOGOUT

              </button>

            ) : (

              <Link
                to="/signin"
                className="bg-red-500 text-white px-5 py-2 rounded-full hover:bg-red-600 transition font-bold"
              >

                LOGIN

              </Link>

            )
          }

        </div>

        {/* Mobile Menu Button */}
        <button
          className={`md:hidden ${
            darkMode
              ? "text-white"
              : isLightPage
              ? "text-black"
              : "text-white"
          }`}
          onClick={() => setOpen(!open)}
        >

          {open

            ? <X size={30} />

            : <Menu size={30} />}

        </button>

      </div>

      {/* Mobile Menu */}
      {open && (

        <div className="md:hidden bg-black/95 px-6 py-6 space-y-5 text-lg text-white">

          <button

            onClick={() =>
              setDarkMode(!darkMode)
            }

            className="bg-yellow-400 text-black px-5 py-2 rounded-full font-bold"
          >

            {darkMode
              ? "Light Mode"
              : "Dark Mode"}

          </button>

          <Link
            to="/"
            onClick={() => setOpen(false)}
            className="block"
          >

            Home

          </Link>

          <Link
            to="/about"
            onClick={() => setOpen(false)}
            className="block"
          >

            About Us

          </Link>

          <Link
            to="/services"
            onClick={() => setOpen(false)}
            className="block"
          >

            Services

          </Link>

          <Link
            to="/courses"
            onClick={() => setOpen(false)}
            className="block"
          >

            Courses

          </Link>

          <Link
            to="/dashboard"
            onClick={() => setOpen(false)}
            className="block"
          >

            Dashboard

          </Link>

          <Link
            to="/profile"
            onClick={() => setOpen(false)}
            className="block"
          >

            Profile

          </Link>


          <Link
            to="/contact"
            onClick={() => setOpen(false)}
            className="block"
          >

            Contact Us

          </Link>

          {/* MOBILE LOGIN / LOGOUT */}
          {
            isLoggedIn ? (

              <button
                onClick={handleLogout}
                className="inline-block bg-black px-5 py-2 rounded-full hover:bg-red-600 transition font-bold"
              >

                {user?.name} | LOGOUT

              </button>

            ) : (

              <Link
                to="/signin"
                onClick={() => setOpen(false)}
                className="inline-block bg-red-500 px-5 py-2 rounded-full hover:bg-red-600 transition font-bold"
              >

                LOGIN

              </Link>

            )
          }

        </div>

      )}

    </nav>

  )

}
