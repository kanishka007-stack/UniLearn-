import { useEffect, useState } from "react"

export default function CourseNotes({
  courseId,
}) {

  const [notes, setNotes] =
    useState("")

  useEffect(() => {

    const savedNotes =
      localStorage.getItem(
        `notes-${courseId}`
      )

    if (savedNotes) {

      setNotes(savedNotes)

    }

  }, [courseId])

  const handleChange = (value) => {

    setNotes(value)

    localStorage.setItem(
      `notes-${courseId}`,
      value
    )

  }

  return (

    <div className="bg-white dark:bg-[#111827] rounded-[32px] p-8 shadow-2xl mt-14 border border-gray-200 dark:border-gray-700">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-8">

        <div>

          <h2 className="text-4xl font-black dark:text-white">

            Personal Notes

          </h2>

          <p className="text-gray-500 dark:text-gray-400 mt-2">

            Your notes auto-save instantly

          </p>

        </div>

        <div className="bg-green-100 text-green-700 px-4 py-2 rounded-full font-semibold text-sm">

          Auto Saved

        </div>

      </div>

      {/* TEXTAREA */}
      <textarea
        rows="12"
        value={notes}
        onChange={(e) =>
          handleChange(e.target.value)
        }
        placeholder="Write your learning notes here..."
        className="w-full bg-gray-100 dark:bg-[#1f2937] dark:text-white rounded-3xl p-6 outline-none resize-none text-lg leading-8"
      ></textarea>

    </div>

  )

}