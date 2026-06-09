const CurriculumManager = ({
  moduleData,
  setModuleData,
  topicData,
  setTopicData,
  noteData,
  setNoteData,
  quizData,
  setQuizData,
  handleAddModule,
  handleAddTopic,
  handleAddNote,
  handleAddQuiz,
}) => {

  return (

  <div className="bg-[#0f172a] border border-gray-800 rounded-[32px] shadow-2xl p-10 mb-12 text-white">

    <h2 className="text-5xl font-black mb-10">
      Curriculum Manager
    </h2>

    {/* ADD MODULE */}
    <div className="mb-14">

      <h3 className="text-3xl font-bold mb-6">
        Add Module
      </h3>

      <div className="grid md:grid-cols-3 gap-5">

        <input
          type="text"
          placeholder="Course Slug"
          value={moduleData.course_slug}
          className="p-4 rounded-2xl border border-gray-700 bg-[#1e293b] text-white placeholder-gray-400"
          onChange={(e) =>
            setModuleData({
              ...moduleData,
              course_slug: e.target.value,
            })
          }
        />

        <input
          type="text"
          placeholder="Module Title"
          value={moduleData.title}
          className="p-4 rounded-2xl border border-gray-700 bg-[#1e293b] text-white placeholder-gray-400"
          onChange={(e) =>
            setModuleData({
              ...moduleData,
              title: e.target.value,
            })
          }
        />

        <input
          type="text"
          placeholder="Lessons"
          value={moduleData.lessons}
          className="p-4 rounded-2xl border border-gray-700 bg-[#1e293b] text-white placeholder-gray-400"
          onChange={(e) =>
            setModuleData({
              ...moduleData,
              lessons: e.target.value,
            })
          }
        />

      </div>

      <button
        onClick={handleAddModule}
        className="mt-6 bg-gradient-to-r from-red-500 to-pink-500 hover:scale-105 transition duration-300 text-white px-8 py-4 rounded-2xl font-bold shadow-lg"
      >

        Add Module

      </button>

    </div>

    {/* ADD TOPIC */}
    <div>

      <h3 className="text-3xl font-bold mb-6">
        Add Topic
      </h3>

      <div className="grid md:grid-cols-3 gap-5">

        <input
          type="text"
          placeholder="Module ID"
          value={topicData.module_id}
          className="p-4 rounded-2xl border border-gray-700 bg-[#1e293b] text-white placeholder-gray-400"
          onChange={(e) =>
            setTopicData({
              ...topicData,
              module_id: e.target.value,
            })
          }
        />

        <input
          type="text"
          placeholder="Topic Name"
          value={topicData.topic}
          className="p-4 rounded-2xl border border-gray-700 bg-[#1e293b] text-white placeholder-gray-400"
          onChange={(e) =>
            setTopicData({
              ...topicData,
              topic: e.target.value,
            })
          }
        />

        <input
          type="text"
          placeholder="Video URL"
          value={topicData.video_url}
          className="p-4 rounded-2xl border border-gray-700 bg-[#1e293b] text-white placeholder-gray-400"
          onChange={(e) =>
            setTopicData({
              ...topicData,
              video_url: e.target.value,
            })
          }
        />

      </div>

      <button
        onClick={handleAddTopic}
        className="mt-6 bg-gradient-to-r from-blue-500 to-cyan-500 hover:scale-105 transition duration-300 text-white px-8 py-4 rounded-2xl font-bold shadow-lg"
      >

        Add Topic

      </button>
     
    </div>
          {/* ADD NOTES */}
<div className="mt-14">

  <h3 className="text-3xl font-bold mb-6">
    Add Notes
  </h3>

  <div className="grid md:grid-cols-3 gap-5">

    <input
      type="text"
      placeholder="Course Slug"
      value={noteData.course_slug}
      className="p-4 rounded-2xl border border-gray-700 bg-[#1e293b] text-white placeholder-gray-400"
      onChange={(e) =>
        setNoteData({
          ...noteData,
          course_slug: e.target.value,
        })
      }
    />

    <input
      type="text"
      placeholder="Note Title"
      value={noteData.title}
      className="p-4 rounded-2xl border border-gray-700 bg-[#1e293b] text-white placeholder-gray-400"
      onChange={(e) =>
        setNoteData({
          ...noteData,
          title: e.target.value,
        })
      }
    />

    <input
      type="file"
      accept=".pdf"
      className="p-4 rounded-2xl border border-gray-700 bg-[#1e293b] text-gray-300"
      onChange={(e) =>
        setNoteData({
          ...noteData,
          note_file: e.target.files?.[0] || null,
        })
      }
    />

  </div>

  <button
    onClick={handleAddNote}
    className="mt-6 bg-gradient-to-r from-green-500 to-emerald-500 hover:scale-105 transition duration-300 text-white px-8 py-4 rounded-2xl font-bold shadow-lg"
  >

    Add Note

  </button>

</div>

{/* ADD QUIZ */}
<div className="mt-14">

  <h3 className="text-3xl font-bold mb-6">
    Add Quiz
  </h3>

  <div className="grid md:grid-cols-2 gap-5">

    <input
      type="text"
      placeholder="Course Slug"
      value={quizData.course_slug}
      className="p-4 rounded-2xl border border-gray-700 bg-[#1e293b] text-white placeholder-gray-400"
      onChange={(e) =>
        setQuizData({
          ...quizData,
          course_slug: e.target.value,
        })
      }
    />

    <input
      type="text"
      placeholder="Question"
      value={quizData.question}
      className="p-4 rounded-2xl border border-gray-700 bg-[#1e293b] text-white placeholder-gray-400"
      onChange={(e) =>
        setQuizData({
          ...quizData,
          question: e.target.value,
        })
      }
    />

    <input
      type="text"
      placeholder="Option A"
      value={quizData.option_a}
      className="p-4 rounded-2xl border border-gray-700 bg-[#1e293b] text-white placeholder-gray-400"
      onChange={(e) =>
        setQuizData({
          ...quizData,
          option_a: e.target.value,
        })
      }
    />

    <input
      type="text"
      placeholder="Option B"
      value={quizData.option_b}
      className="p-4 rounded-2xl border border-gray-700 bg-[#1e293b] text-white placeholder-gray-400"
      onChange={(e) =>
        setQuizData({
          ...quizData,
          option_b: e.target.value,
        })
      }
    />

    <input
      type="text"
      placeholder="Option C"
      value={quizData.option_c}
      className="p-4 rounded-2xl border border-gray-700 bg-[#1e293b] text-white placeholder-gray-400"
      onChange={(e) =>
        setQuizData({
          ...quizData,
          option_c: e.target.value,
        })
      }
    />

    <input
      type="text"
      placeholder="Option D"
      value={quizData.option_d}
      className="p-4 rounded-2xl border border-gray-700 bg-[#1e293b] text-white placeholder-gray-400"
      onChange={(e) =>
        setQuizData({
          ...quizData,
          option_d: e.target.value,
        })
      }
    />

  </div>

  <input
    type="text"
    placeholder="Correct Answer (A/B/C/D)"
    value={quizData.correct_answer}
    className="w-full mt-5 p-4 rounded-2xl border border-gray-700 bg-[#1e293b] text-white placeholder-gray-400"
    onChange={(e) =>
      setQuizData({
        ...quizData,
        correct_answer: e.target.value,
      })
    }
  />

  <button
    onClick={handleAddQuiz}
    className="mt-6 bg-gradient-to-r from-purple-500 to-pink-500 hover:scale-105 transition duration-300 text-white px-8 py-4 rounded-2xl font-bold shadow-lg"
  >

    Add Quiz

  </button>

</div>
  </div>

)
}

export default CurriculumManager
