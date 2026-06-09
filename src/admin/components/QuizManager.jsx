const QuizManager = () => {

  return (

    <div className="space-y-8">

      <div className="bg-[#101935] border border-gray-800 rounded-[30px] p-10">

        <h1 className="text-5xl font-black text-white mb-3">
          Manage Quizzes
        </h1>

        <p className="text-gray-400 mb-10">
          Create and manage quizzes
        </p>

        <div className="grid md:grid-cols-2 gap-6">

          <input
            type="text"
            placeholder="Course Slug"
            className="bg-[#1b2747] border border-gray-700 rounded-2xl px-5 py-4 text-white outline-none"
          />

          <input
            type="text"
            placeholder="Question"
            className="bg-[#1b2747] border border-gray-700 rounded-2xl px-5 py-4 text-white outline-none"
          />

          <input
            type="text"
            placeholder="Option A"
            className="bg-[#1b2747] border border-gray-700 rounded-2xl px-5 py-4 text-white outline-none"
          />

          <input
            type="text"
            placeholder="Option B"
            className="bg-[#1b2747] border border-gray-700 rounded-2xl px-5 py-4 text-white outline-none"
          />

          <input
            type="text"
            placeholder="Option C"
            className="bg-[#1b2747] border border-gray-700 rounded-2xl px-5 py-4 text-white outline-none"
          />

          <input
            type="text"
            placeholder="Option D"
            className="bg-[#1b2747] border border-gray-700 rounded-2xl px-5 py-4 text-white outline-none"
          />

        </div>

        <button
          className="mt-8 bg-purple-500 hover:bg-purple-600 px-8 py-4 rounded-2xl font-bold transition"
        >
          Add Quiz
        </button>

      </div>

    </div>

  )

}

export default QuizManager