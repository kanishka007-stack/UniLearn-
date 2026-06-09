import React, { useState } from "react"
import { Link } from "react-router-dom"
import {
  Eye,
  EyeOff
} from "lucide-react";
import axios from "axios"

const SignIn = () => {

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const handleLogin = async (e) => {

    e.preventDefault()

    try {

      const response = await axios.post(

        "http://localhost:5000/api/auth/login",

        {
          email,
          password,
        },

        {
          headers: {
            "Content-Type": "application/json",
          },
        }

      )

      console.log(response.data)

      if (response.data.success) {

        // SAVE USER
        localStorage.setItem(
          "user",
          JSON.stringify(response.data.user)
        )

        // LOGIN STATUS
        localStorage.setItem("isLoggedIn", "true")

        // SAVE JWT TOKEN
        localStorage.setItem(
          "token",
          response.data.token
        )

        alert(response.data.message)

        // REDIRECT
        window.location.href = "/courses"

      } else {

        alert(response.data.message)

      }

    } catch (error) {

      console.log(error)

      alert("Invalid Email or Password")

    }

  }

  return (

    <div className="min-h-screen bg-white dark:bg-[#0f172a] dark:text-gray-100 flex">

      {/* LEFT SIDE */}
      <div
        className="hidden lg:flex w-1/2 bg-cover bg-center relative"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop')",
        }}
      >

        <div className="absolute inset-0 bg-black/40"></div>

        <div className="relative z-10 p-10 text-white w-full">


        </div>

      </div>

      {/* RIGHT SIDE */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-8">

        <div className="w-full max-w-md">

          <h1 className="text-5xl font-bold mb-4">
            Sign in
          </h1>

          <p className="text-gray-500 mb-10">

            Don’t have an account?

            <Link
              to="/register"
              className="text-red-500 ml-2 font-medium"
            >
              Create Now
            </Link>

          </p>

          {/* FORM */}
          <form
            onSubmit={handleLogin}
            className="space-y-7"
          >

            {/* EMAIL */}
            <div>

              <label className="block mb-3 font-medium">
                Email
              </label>

              <input
                type="email"
                placeholder="Type your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#f3f0ea] dark:bg-[#1f2937] dark:text-gray-100 rounded-xl px-5 py-4 outline-none"
                required
              />

            </div>

            {/* PASSWORD */}
            <div>

              <label className="block mb-3 font-medium">
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
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#f3f0ea] dark:bg-[#1f2937] dark:text-gray-100 rounded-xl px-5 py-4 outline-none"
                  required
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500"
                >

                  {showPassword
                    ? <Eye size={20} />
                    : <EyeOff size={20} />}

                </button>

              </div>

            </div>

            {/* CHECKBOX */}
            <div className="flex items-center justify-between">

              <div className="flex items-center gap-2">

                <input type="checkbox" />

                <p className="text-gray-500 text-sm">
                  Save account
                </p>

              </div>

              <Link
                to="/forgot-password"
                className="text-red-500 text-sm hover:underline"
              >
                Forgot Password?
              </Link>

            </div>

            {/* BUTTON */}
            <button
              type="submit"
              className="w-full bg-red-700 hover:bg-red-800 text-white py-4 rounded-xl font-bold transition"
            >
              Sign In
            </button>

          </form>

          {/* DIVIDER */}
          <div className="flex items-center gap-4 my-8">

            <div className="flex-1 h-[1px] bg-gray-300"></div>

            <p className="text-gray-400 text-sm">
              Or Sign In with email
            </p>

            <div className="flex-1 h-[1px] bg-gray-300"></div>

          </div>

          {/* GOOGLE BUTTON */}
          <button className="w-full border border-gray-300 dark:border-gray-700 rounded-full py-4 flex items-center justify-center gap-3 hover:bg-white dark:hover:bg-gray-800 transition">

            <img
              src="https://cdn-icons-png.flaticon.com/512/300/300221.png"
              alt="google"
              className="w-6 h-6"
            />

            <span className="font-medium">
              Continue with Google
            </span>

          </button>

        </div>

      </div>

    </div>

  )

}

export default SignIn
