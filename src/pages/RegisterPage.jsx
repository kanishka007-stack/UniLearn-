import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"

import {
  Eye,
  EyeOff
} from "lucide-react"

import { registerUser } from "../api/auth"

const RegisterPage = () => {

  const navigate = useNavigate()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] =
    useState("")

  const [showPassword, setShowPassword] =
    useState(false)

  const [
    showConfirmPassword,
    setShowConfirmPassword
  ] = useState(false)

  const handleRegister = async (e) => {

    e.preventDefault()

    if (password !== confirmPassword) {

      alert("Passwords do not match")

      return

    }

    try {

      const data = await registerUser({
        name,
        email,
        password,
      })

      if (data.success) {

        alert("Registration Successful")

        navigate("/signin")

      } else {

        alert(data.message)

      }

    } catch (error) {

      console.log(error)

      alert("Registration Failed")

    }

  }

  return (

    <div className="min-h-screen bg-[#f8f6f2] dark:bg-[#020817] dark:text-white flex justify-center px-6 pt-32 pb-16">

      <div className="w-full max-w-md mx-auto">

        {/* TITLE */}
        <h1 className="text-5xl font-black text-center mb-4">
          Create an Account
        </h1>

        <p className="text-center text-gray-500 dark:text-gray-400 mb-12 text-lg">

          Already have an account?

          <Link
            to="/signin"
            className="text-red-500 ml-2 font-semibold"
          >
            Sign In
          </Link>

        </p>

        {/* FORM */}
        <form
          onSubmit={handleRegister}
          className="space-y-8"
        >

          {/* FULL NAME */}
          <div>

            <label className="block mb-3 font-semibold">
              Full Name
            </label>

            <input
              type="text"
              placeholder="Type your name"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              className="w-full bg-[#f3f0ea] dark:bg-[#1e293b] dark:text-white rounded-xl px-5 py-4 outline-none"
              required
            />

          </div>

          {/* EMAIL */}
          <div>

            <label className="block mb-3 font-semibold">
              Email
            </label>

            <input
              type="email"
              placeholder="Type your email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              className="w-full bg-[#f3f0ea] dark:bg-[#1e293b] dark:text-white rounded-xl px-5 py-4 outline-none"
              required
            />

          </div>

          {/* PASSWORD */}
          <div>

            <label className="block mb-3 font-semibold">
              Password
            </label>

            <div className="relative">

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                placeholder="Password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                className="w-full bg-[#f3f0ea] dark:bg-[#1e293b] dark:text-white rounded-xl px-5 py-4 pr-14 outline-none"
                required
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(
                    !showPassword
                  )
                }
                className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500 flex items-center justify-center"
              >

                {showPassword
                  ? <Eye size={20} />
                  : <EyeOff size={20} />}

              </button>

            </div>

          </div>

          {/* CONFIRM PASSWORD */}
          <div>

            <label className="block mb-3 font-semibold">
              Confirm Password
            </label>

            <div className="relative">

              <input
                type={
                  showConfirmPassword
                    ? "text"
                    : "password"
                }
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(
                    e.target.value
                  )
                }
                className="w-full bg-[#f3f0ea] dark:bg-[#1e293b] dark:text-white rounded-xl px-5 py-4 pr-14 outline-none"
                required
              />

              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword(
                    !showConfirmPassword
                  )
                }
                className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500 flex items-center justify-center"
              >

                {showConfirmPassword
                  ? <Eye size={20} />
                  : <EyeOff size={20} />}

              </button>

            </div>

          </div>

          {/* CHECKBOX */}
          <div className="flex items-center gap-3">

            <input type="checkbox" />

            <p className="text-sm text-gray-600 dark:text-gray-400">
              Save account
            </p>

          </div>

          {/* BUTTON */}
          <button
            type="submit"
            className="w-full bg-[#ff4b2b] hover:bg-[#ff3b1f] text-white py-4 rounded-xl font-bold text-lg transition"
          >
            Register
          </button>

        </form>

        {/* DIVIDER */}
        <div className="flex items-center gap-4 my-10">

          <div className="flex-1 h-[1px] bg-gray-300 dark:bg-gray-700"></div>

          <p className="text-gray-400 text-sm whitespace-nowrap">
            Or Sign In with email
          </p>

          <div className="flex-1 h-[1px] bg-gray-300 dark:bg-gray-700"></div>

        </div>

        {/* GOOGLE BUTTON */}
        <button className="w-full border border-gray-300 dark:border-gray-700 rounded-full py-4 flex items-center justify-center gap-4 hover:bg-white dark:hover:bg-[#111827] transition">

          <img
            src="https://cdn-icons-png.flaticon.com/512/300/300221.png"
            alt="google"
            className="w-6 h-6"
          />

          <span className="font-semibold">
            Continue with Google
          </span>

        </button>

      </div>

    </div>

  )

}

export default RegisterPage