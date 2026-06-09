import { useState } from "react";

import { useParams, useNavigate } from "react-router-dom";

import axios from "axios";

export default function ResetPassword() {

  const { token } = useParams();

  const navigate = useNavigate();

  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      setLoading(true);

      const response = await axios.post(

        "http://localhost:5000/api/auth/reset-password",

        {

          token,

          password,

        }

      );

      setMessage(response.data.message);

      setTimeout(() => {

        navigate("/signin");

      }, 2000);

    } catch (error) {

      setMessage(

        error.response?.data?.message ||

        "Something went wrong"

      );

    } finally {

      setLoading(false);

    }

  };

  return (

    <div className="min-h-screen bg-[#f5f2ee] dark:bg-[#0f172a] dark:text-gray-100 flex items-center justify-center px-6">

      <div className="bg-white dark:bg-[#111827] dark:border dark:border-gray-700 p-10 rounded-3xl shadow-2xl w-full max-w-lg">

        <h1 className="text-4xl font-black mb-8 text-center">

          Reset Password

        </h1>

        <form

          onSubmit={handleSubmit}

          className="space-y-6"

        >

          <input

            type="password"

            placeholder="Enter new password"

            value={password}

            onChange={(e) =>

              setPassword(e.target.value)

            }

            required

            className="w-full border border-gray-300 dark:border-gray-700 dark:bg-[#1f2937] dark:text-gray-100 rounded-2xl px-5 py-4 outline-none"

          />

          <button

            type="submit"

            disabled={loading}

            className="w-full bg-green-500 hover:bg-green-600 text-white py-4 rounded-2xl font-bold text-lg"

          >

            {loading

              ? "Please wait..."

              : "Reset Password"}

          </button>

        </form>

        {message && (

          <p className="mt-6 text-center font-semibold">

            {message}

          </p>

        )}

      </div>

    </div>

  );

}