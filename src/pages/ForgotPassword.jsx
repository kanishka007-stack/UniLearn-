import { useState } from "react";
import axios from "axios";

export default function ForgotPassword() {

  const [email, setEmail] = useState("");

  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(false);
  const [resetLink, setResetLink] = useState("");
  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      setLoading(true);

      const response = await axios.post(

        "http://localhost:5000/api/auth/forgot-password",

        {
          email,
        }

      );
setMessage(response.data.message);

setResetLink(
  response.data.resetLink
);

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

          Forgot Password

        </h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            required
            className="w-full border border-gray-300 dark:border-gray-700 dark:bg-[#1f2937] dark:text-gray-100 rounded-2xl px-5 py-4 outline-none"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-500 hover:bg-red-600 text-white py-4 rounded-2xl font-bold text-lg"
          >

            {loading
              ? "Please wait..."
              : "Send Reset Link"}

          </button>

        </form>

{message && (

  <div className="mt-6 text-center">

    <p className="font-semibold mb-4">
      {message}
    </p>

    {resetLink && (

      <button
        onClick={() =>
          window.location.href =
            resetLink
        }
        className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl font-semibold"
      >
        Go To Reset Password
      </button>

    )}

  </div>

)}
      </div>

    </div>

  );

}
