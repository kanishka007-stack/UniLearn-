import { useState } from "react"

const CurriculumViewer = ({
  courses,
  selectedSlug,
  setSelectedSlug,
  fetchCurriculum,
  modules,
  topics,
  notes,
  quizzes,
  setVideoFiles,
  handleEditModule,
  handleDeleteModule,
  handleEditTopic,
  handleDeleteTopic,
  handleSaveTopicVideo,
  handleRemoveTopicVideo,
  handleEditNote,
  handleDeleteNote,
  handleEditQuiz,
  handleDeleteQuiz,
}) => {
  const [editingModuleId, setEditingModuleId] = useState(null)
  const [moduleForm, setModuleForm] = useState({
    title: "",
    lessons: "",
  })
  const [editingTopicId, setEditingTopicId] = useState(null)
  const [topicForm, setTopicForm] = useState({
    topic: "",
    video_url: "",
  })
  const [editingNoteId, setEditingNoteId] = useState(null)
  const [noteForm, setNoteForm] = useState({
    title: "",
    note_file: null,
  })
  const [editingQuizId, setEditingQuizId] = useState(null)
  const [quizForm, setQuizForm] = useState({
    question: "",
    option_a: "",
    option_b: "",
    option_c: "",
    option_d: "",
    correct_answer: "",
  })

  const startModuleEdit = (module) => {
    setEditingModuleId(module.id)
    setModuleForm({
      title: module.title || "",
      lessons: module.lessons || "",
    })
  }

  const startTopicEdit = (topic) => {
    setEditingTopicId(topic.id)
    setTopicForm({
      topic: topic.topic || "",
      video_url: topic.video_url || "",
    })
  }

  const startNoteEdit = (note) => {
    setEditingNoteId(note.id)
    setNoteForm({
      title: note.title || "",
      note_file: null,
    })
  }

  const startQuizEdit = (quiz) => {
    setEditingQuizId(quiz.id)
    setQuizForm({
      question: quiz.question || "",
      option_a: quiz.option_a || "",
      option_b: quiz.option_b || "",
      option_c: quiz.option_c || "",
      option_d: quiz.option_d || "",
      correct_answer: quiz.correct_answer || "",
    })
  }

  return (

  <div className="mt-14 text-white">

    {/* TITLE */}
    <div className="mb-8">

      <h2 className="text-5xl font-black mb-3">
        Manage Curriculum
      </h2>

      <p className="text-gray-400 text-lg">
        Manage modules, topics, notes and quizzes
      </p>

    </div>

    {/* COURSE SELECT */}
    <select

      value={selectedSlug}

      onChange={(e) => {

        setSelectedSlug(
          e.target.value
        )

        fetchCurriculum(
          e.target.value
        )

      }}

      className="w-full p-5 rounded-2xl border border-gray-700 bg-[#111827] text-white mb-10 outline-none"
    >

      <option value="">
        Select Course
      </option>

      {
        courses.map((course) => (

          <option
            key={course.id}
            value={course.slug}
          >

            {course.title}

          </option>

        ))
      }

    </select>

    {/* MODULES */}
    <div className="space-y-8">

      {
        modules
          .filter(
            (module) =>
              module.course_slug === selectedSlug
          )
          .map((module) => (

            <div
              key={module.id}
              className="bg-[#111827] border border-gray-800 rounded-[30px] p-8 shadow-xl"
            >

              {/* MODULE HEADER */}
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-8">

                {editingModuleId === module.id ? (

                  <div className="grid md:grid-cols-2 gap-4 flex-1">

                    <input
                      type="text"
                      value={moduleForm.title}
                      onChange={(e) =>
                        setModuleForm({
                          ...moduleForm,
                          title: e.target.value,
                        })
                      }
                      className="p-4 rounded-2xl border border-gray-700 bg-[#1e293b] text-white"
                    />

                    <input
                      type="text"
                      value={moduleForm.lessons}
                      onChange={(e) =>
                        setModuleForm({
                          ...moduleForm,
                          lessons: e.target.value,
                        })
                      }
                      className="p-4 rounded-2xl border border-gray-700 bg-[#1e293b] text-white"
                    />

                  </div>

                ) : (

                  <div>

                  <h3 className="text-3xl font-black mb-2">
                    {module.title}
                  </h3>

                  <p className="text-gray-400 text-lg">
                    {module.lessons}
                  </p>

                </div>

                )}

                <div className="flex gap-3">

                {editingModuleId === module.id ? (

                  <>

                    <button
                      onClick={async () => {
                        await handleEditModule(module.id, moduleForm)
                        setEditingModuleId(null)
                      }}
                      className="bg-green-500 hover:bg-green-600 transition duration-300 text-white px-6 py-4 rounded-2xl font-bold shadow-lg"
                    >
                      Save
                    </button>

                    <button
                      onClick={() => setEditingModuleId(null)}
                      className="bg-gray-700 hover:bg-gray-600 transition duration-300 text-white px-6 py-4 rounded-2xl font-bold shadow-lg"
                    >
                      Cancel
                    </button>

                  </>

                ) : (

                  <button
                    onClick={() => startModuleEdit(module)}
                    className="bg-blue-500 hover:bg-blue-600 transition duration-300 text-white px-6 py-4 rounded-2xl font-bold shadow-lg"
                  >
                    Edit Module
                  </button>

                )}

                <button

                  onClick={() =>
                    handleDeleteModule(
                      module.id
                    )
                  }

                  className="bg-gradient-to-r from-red-500 to-pink-500 hover:scale-105 transition duration-300 text-white px-6 py-4 rounded-2xl font-bold shadow-lg"
                >

                  Delete Module

                </button>

                </div>

              </div>

              {/* TOPICS */}
              <div className="space-y-5">

                {
                  topics
                    .filter(
                      (topic) =>
                        Number(topic.module_id) ===
                        Number(module.id)
                    )
                    .map((topic) => (

                      <div

                        key={topic.id}

                        className="bg-[#1e293b] border border-gray-700 rounded-3xl p-6"
                      >

                        <div className="flex flex-col xl:flex-row xl:justify-between xl:items-center gap-5">

                          {editingTopicId === topic.id ? (

                            <div className="grid md:grid-cols-2 gap-4 flex-1">

                              <input
                                type="text"
                                value={topicForm.topic}
                                onChange={(e) =>
                                  setTopicForm({
                                    ...topicForm,
                                    topic: e.target.value,
                                  })
                                }
                                className="p-4 rounded-2xl border border-gray-700 bg-[#0f172a] text-white"
                              />

                              <input
                                type="text"
                                value={topicForm.video_url}
                                onChange={(e) =>
                                  setTopicForm({
                                    ...topicForm,
                                    video_url: e.target.value,
                                  })
                                }
                                className="p-4 rounded-2xl border border-gray-700 bg-[#0f172a] text-white"
                              />

                            </div>

                          ) : (

                            <div>

                            <h4 className="text-2xl font-bold mb-2">
                              {topic.topic}
                            </h4>

                            <p className="text-gray-400 break-all">

                              {
                                topic.video_url ||
                                "No video URL added"
                              }

                            </p>

                          </div>

                          )}

                          <div className="flex gap-3">

                            {editingTopicId === topic.id ? (

                              <>

                                <button
                                  onClick={async () => {
                                    await handleEditTopic(
                                      topic.id,
                                      topicForm
                                    )
                                    setEditingTopicId(null)
                                  }}
                                  className="bg-green-500 hover:bg-green-600 text-white px-5 py-3 rounded-2xl font-semibold"
                                >
                                  Save
                                </button>

                                <button
                                  onClick={() => setEditingTopicId(null)}
                                  className="bg-gray-700 hover:bg-gray-600 text-white px-5 py-3 rounded-2xl font-semibold"
                                >
                                  Cancel
                                </button>

                              </>

                            ) : (

                              <button

                              onClick={() =>
                                startTopicEdit(topic)
                              }

                              className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-3 rounded-2xl font-semibold"
                            >

                              Edit

                            </button>

                            )}

                            <button

                              onClick={() =>
                                handleDeleteTopic(
                                  topic.id
                                )
                              }

                              className="bg-black hover:bg-gray-900 text-white px-5 py-3 rounded-2xl font-semibold"
                            >

                              Delete

                            </button>

                          </div>

                        </div>

                        {/* VIDEO */}
                        <div className="grid md:grid-cols-[1fr_auto_auto] gap-4 mt-6">

                          <input
                            type="file"
                            accept="video/mp4,video/webm,video/mov,video/quicktime"
                            className="p-4 rounded-2xl border border-gray-700 bg-[#0f172a] text-gray-300"
                            onChange={(e) =>
                              setVideoFiles((prev) => ({
                                ...prev,
                                [topic.id]:
                                  e.target.files?.[0] ||
                                  null,
                              }))
                            }
                          />

                          <button
                            onClick={() =>
                              handleSaveTopicVideo(
                                topic.id
                              )
                            }
                            className="bg-green-500 hover:bg-green-600 text-white px-5 py-3 rounded-2xl font-semibold"
                          >

                            Save Video

                          </button>

                          <button
                            onClick={() =>
                              handleRemoveTopicVideo(
                                topic.id
                              )
                            }
                            className="bg-red-500 hover:bg-red-600 text-white px-5 py-3 rounded-2xl font-semibold"
                          >

                            Remove Video

                          </button>

                        </div>

                      </div>

                    ))
                }

              </div>

            </div>

          ))
      }

    </div>

    {/* NOTES */}
    <div className="mt-16">

      <h2 className="text-4xl font-black mb-8">
        Manage Notes
      </h2>

      <div className="space-y-5">

        {
          notes.map((note) => (

            <div
              key={note.id}
              className="bg-[#111827] border border-gray-800 p-6 rounded-3xl flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5"
            >

              {editingNoteId === note.id ? (

                <div className="grid md:grid-cols-2 gap-4 flex-1">

                  <input
                    type="text"
                    value={noteForm.title}
                    onChange={(e) =>
                      setNoteForm({
                        ...noteForm,
                        title: e.target.value,
                      })
                    }
                    className="p-4 rounded-2xl border border-gray-700 bg-[#1e293b] text-white"
                  />

                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) =>
                      setNoteForm({
                        ...noteForm,
                        note_file: e.target.files?.[0] || null,
                      })
                    }
                    className="p-4 rounded-2xl border border-gray-700 bg-[#1e293b] text-gray-300"
                  />

                </div>

              ) : (

                <div>

                <h3 className="font-black text-2xl mb-2">
                  {note.title}
                </h3>

                <p className="text-gray-400">
                  {note.course_slug}
                </p>

              </div>

              )}

              <div className="flex gap-3">

                {editingNoteId === note.id ? (

                  <>

                    <button
                      onClick={async () => {
                        await handleEditNote(note.id, noteForm)
                        setEditingNoteId(null)
                      }}
                      className="bg-green-500 hover:bg-green-600 text-white px-5 py-3 rounded-2xl font-semibold"
                    >
                      Save
                    </button>

                    <button
                      onClick={() => setEditingNoteId(null)}
                      className="bg-gray-700 hover:bg-gray-600 text-white px-5 py-3 rounded-2xl font-semibold"
                    >
                      Cancel
                    </button>

                  </>

                ) : (

                  <button

                  onClick={() => startNoteEdit(note)}

                  className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-3 rounded-2xl font-semibold"
                >

                  Edit

                </button>

                )}

                <button

                  onClick={() =>
                    handleDeleteNote(note.id)
                  }

                  className="bg-red-500 hover:bg-red-600 text-white px-5 py-3 rounded-2xl font-semibold"
                >

                  Delete

                </button>

              </div>

            </div>

          ))
        }

      </div>

    </div>

    {/* QUIZZES */}
    <div className="mt-16">

      <h2 className="text-4xl font-black mb-8">
        Manage Quizzes
      </h2>

      <div className="space-y-5">

        {
          quizzes.map((quiz) => (

            <div
              key={quiz.id}
              className="bg-[#111827] border border-gray-800 p-6 rounded-3xl flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5"
            >

              {editingQuizId === quiz.id ? (

                <div className="grid md:grid-cols-2 gap-4 flex-1">

                  <input
                    type="text"
                    value={quizForm.question}
                    onChange={(e) =>
                      setQuizForm({
                        ...quizForm,
                        question: e.target.value,
                      })
                    }
                    className="p-4 rounded-2xl border border-gray-700 bg-[#1e293b] text-white md:col-span-2"
                  />

                  {["option_a", "option_b", "option_c", "option_d"].map((field) => (
                    <input
                      key={field}
                      type="text"
                      value={quizForm[field]}
                      onChange={(e) =>
                        setQuizForm({
                          ...quizForm,
                          [field]: e.target.value,
                        })
                      }
                      className="p-4 rounded-2xl border border-gray-700 bg-[#1e293b] text-white"
                    />
                  ))}

                  <input
                    type="text"
                    value={quizForm.correct_answer}
                    onChange={(e) =>
                      setQuizForm({
                        ...quizForm,
                        correct_answer: e.target.value,
                      })
                    }
                    className="p-4 rounded-2xl border border-gray-700 bg-[#1e293b] text-white md:col-span-2"
                  />

                </div>

              ) : (

                <div>

                <h3 className="font-black text-2xl mb-2">
                  {quiz.question}
                </h3>

                <p className="text-green-400">
                  Correct Answer:
                  {" "}
                  {quiz.correct_answer}
                </p>

              </div>

              )}

              <div className="flex gap-3">

                {editingQuizId === quiz.id ? (

                  <>

                    <button
                      onClick={async () => {
                        await handleEditQuiz(quiz.id, quizForm)
                        setEditingQuizId(null)
                      }}
                      className="bg-green-500 hover:bg-green-600 text-white px-5 py-3 rounded-2xl font-semibold"
                    >
                      Save
                    </button>

                    <button
                      onClick={() => setEditingQuizId(null)}
                      className="bg-gray-700 hover:bg-gray-600 text-white px-5 py-3 rounded-2xl font-semibold"
                    >
                      Cancel
                    </button>

                  </>

                ) : (

                  <button

                  onClick={() =>
                    startQuizEdit(quiz)
                  }

                  className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-3 rounded-2xl font-semibold"
                >

                  Edit

                </button>

                )}

                <button

                  onClick={() =>
                    handleDeleteQuiz(quiz.id)
                  }

                  className="bg-red-500 hover:bg-red-600 text-white px-5 py-3 rounded-2xl font-semibold"
                >

                  Delete

                </button>

              </div>

            </div>

          ))
        }

      </div>

    </div>

  </div>

)
}

export default CurriculumViewer
