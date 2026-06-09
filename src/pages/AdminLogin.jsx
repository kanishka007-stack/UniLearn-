import { useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import toast from "react-hot-toast"

const AdminLogin = () => {

  const navigate =
    useNavigate()

  const [formData, setFormData] =
    useState({
      email: "",
      password: "",
    })

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    })

  }

  const handleSubmit = async (
    e
  ) => {

    e.preventDefault()

    try {

      const res =
        await axios.post(
          "http://localhost:5000/api/admin/login",
          formData
        )

      localStorage.setItem(
        "adminToken",
        res.data.token
      )

      localStorage.setItem(
        "adminUser",
        JSON.stringify(
          res.data.admin
        )
      )

      toast.success(
        "Admin Login Successful"
      )

      navigate(
        "/admin-dashboard"
      )

    } catch (error) {

      toast.error(
        error.response?.data
          ?.message ||
          "Login Failed"
      )

    }

  }

  return (

    <div className="min-h-screen bg-[#081028] flex items-center justify-center px-6">

      <div className="w-full max-w-[450px] bg-[#111827] border border-gray-800 rounded-3xl p-10 shadow-2xl">

        <h1 className="text-5xl font-black text-white mb-3">

          Admin Login

        </h1>

        <p className="text-gray-400 mb-8">

          UniLearn Admin Portal

        </p>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          <input
            type="email"
            name="email"
            placeholder="Admin Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full bg-[#1f2937] text-white px-5 py-4 rounded-2xl outline-none border border-gray-700 focus:border-blue-500"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full bg-[#1f2937] text-white px-5 py-4 rounded-2xl outline-none border border-gray-700 focus:border-blue-500"
          />

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:scale-[1.02] transition-all duration-300 text-white py-4 rounded-2xl font-black text-lg shadow-xl"
          >

            Login

          </button>

        </form>

      </div>

    </div>

  )

}

export default AdminLogin