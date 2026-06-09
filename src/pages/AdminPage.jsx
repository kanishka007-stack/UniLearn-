import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import toast from "react-hot-toast"
import DashboardStats from "../admin/components/DashboardStats"
import CourseManager from "../admin/components/CourseManager"
import CurriculumManager from "../admin/components/CurriculumManager"
import CurriculumViewer from "../admin/components/CurriculumViewer"

const API_BASE = "http://localhost:5000/api"
const API = `${API_BASE}/courses`

const getAdminHeaders = () => ({
  headers: {
    Authorization:
      `Bearer ${localStorage.getItem("adminToken")}`,
  },
})

const getAdminMultipartHeaders = () => ({
  headers: {
    "Content-Type": "multipart/form-data",
    Authorization:
      `Bearer ${localStorage.getItem("adminToken")}`,
  },
})

const logRequest = (label, config, error) => {
  console.log(`[Admin CRUD] ${label}`, config)

  if (error) {
    console.error(`[Admin CRUD] ${label} failed`, {
      status: error?.response?.status,
      data: error?.response?.data,
      message: error?.message,
    })
  }
}
const AdminPage = () => {

  const navigate = useNavigate()

  const [courses, setCourses] = useState([])

  const [showForm, setShowForm] = useState(false)
  const [editingCourseId, setEditingCourseId] = useState(null)
  const [imageFile, setImageFile] = useState(null)
  const [formData, setFormData] = useState({

    title: "",
    slug: "",
    category: "",
    lessons: "",
    duration: "",
    level: "",
    rating: "",
    price: "",
    image: "",
    description: "",
    about: "",
    instructor_name: "",
    instructor_role: "",
    instructor_image: "",
    language: "",
    students: "",
    certificate: "",
  })

  // =========================
  // CURRICULUM STATES
  // =========================
  const [moduleData, setModuleData] =
    useState({

      course_slug: "",

      title: "",

      lessons: "",

    })

  const [topicData, setTopicData] =
    useState({

      module_id: "",

      topic: "",

      video_url: "",

    })
    const [noteData, setNoteData] =
  useState({

    course_slug: "",

    title: "",

    note_file: null,

  })
  const [quizData, setQuizData] =
  useState({

    course_slug: "",

    question: "",

    option_a: "",

    option_b: "",

    option_c: "",

    option_d: "",

    correct_answer: "",

  })
const [, setCurriculum] =
  useState([])

const [modules, setModules] =
  useState([])

const [topics, setTopics] =
  useState([])
const [, setVideoInputs] = useState({})
const [videoFiles, setVideoFiles] = useState({})
const [notes, setNotes] = useState([])

const [quizzes, setQuizzes] = useState([])
const [selectedSlug, setSelectedSlug] = useState("")
const [activeTab, setActiveTab] =
  useState("dashboard")
  // =========================
  // FETCH COURSES
  // =========================
  const fetchCourses = async () => {

    try {

      const response = await axios.get(API)

      setCourses(response.data.courses || [])

    } catch (error) {

      console.log(error)

    }

  }

  useEffect(() => {

    fetchCourses()

  }, [])

  // =========================
  // INPUT CHANGE
  // =========================
  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })

  }

  // =========================
  // ADD COURSE
  // =========================
  const handleSubmit = async (e) => {

    e.preventDefault()

    try {

      const courseFormData = new FormData()

      Object.entries(formData).forEach(([key, value]) => {
        courseFormData.append(key, value ?? "")
      })

      if (imageFile) {
        courseFormData.set("image", imageFile)
      }

      if (editingCourseId) {

  await axios.put(
    `${API}/${editingCourseId}`,
    courseFormData,
    getAdminMultipartHeaders()
  )

  alert("Course Updated Successfully")

} else {

  await axios.post(
    API,
    courseFormData,
    getAdminMultipartHeaders()
  )

  alert("Course Added Successfully")

}

      setFormData({

        title: "",
        slug: "",
        category: "",
        lessons: "",
        duration: "",
        level: "",
        rating: "",
        price: "",
        image: "",
        description: "",
        about: "",
        instructor_name: "",
        instructor_role: "",
        instructor_image: "",
        language: "",
        students: "",
        certificate: "",
      })

      setImageFile(null)
      setShowForm(false)
      setEditingCourseId(null)
      fetchCourses()

    } catch (error) {

  console.log(error)

  console.log(
    error.response?.data
  )

  alert(
    error.response?.data?.message ||
    "Failed to save course"
  )

}

  }

  // =========================
  // DELETE COURSE
  // =========================
  const handleDelete = async (id) => {

    try {

      await axios.delete(`${API}/${id}`, getAdminHeaders())

      alert("Course Deleted Successfully")

      fetchCourses()

    } catch (error) {

      console.log(error)

    }

  }
// =========================
// EDIT COURSE
// =========================
const handleEditCourse = (course) => {

  setEditingCourseId(course.id)

  setFormData({

    title: course.title || "",
    slug: course.slug || "",
    category: course.category || "",
    lessons: course.lessons || "",
    duration: course.duration || "",
    level: course.level || "",
    rating: course.rating || "",
    price: course.price || "",
    image: course.image || "",
    description: course.description || "",
    about: course.about || "",
    instructor_name:
      course.instructor_name || "",
    instructor_role:
      course.instructor_role || "",
    instructor_image:
      course.instructor_image || "",
    language: course.language || "",
    students: course.students || "",
    certificate:
      course.certificate || "",

  })

  setShowForm(true)
  setImageFile(null)

}
  // =========================
  // ADD MODULE
  // =========================
  const handleAddModule = async () => {
    if (
        !moduleData.course_slug ||
        !moduleData.title ||
        !moduleData.lessons
      ) {

        toast.error("Please fill all module fields")

        return

      }
    try {

    logRequest("POST /api/curriculum/module/add", moduleData)

    await axios.post(
      `${API_BASE}/curriculum/module/add`,
      moduleData,
      getAdminHeaders()
    )

      toast.success("Module added")

      setModuleData({

        course_slug: "",

        title: "",

        lessons: "",

      })

      if (selectedSlug === moduleData.course_slug) {
        await fetchCurriculum(selectedSlug)
      }

    } catch (error) {

      logRequest("POST /api/curriculum/module/add", moduleData, error)
      toast.error(error?.response?.data?.message || "Failed to add module")

    }

  }

  // =========================
  // ADD TOPIC
  // =========================
  const handleAddTopic = async () => {
    if (
        !topicData.module_id ||
        !topicData.topic
      ) {

        toast.error("Please fill all topic fields")

        return

      }
    try {

      logRequest("POST /api/curriculum/topic/add", topicData)

      await axios.post(
        `${API_BASE}/curriculum/topic/add`,
        topicData,
        getAdminHeaders()
      )

      toast.success("Topic added")

      setTopicData({

        module_id: "",

        topic: "",

        video_url: "",

      })

      if (selectedSlug) {
        await fetchCurriculum(selectedSlug)
      }

    } catch (error) {

      logRequest("POST /api/curriculum/topic/add", topicData, error)
      toast.error(error?.response?.data?.message || "Failed to add topic")

    }

  }
  // =========================
// ADD NOTE
// =========================
const handleAddNote = async () => {
if (
  !noteData.course_slug ||
  !noteData.title ||
  !noteData.note_file
) {

  toast.error("Please fill all note fields")

  return

}
    try {

      const noteFormData =
        new FormData()

      noteFormData.append(
        "course_slug",
        noteData.course_slug
      )

      noteFormData.append(
        "title",
        noteData.title
      )

      noteFormData.append(
        "note",
        noteData.note_file
      )

      logRequest("POST /api/notes/add", {
        course_slug: noteData.course_slug,
        title: noteData.title,
        note: noteData.note_file?.name,
      })

      await axios.post(

        `${API_BASE}/notes/add`,
        
        noteFormData,

        getAdminMultipartHeaders()

      )

      toast.success("Note added successfully")

      setNoteData({

        course_slug: "",

        title: "",

        note_file: null,

      })

      if (selectedSlug) {
        await fetchCurriculum(selectedSlug)
      }

    } catch (error) {

      logRequest("POST /api/notes/add", noteData, error)
      toast.error(error?.response?.data?.message || "Failed to add note")

    }

}
// =========================
// ADD QUIZ
// =========================
const handleAddQuiz =
  async () => {

    if (
      !quizData.course_slug ||
      !quizData.question ||
      !quizData.option_a ||
      !quizData.option_b ||
      !quizData.option_c ||
      !quizData.option_d ||
      !quizData.correct_answer
    ) {

      toast.error("Please fill all quiz fields")

      return

    }

    try {

      logRequest("POST /api/quizzes/add", quizData)

      await axios.post(

        `${API_BASE}/quizzes/add`,
          quizData,
          getAdminHeaders()

      )

      toast.success("Quiz added successfully")

      setQuizData({

        course_slug: "",

        question: "",

        option_a: "",

        option_b: "",

        option_c: "",

        option_d: "",

        correct_answer: "",

      })

      if (selectedSlug === quizData.course_slug) {
        await fetchCurriculum(selectedSlug)
      }

    } catch (error) {

      logRequest("POST /api/quizzes/add", quizData, error)
      toast.error(error?.response?.data?.message || "Failed to add quiz")

    }

}
// =========================
// FETCH CURRICULUM
// =========================
const fetchCurriculum = async (
  slug
) => {

  if (!slug) {
    setCurriculum([])
    setModules([])
    setTopics([])
    setNotes([])
    setQuizzes([])
    return
  }

  try {
    logRequest("GET curriculum/notes/quizzes", { slug })

    const response =
      await axios.get(

        `${API_BASE}/curriculum/${slug}`

      )

    setCurriculum(
      response.data.curriculum || []
    )

    const nextModules =
      (response.data.curriculum || []).map(
        (module) => ({
          ...module,
          course_slug: slug,
        })
      )

    const nextTopics =
      nextModules.flatMap((module) =>
        (module.topics || []).map((topic) => ({
          ...topic,
          module_id: module.id,
        }))
      )

    setModules(nextModules)
    setTopics(nextTopics)
    setVideoInputs(
      nextTopics.reduce((edits, topic) => ({
        ...edits,
        [topic.id]: topic.video_url || "",
      }), {})
    )
    setVideoFiles({})
// FETCH NOTES
const notesResponse =
  await axios.get(
    `${API_BASE}/notes/${slug}`
  )

setNotes(
  notesResponse.data.notes || []
)

// FETCH QUIZZES
const quizResponse =
  await axios.get(
    `${API_BASE}/quizzes/${slug}`
  )

setQuizzes(
  quizResponse.data.quizzes || []
)
  } catch (error) {

    logRequest("GET curriculum/notes/quizzes", { slug }, error)
    toast.error(error?.response?.data?.message || "Failed to load curriculum")

  }

}

// =========================
// EDIT MODULE
// =========================
const handleEditModule =
  async (id, updates) => {

    if (!updates.title || !updates.lessons) {
      toast.error("Module title and lessons are required")
      return
    }

    try {
      logRequest(`PUT /api/curriculum/module/${id}`, updates)

      const response =
        await axios.put(
          `${API_BASE}/curriculum/module/${id}`,
          {
            title: updates.title,
            lessons: updates.lessons,
          },
          getAdminHeaders()
        )

      if (response.data?.success) {
        toast.success("Module updated successfully")
        await fetchCurriculum(selectedSlug)
      }

    } catch (error) {
      logRequest(`PUT /api/curriculum/module/${id}`, updates, error)
      toast.error(error?.response?.data?.message || "Failed to update module")
    }

  }

// =========================
// DELETE MODULE
// =========================
const handleDeleteModule =
  async (id) => {

    try {

      await axios.delete(

        `${API_BASE}/curriculum/module/${id}`,
        getAdminHeaders()


      )

      toast.success("Module deleted")

      setModules((prevModules) =>
        prevModules.filter(
          (module) => module.id !== id
        )
      )

      setTopics((prevTopics) =>
        prevTopics.filter(
          (topic) => topic.module_id !== id
        )
      )

      await fetchCurriculum(selectedSlug)

    } catch (error) {

      logRequest(`DELETE /api/curriculum/module/${id}`, { id }, error)
      toast.error(error?.response?.data?.message || "Failed to delete module")

    }

  }

// =========================
// DELETE TOPIC
// =========================
const handleDeleteTopic =
  async (id) => {

    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this topic?"
      )

    if (!confirmDelete) return

    try {

      const response =
        await axios.delete(

          `${API_BASE}/curriculum/topic/${id}`,
          getAdminHeaders()

        )

      if (response.data.success) {

        toast.success("Topic deleted successfully")
        await fetchCurriculum(selectedSlug)

      }

    } catch (error) {

      logRequest(`DELETE /api/curriculum/topic/${id}`, { id }, error)
      toast.error(error?.response?.data?.message || "Failed to delete topic")

    }

  }
  // =========================
// DELETE NOTE
// =========================
const handleDeleteNote =
  async (id) => {

    const confirmDelete =
      window.confirm(
        "Delete this note?"
      )

    if (!confirmDelete) return

    try {

      await axios.delete(
        `${API_BASE}/notes/${id}`,
        getAdminHeaders()
      )

      toast.success("Note deleted")
      await fetchCurriculum(selectedSlug)

    } catch (error) {

      logRequest(`DELETE /api/notes/${id}`, { id }, error)
      toast.error(error?.response?.data?.message || "Failed to delete note")

    }

  }
  // =========================
// EDIT NOTE
// =========================
const handleEditNote =
  async (id, updates) => {

    if (!updates.title) {
      toast.error("Note title is required")
      return
    }

    try {
      const noteFormData = new FormData()
      noteFormData.append("title", updates.title)

      if (updates.note_file) {
        noteFormData.append("note", updates.note_file)
      }

      logRequest(`PUT /api/notes/${id}`, {
        title: updates.title,
        note: updates.note_file?.name,
      })

      await axios.put(

        `${API_BASE}/notes/${id}`,

        noteFormData,
        getAdminMultipartHeaders()
      )

      toast.success("Note updated")
      await fetchCurriculum(selectedSlug)

    } catch (error) {

      logRequest(`PUT /api/notes/${id}`, updates, error)
      toast.error(error?.response?.data?.message || "Failed to update note")

    }

  }
  // =========================
// DELETE QUIZ
// =========================
const handleDeleteQuiz =
  async (id) => {

    const confirmDelete =
      window.confirm(
        "Delete this quiz?"
      )

    if (!confirmDelete) return

    try {

      await axios.delete(
        `${API_BASE}/quizzes/${id}`,
        getAdminHeaders()
      )

      toast.success("Quiz deleted")
      await fetchCurriculum(selectedSlug)

    } catch (error) {

      logRequest(`DELETE /api/quizzes/${id}`, { id }, error)
      toast.error(error?.response?.data?.message || "Failed to delete quiz")

    }

  }
  // =========================
// EDIT QUIZ
// =========================
const handleEditQuiz =
  async (id, updates) => {

    if (
      !updates.question ||
      !updates.option_a ||
      !updates.option_b ||
      !updates.option_c ||
      !updates.option_d ||
      !updates.correct_answer
    ) {
      toast.error("Please fill all quiz fields")
      return
    }

    try {
      logRequest(`PUT /api/quizzes/${id}`, updates)

      await axios.put(

        `${API_BASE}/quizzes/${id}`,

        {
          question: updates.question,
          option_a: updates.option_a,
          option_b: updates.option_b,
          option_c: updates.option_c,
          option_d: updates.option_d,
          correct_answer: updates.correct_answer,
        }

      , getAdminHeaders())

      toast.success("Quiz updated")
      await fetchCurriculum(selectedSlug)

    } catch (error) {

      logRequest(`PUT /api/quizzes/${id}`, updates, error)
      toast.error(error?.response?.data?.message || "Failed to update quiz")

    }

}
  // =========================
// EDIT TOPIC
// =========================

const handleEditTopic =
  async (id, updates) => {

    if (!updates.topic || updates.topic.trim() === "") {
      toast.error("Topic name is required")
      return
    }

    try {
      logRequest(`PUT /api/curriculum/topic/${id}`, updates)

      const response =
        await axios.put(

          `${API_BASE}/curriculum/topic/${id}`,

          {
            topic: updates.topic,
            video_url: updates.video_url,
          }

        , getAdminHeaders())

      if (response.data.success) {

        toast.success("Topic updated successfully")
        await fetchCurriculum(selectedSlug)

      }

    } catch (error) {

      logRequest(`PUT /api/curriculum/topic/${id}`, updates, error)
      toast.error(error?.response?.data?.message || "Failed to update topic")

    }

  }
// =========================
// UPDATE TOPIC VIDEO
// =========================
const handleSaveTopicVideo =
  async (id) => {

    if (!id) {
      toast.error("Topic id is missing")
      return
    }

    const selectedVideoFile =
      videoFiles?.[id]

    console.log("Saving topic video")
    console.log("Topic id:", id)
    console.log("Video file:", selectedVideoFile)

    try {

      if (!selectedVideoFile) {
        toast.error("Please select a video file")
        return
      }

      const videoFormData = new FormData()
      videoFormData.append("video", selectedVideoFile)

const response =
  await axios.put(

    `${API_BASE}/curriculum/topics/${id}/video`,

    videoFormData,

    {
      headers: {
        "Content-Type":
          "multipart/form-data",

        Authorization:
          `Bearer ${localStorage.getItem("adminToken")}`,
      },
    }

  )

      console.log("Save video response:", response.data)

      if (response.data?.success !== true) {
        toast.error(
          response.data?.message ||
          "Failed to save video"
        )
        return
      }

      const savedVideoUrl =
        response.data?.video_url || ""

      setTopics((prevTopics) =>
        prevTopics.map((topic) =>

          topic.id === id

            ? {
                ...topic,
                video_url: savedVideoUrl,
              }

            : topic

        )
      )

      setVideoInputs((prev) => ({
        ...prev,
        [id]: savedVideoUrl,
      }))

      setVideoFiles((prev) => ({
        ...prev,
        [id]: null,
      }))

      if (selectedSlug) {
        await fetchCurriculum(selectedSlug)
      }

      toast.success("Video saved successfully")

    } catch (error) {

      console.error(
        "SAVE VIDEO ERROR:",
        error
      )

      console.log(
        error?.response?.data
      )

      logRequest(`PUT /api/curriculum/topics/${id}/video`, { id }, error)

      toast.error(
        error?.response?.data?.message ||
        "Failed to save video"
      )

    }

  }
const handleRemoveTopicVideo =
  async (id) => {

    try {

      await axios.put(
        `${API_BASE}/curriculum/topics/${id}/video`,
        {
          video_url: "",
        }
      , getAdminHeaders())

      setTopics((prevTopics) =>
        prevTopics.map((topic) =>

          topic.id === id

            ? {
                ...topic,
                video_url: "",
              }

            : topic

        )
      )

      setVideoInputs((prev) => ({
        ...prev,
        [id]: "",
      }))

      setVideoFiles((prev) => ({
        ...prev,
        [id]: null,
      }))

      if (selectedSlug) {
        await fetchCurriculum(selectedSlug)
      }

      toast.success("Video removed successfully")

    } catch (error) {

      console.error(error)

      logRequest(`PUT /api/curriculum/topics/${id}/video`, { video_url: "" }, error)

      toast.error(
        error?.response?.data?.message ||
        "Failed to remove video"
      )

    }

  }
 const handleLogout = () => {

  localStorage.removeItem(
    "adminToken"
  )

  localStorage.removeItem(
    "adminUser"
  )

  navigate("/admin-login")

}
  // =========================
  // REDIRECT
  // =========================
  const handleAddCourse = () => {

    setShowForm(!showForm)

  }

return (

  <div className="min-h-screen bg-[#081028] text-white">

    <div className="flex">

      {/* SIDEBAR */}

      <div className="w-[250px] min-h-screen bg-[#0f172a] border-r border-gray-800 px-6 py-8 flex flex-col justify-between shadow-2xl">

        <div>

          {/* LOGO */}

          <div className="mb-10">

            <h1 className="text-5xl font-black leading-tight text-orange-500">

              UniLearn
              <br />
              Admin

            </h1>

          </div>

          {/* MENU */}

          <div className="space-y-4">

            <button
              onClick={() =>
                setActiveTab("dashboard")
              }
              className={`w-full text-left px-5 py-4 rounded-2xl font-bold text-lg transition-all duration-300

                ${
                  activeTab === "dashboard"

                    ? "bg-blue-600 text-white shadow-lg"

                    : "bg-[#1e293b] text-gray-300 hover:bg-[#263449]"
                }
              `}
            >
              Dashboard
            </button>

            <button
              onClick={() =>
                setActiveTab("courses")
              }
              className={`w-full text-left px-5 py-4 rounded-2xl font-bold text-lg transition-all duration-300

                ${
                  activeTab === "courses"

                    ? "bg-blue-600 text-white shadow-lg"

                    : "bg-[#1e293b] text-gray-300 hover:bg-[#263449]"
                }
              `}
            >
              Courses
            </button>

            <button
              onClick={() =>
                setActiveTab("curriculum")
              }
              className={`w-full text-left px-5 py-4 rounded-2xl font-bold text-lg transition-all duration-300

                ${
                  activeTab === "curriculum"

                    ? "bg-blue-600 text-white shadow-lg"

                    : "bg-[#1e293b] text-gray-300 hover:bg-[#263449]"
                }
              `}
            >
              Curriculum
            </button>

            <button
              onClick={() =>
                setActiveTab("viewer")
              }
              className={`w-full text-left px-5 py-4 rounded-2xl font-bold text-lg transition-all duration-300

                ${
                  activeTab === "viewer"

                    ? "bg-blue-600 text-white shadow-lg"

                    : "bg-[#1e293b] text-gray-300 hover:bg-[#263449]"
                }
              `}
            >
              Curriculum Viewer
            </button>

          </div>

        </div>

        {/* LOGOUT */}

        <button
          onClick={handleLogout}
          className="w-full bg-gradient-to-r from-red-500 to-pink-500 py-4 rounded-2xl font-bold text-lg hover:scale-105 transition-all duration-300 shadow-xl"
        >

          Logout

        </button>

      </div>

      {/* MAIN CONTENT */}

      <div className="flex-1 p-8 space-y-8">

        {/* HEADER */}

        <div className="bg-[#0f172a] border border-gray-800 rounded-[35px] p-10 shadow-2xl">

          <h1 className="text-5xl font-black text-white mb-3">

            Admin Dashboard

          </h1>

          <p className="text-gray-400 text-xl">

            Manage courses, students and platform analytics

          </p>

        </div>

        {/* DASHBOARD */}

        {
          activeTab === "dashboard" && (

            <DashboardStats
              courses={courses}
            />

          )
        }

        {/* COURSES */}

        {
          activeTab === "courses" && (

            <CourseManager
              courses={courses}
              showForm={showForm}
              handleAddCourse={handleAddCourse}
              handleSubmit={handleSubmit}
              formData={formData}
              handleChange={handleChange}
              imageFile={imageFile}
              setImageFile={setImageFile}
              editingCourseId={editingCourseId}
              handleEditCourse={handleEditCourse}
              handleDelete={handleDelete}
            />

          )
        }

        {/* CURRICULUM */}

        {
          activeTab === "curriculum" && (

            <div className="bg-[#0f172a] border border-gray-800 rounded-[35px] p-8 shadow-2xl">

              <CurriculumManager
                moduleData={moduleData}
                setModuleData={setModuleData}
                topicData={topicData}
                setTopicData={setTopicData}
                noteData={noteData}
                setNoteData={setNoteData}
                quizData={quizData}
                setQuizData={setQuizData}
                handleAddModule={handleAddModule}
                handleAddTopic={handleAddTopic}
                handleAddNote={handleAddNote}
                handleAddQuiz={handleAddQuiz}
              />

            </div>

          )
        }

        {/* VIEWER */}

        {
          activeTab === "viewer" && (

            <div className="bg-[#0f172a] border border-gray-800 rounded-[35px] p-8 shadow-2xl">

              <CurriculumViewer
                courses={courses}
                selectedSlug={selectedSlug}
                setSelectedSlug={setSelectedSlug}
                fetchCurriculum={fetchCurriculum}
                modules={modules}
                topics={topics}
                notes={notes}
                quizzes={quizzes}
                setVideoFiles={setVideoFiles}
                handleEditModule={handleEditModule}
                handleDeleteModule={handleDeleteModule}
                handleEditTopic={handleEditTopic}
                handleDeleteTopic={handleDeleteTopic}
                handleSaveTopicVideo={handleSaveTopicVideo}
                handleRemoveTopicVideo={handleRemoveTopicVideo}
                handleEditNote={handleEditNote}
                handleDeleteNote={handleDeleteNote}
                handleEditQuiz={handleEditQuiz}
                handleDeleteQuiz={handleDeleteQuiz}
              />

            </div>

          )
        }

      </div>

    </div>

  </div>

)
}

export default AdminPage
