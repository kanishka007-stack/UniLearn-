import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import axios from "axios"
import { normalizeDatabaseCourse, resolveCourse } from "../data/courses"

const readJson = (key, fallback) => {
  try {
    return JSON.parse(localStorage.getItem(key) || "null") || fallback
  } catch {
    return fallback
  }
}

const CertificatePage = () => {

  const { courseId } = useParams()

  const [course, setCourse] = useState(() => resolveCourse(courseId))

  useEffect(() => {
    if (course || !courseId) {
      return
    }

    let isMounted = true

    const fetchCourse = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/courses/${courseId}`
        )

        if (isMounted && response.data?.success) {
          setCourse(normalizeDatabaseCourse(response.data.course))
        }
      } catch (error) {
        console.log(error)
      }
    }

    fetchCourse()

    return () => {
      isMounted = false
    }
  }, [course, courseId])

  const [certificateData, setCertificateData] =
    useState(() =>
      readJson(
        `certificateData-${courseId}`,
        null
      )
    )

  const [studentName, setStudentName] =
    useState(
      certificateData?.student_name ||
      localStorage.getItem("studentName") ||
      "Student"
    )

  const [inputName, setInputName] =
    useState("")

  const [generated, setGenerated] =
    useState(Boolean(certificateData))

  const today = new Date().toLocaleDateString()

  const certificateId =
    certificateData?.certificate_id ||
    `UL-${course?.id || courseId}2026`

  const completionDate =
    certificateData?.completion_date ||
    today

  const handleGenerate = async () => {

    if (!inputName) {

      alert("Please enter your name")
      return

    }

    const user =
      readJson("user", {})

    const nextStudentName =
      inputName.trim()

    const nextCompletionDate =
      new Date().toLocaleDateString()

    setStudentName(nextStudentName)

    localStorage.setItem(
      "studentName",
      nextStudentName
    )

    try {

      const response = await axios.post(
        "http://localhost:5000/api/certificates/generate",
        {
          user_email:
            user?.email ||
            user?.user?.email ||
            "",
          course_slug:
            course?.slug || String(course?.id || courseId),
          student_name: nextStudentName,
          completion_date: nextCompletionDate,
        }
      )

      if (response.data?.success) {

        setCertificateData(response.data.certificate)

        localStorage.setItem(
          `certificateData-${courseId}`,
          JSON.stringify(response.data.certificate)
        )

      }

    } catch (error) {

      console.log(error)

    }

    setGenerated(true)

  }

  const handleDownload = () => {

    window.print()

  }

  return (

    <div className="certificate-page min-h-screen bg-[#eef2f7] dark:bg-[#0f172a] dark:text-gray-100 flex flex-col items-center justify-center gap-6 p-6 print:p-0">

      <style>
        {`
          @media print {

            @page {
              size: A4 landscape;
              margin: 7mm;
            }

            * {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              box-sizing: border-box !important;
            }

            html,
            body,
            #root {
              width: 100% !important;
              min-height: 0 !important;
              margin: 0 !important;
              padding: 0 !important;
              overflow: visible !important;
            }

            body {
              background: white !important;
            }

            nav,
            footer,
            button,
            .hide-print {
              display: none !important;
            }

            .certificate-page {
              display: block !important;
              min-height: 0 !important;
              height: auto !important;
              padding: 0 !important;
              margin: 0 !important;
              background: white !important;
            }

            .certificate-container {
              width: 282mm !important;
              height: 190mm !important;
              min-height: 190mm !important;
              max-width: none !important;
              box-shadow: none !important;
              margin: 0 auto !important;
              page-break-after: avoid;
              page-break-inside: avoid;
              border-radius: 0 !important;
              border-width: 6px !important;
              overflow: hidden !important;
            }

            .certificate-inner {
              min-height: 100% !important;
            }

          }
        `}
      </style>

      {
        !generated && (

          <div className="hide-print bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-700 rounded-3xl shadow-xl p-8 max-w-3xl w-full text-center">

            <h2 className="text-3xl font-black mb-6">
              Enter Student Name
            </h2>

            <div className="flex justify-center gap-4 flex-wrap">

              <input
                type="text"
                placeholder="Enter your name"
                value={inputName}
                onChange={(e) =>
                  setInputName(e.target.value)
                }
                className="border border-gray-300 dark:border-gray-700 dark:bg-[#1f2937] dark:text-gray-100 px-6 py-4 rounded-2xl w-[320px] text-xl outline-none"
              />

              <button
                onClick={handleGenerate}
                className="bg-gradient-to-r from-amber-400 to-yellow-600 hover:scale-105 transition text-[#0b1530] px-8 py-4 rounded-2xl font-black text-xl shadow-xl"
              >
                Generate
              </button>

            </div>

          </div>

        )
      }

      <div className="certificate-container relative bg-[#fbf7ef] max-w-5xl w-full min-h-[620px] rounded-[30px] shadow-2xl overflow-hidden border-[8px] border-[#d6a84f]">

        {/* BACKGROUND */}
        <div className="absolute inset-4 border border-[#d6a84f]/70 rounded-[24px]"></div>
        <div className="absolute inset-7 border border-[#0b1530]/20 rounded-[18px]"></div>

        <div className="absolute inset-0 opacity-[0.05] text-[#0b1530] text-[140px] font-black tracking-tight flex items-center justify-center rotate-[-12deg]">
          UNILEARN
        </div>

        <div className="absolute -right-32 top-0 h-full w-[350px] bg-[#0b1530] rounded-l-[230px]"></div>
        <div className="absolute -right-16 top-10 h-[540px] w-[255px] bg-gradient-to-b from-[#f8d978] via-[#d6a84f] to-[#9b6b1f] rounded-l-[210px] opacity-95"></div>
        <div className="absolute -right-2 top-24 h-[430px] w-[180px] bg-[#111f42] rounded-l-[170px]"></div>

        <div className="absolute left-8 top-8 h-16 w-16 border-t-4 border-l-4 border-[#d6a84f]"></div>
        <div className="absolute left-8 bottom-8 h-16 w-16 border-b-4 border-l-4 border-[#d6a84f]"></div>
        <div className="absolute right-8 top-8 h-16 w-16 border-t-4 border-r-4 border-[#f8d978]"></div>
        <div className="absolute right-8 bottom-8 h-16 w-16 border-b-4 border-r-4 border-[#f8d978]"></div>

        {/* CONTENT */}
        <div className="certificate-inner relative z-10 min-h-[620px] grid grid-cols-[1fr_230px]">

          <div className="px-8 md:px-12 py-9 flex flex-col justify-between">

            <div>

              <div className="flex items-center gap-3 mb-7">

                <div className="h-12 w-12 rounded-full bg-[#0b1530] text-[#f8d978] flex items-center justify-center font-black text-lg shadow-xl">
                  UL
                </div>

                <div>

                  <h2 className="text-2xl font-black text-[#0b1530]">
                    UniLearn
                  </h2>

                  <p className="text-[#9b6b1f] font-semibold tracking-[0.35em] uppercase text-xs">
                    Academy
                  </p>

                </div>

              </div>

              <p className="text-[#9b6b1f] font-bold tracking-[0.45em] uppercase mb-2 text-xs">
                Premium Recognition
              </p>

              <h1 className="text-6xl font-black text-[#0b1530] leading-none">
                Certificate
              </h1>

              <h2 className="text-2xl font-light text-[#0b1530] tracking-[0.42em] uppercase mt-2">
                Of Achievement
              </h2>

              <div className="flex items-center gap-4 my-7">
                <div className="h-[2px] w-20 bg-[#d6a84f]"></div>
                <div className="h-3 w-3 rounded-full bg-[#d6a84f]"></div>
                <div className="h-[2px] w-36 bg-[#d6a84f]"></div>
              </div>

              <p className="text-sm text-[#334155] mb-3">
                This certificate is proudly presented to
              </p>

              <h3 className="font-serif italic text-5xl text-[#9b1c31] mb-5 border-b-2 border-[#d6a84f] inline-block px-5 pb-2 min-w-[220px]">
                {studentName}
              </h3>

              <p className="text-sm text-[#334155] leading-7 max-w-2xl">
                for successfully completing the course
              </p>

              <h4 className="text-3xl font-black text-[#0b1530] mt-3 max-w-2xl leading-tight">
                {course?.title || "Course"}
              </h4>

            </div>

            <div className="grid grid-cols-[180px_180px_1fr] gap-8 mt-8 items-end">

              <div>
                <div className="h-[2px] bg-[#0b1530] mb-3"></div>
                <p className="text-[#0b1530] font-black text-sm">
                  Lead Instructor
                </p>
                <p className="text-xs text-[#64748b]">
                  UniLearn Faculty
                </p>
              </div>

              <div>
                <div className="h-[2px] bg-[#0b1530] mb-3"></div>
                <p className="text-[#0b1530] font-black text-sm">
                  Program Director
                </p>
                <p className="text-xs text-[#64748b]">
                  Academic Board
                </p>
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.25em] text-[#9b6b1f] font-bold">
                    Completion Date
                  </p>
                  <p className="text-[#0b1530] font-black text-sm">
                    {completionDate}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.25em] text-[#9b6b1f] font-bold">
                    Certificate ID
                  </p>
                  <p className="text-[#0b1530] font-black break-all text-sm">
                    {certificateId}
                  </p>
                </div>
              </div>

            </div>

          </div>

          <div className="relative flex items-center justify-center pr-10">

            <div className="relative z-20 h-36 w-36 rounded-full bg-gradient-to-br from-[#fff1a8] via-[#d6a84f] to-[#8a5b15] shadow-2xl flex items-center justify-center">
              <div className="absolute inset-3 rounded-full border-2 border-[#0b1530]/30"></div>
              <div className="h-24 w-24 rounded-full bg-[#0b1530] text-[#f8d978] flex flex-col items-center justify-center border-4 border-[#f8d978]">
                <span className="text-3xl font-black leading-none">UL</span>
                <span className="text-xs tracking-[0.25em] uppercase">
                  Verified
                </span>
              </div>
            </div>

          </div>

        </div>

      </div>

      {
        generated && (

          <button
            onClick={handleDownload}
            className="hide-print bg-gradient-to-r from-[#0b1530] via-[#172554] to-[#0b1530] hover:scale-105 transition text-[#f8d978] px-10 py-4 rounded-2xl font-black text-xl shadow-2xl border border-[#d6a84f]"
          >
            Download Certificate
          </button>

        )
      }

    </div>

  )

}

export default CertificatePage
