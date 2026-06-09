import { useState } from "react"

export default function ContactPage() {
  const [sent, setSent] = useState(false)

  return (

    <div className="bg-[#f5f2ee] dark:bg-[#0f172a] dark:text-gray-100 min-h-screen">

      {/* Hero Banner */}
      <section className="relative h-[300px] overflow-hidden">

        {/* Background Image */}
        <img
          src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1600&q=80"
          alt="banner"
          className="w-full h-full object-cover"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/20"></div>

        {/* Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white">

          {/* Breadcrumb */}
          <div className="bg-[#6d6d6d]/80 backdrop-blur-md px-7 py-3 rounded-full flex items-center gap-2 shadow-lg mb-6">

            <span className="text-orange-500 text-lg">
              ✦
            </span>

            <span className="text-sm tracking-wide">
              Home {">"} Contact Us
            </span>

          </div>

          {/* Title */}
          <h1 className="text-5xl font-bold">
            Contact Us
          </h1>

        </div>

      </section>

      {/* Main Section */}
      <section className="max-w-7xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-24 items-start">

        {/* Left Content */}
        <div>

          <h2 className="text-4xl font-serif leading-tight mb-10 text-[#1f1f1f] dark:text-gray-100">

            Stuck on a topic?
            We’ve got you.

          </h2>

          <p className="text-gray-700 leading-9 mb-16 text-lg max-w-lg">

            Whether it’s a difficult subject,
            exam preparation, or course access —
            our team is here to help you learn
            better and faster.

          </p>

          {/* Support Points */}
          <div className="space-y-12">

            {/* Academic Help */}
            <div className="flex gap-5">

              <div className="text-2xl">
                📘
              </div>

              <div>

                <h3 className="font-bold text-2xl mb-2">
                  Academic Help
                </h3>

                <p className="text-gray-600 leading-7">
                  Get help with subjects,
                  assignments & concepts
                </p>

              </div>

            </div>

            {/* Student Support */}
            <div className="flex gap-5">

              <div className="text-2xl">
                💌
              </div>

              <div>

                <h3 className="font-bold text-2xl mb-2">
                  Student Support
                </h3>

                <p className="text-gray-600 leading-7">
                  Facing issues with courses
                  or access? Contact us
                </p>

              </div>

            </div>

            {/* Quick Response */}
            <div className="flex gap-5">

              <div className="text-2xl">
                ⚡
              </div>

              <div>

                <h3 className="font-bold text-2xl mb-2">
                  Quick Response
                </h3>

                <p className="text-gray-600 leading-7">
                  We usually respond within
                  24 hours
                </p>

              </div>

            </div>

          </div>

        </div>

        {/* Support Form */}
        <div className="bg-[#f8f8f8] dark:bg-[#111827] border border-gray-500 dark:border-gray-700 rounded-[35px] p-12 shadow-sm">

          <h2 className="text-5xl font-black mb-12 text-black dark:text-gray-100">
            SUPPORT
          </h2>

          {/* Top Inputs */}
          <div className="grid md:grid-cols-2 gap-6 mb-7">

            <input
              type="text"
              placeholder="Your Name"
              className="bg-[#c9c9c9] dark:bg-[#1f2937] dark:text-gray-100 rounded-2xl px-6 py-5 outline-none placeholder:text-gray-600 dark:placeholder:text-gray-400"
            />

            <input
              type="email"
              placeholder="Email Address"
              className="bg-[#c9c9c9] dark:bg-[#1f2937] dark:text-gray-100 rounded-2xl px-6 py-5 outline-none placeholder:text-gray-600 dark:placeholder:text-gray-400"
            />

          </div>

          {/* Subject */}
          <input
            type="text"
            placeholder="Course / Subject"
            className="w-full bg-[#c9c9c9] dark:bg-[#1f2937] dark:text-gray-100 rounded-2xl px-6 py-5 outline-none mb-8 placeholder:text-gray-600 dark:placeholder:text-gray-400"
          />

          {/* Textarea */}
          <textarea
            rows="7"
            placeholder="What do you need help with?"
            className="w-full bg-[#c9c9c9] dark:bg-[#1f2937] dark:text-gray-100 rounded-2xl px-6 py-5 outline-none mb-10 resize-none placeholder:text-gray-600 dark:placeholder:text-gray-400"
          ></textarea>

          {/* Button */}
          <button
            type="button"
            onClick={() => setSent(true)}
            className="bg-red-500 hover:bg-red-600 transition text-white px-10 py-4 rounded-full text-xl font-semibold"
          >

            Get Help

          </button>

          {sent && (
            <p className="mt-5 text-green-700 font-semibold">
              Thanks. Our support team will contact you soon.
            </p>
          )}

        </div>

      </section>

    </div>

  )
}
