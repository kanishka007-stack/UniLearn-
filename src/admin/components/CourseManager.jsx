import { Trash2, Plus } from "lucide-react"

const CourseManager = ({
  courses,
  showForm,
  handleAddCourse,
  handleSubmit,
  formData,
  handleChange,
  imageFile,
  setImageFile,
  editingCourseId,
  handleEditCourse,
  handleDelete,
}) => {

  return (

   <div className="bg-[#0f172a] border border-gray-800 rounded-[32px] shadow-2xl p-10 text-white">

      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6 mb-10">

        <div>

          <h2 className="text-5xl font-black mb-2">
            Manage Courses
          </h2>

          <p className="text-gray-500 text-lg">
            Add, remove and manage platform courses
          </p>

        </div>

        <button
          onClick={handleAddCourse}
          className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-3 hover:scale-105 transition duration-300 shadow-xl"
        >

          <Plus size={24} />

          Add New Course

        </button>

      </div>

      {/* FORM */}
      {
        showForm && (

          <form
            onSubmit={handleSubmit}
            className="grid md:grid-cols-2 gap-6 mb-12"
          >

            <input
              type="text"
              name="title"
              placeholder="Course Title"
              value={formData.title}
              onChange={handleChange}
              className="p-4 rounded-2xl border border-gray-700 bg-[#1e293b] text-white placeholder-gray-400"
              required
            />

            <input
              type="text"
              name="slug"
              placeholder="Slug"
              value={formData.slug}
              onChange={handleChange}
              className="p-4 rounded-2xl border border-gray-700 bg-[#1e293b] text-white placeholder-gray-400"
              required
            />

            <input
              type="text"
              name="category"
              placeholder="Category"
              value={formData.category}
              onChange={handleChange}
              className="p-4 rounded-2xl border border-gray-700 bg-[#1e293b] text-white placeholder-gray-400"
              required
            />

            <input
              type="text"
              name="lessons"
              placeholder="Lessons"
              value={formData.lessons}
              onChange={handleChange}
              className="p-4 rounded-2xl border border-gray-700 bg-[#1e293b] text-white placeholder-gray-400"
              required
            />

            <input
              type="text"
              name="duration"
              placeholder="Duration"
              value={formData.duration}
              onChange={handleChange}
              className="p-4 rounded-2xl border border-gray-700 bg-[#1e293b] text-white placeholder-gray-400"
              required
            />

            <input
              type="text"
              name="level"
              placeholder="Level"
              value={formData.level}
              onChange={handleChange}
              className="p-4 rounded-2xl border border-gray-700 bg-[#1e293b] text-white placeholder-gray-400"
              required
            />

            <input
              type="number"
              name="rating"
              placeholder="Rating"
              value={formData.rating}
              onChange={handleChange}
              className="p-4 rounded-2xl border border-gray-700 bg-[#1e293b] text-white placeholder-gray-400"
              required
            />

            <input
              type="number"
              name="price"
              placeholder="Price"
              value={formData.price}
              onChange={handleChange}
              className="p-4 rounded-2xl border border-gray-700 bg-[#1e293b] text-white placeholder-gray-400"
              required
            />

            <div className="md:col-span-2">

              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setImageFile(e.target.files?.[0] || null)
                }
                className="w-full p-4 rounded-2xl border dark:border-gray-700 dark:bg-[#1f2937] dark:text-gray-100"
                required={!editingCourseId && !formData.image}
              />

              {
                formData.image && !imageFile && (

                  <p className="text-sm text-gray-500 mt-2 break-all">
                    Current image: {formData.image}
                  </p>

                )
              }

            </div>

            <textarea
              name="description"
              placeholder="Description"
              value={formData.description}
              onChange={handleChange}
              className="p-4 rounded-2xl border dark:border-gray-700 dark:bg-[#1f2937] dark:text-gray-100 md:col-span-2"
              rows="5"
              required
            />

            <button
              type="submit"
              className="bg-green-500 text-white py-4 rounded-2xl font-bold md:col-span-2"
            >

              Save Course

            </button>

          </form>

        )
      }

      {/* COURSE LIST */}
      <div className="space-y-6 mb-12">

        {
          courses.map((course) => (

            <div
              key={course.id}
              className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-5 bg-gradient-to-r from-[#111827] to-[#1e293b] border border-gray-700 p-7 rounded-[28px] hover:scale-[1.02] transition duration-300 shadow-lg"
            >

              <div className="flex items-center gap-4">

                {
                  course.image && (

                    <img
                      src={course.image}
                      alt={course.title}
                      className="w-20 h-16 rounded-xl object-cover border border-gray-700"
                    />

                  )
                }

                <div>

                  <h3 className="text-3xl font-black mb-2">
                    {course.title}
                  </h3>

                  <p className="text-gray-300 text-lg">
                    {course.category}
                  </p>

                </div>

              </div>

              <div className="flex items-center gap-4">

                <button
                  onClick={() =>
                    handleEditCourse(course)
                  }
                  className="bg-blue-500 hover:bg-blue-600 text-white px-7 py-4 rounded-2xl"
                >

                  Edit

                </button>

                <button
                  onClick={() =>
                    handleDelete(course.id)
                  }
                  className="bg-gradient-to-r from-black to-gray-800 text-white px-7 py-4 rounded-2xl flex items-center gap-3"
                >

                  <Trash2 size={20} />

                  Delete

                </button>

              </div>

            </div>

          ))
        }

      </div>

    </div>

  )

}

export default CourseManager