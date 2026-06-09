import {
  Users,
  BookOpen,
  BarChart3,
  GraduationCap,
} from "lucide-react"

const DashboardStats = ({ courses }) => {

  return (

    <>
    

      {/* STATS */}
      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-8 mb-12">

        <div className="bg-gradient-to-br from-red-500 to-red-700 text-white p-8 rounded-[32px] shadow-2xl relative overflow-hidden hover:scale-105 transition duration-300">

          <div className="absolute -right-5 -top-5 opacity-20">
            <BookOpen size={120} />
          </div>

          <p className="text-lg opacity-80 mb-3">
            Total Courses
          </p>

          <h2 className="text-6xl font-black">
            {courses.length}
          </h2>

        </div>

        <div className="bg-gradient-to-br from-blue-500 to-indigo-700 text-white p-8 rounded-[32px] shadow-2xl relative overflow-hidden hover:scale-105 transition duration-300">

          <div className="absolute -right-5 -top-5 opacity-20">
            <Users size={120} />
          </div>

          <p className="text-lg opacity-80 mb-3">
            Total Students
          </p>

          <h2 className="text-6xl font-black">
            1200+
          </h2>

        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-700 text-white p-8 rounded-[32px] shadow-2xl relative overflow-hidden hover:scale-105 transition duration-300">

          <div className="absolute -right-5 -top-5 opacity-20">
            <GraduationCap size={120} />
          </div>

          <p className="text-lg opacity-80 mb-3">
            Certificates
          </p>

          <h2 className="text-6xl font-black">
            530+
          </h2>

        </div>

        <div className="bg-gradient-to-br from-black to-gray-800 text-white p-8 rounded-[32px] shadow-2xl relative overflow-hidden hover:scale-105 transition duration-300">

          <div className="absolute -right-5 -top-5 opacity-20">
            <BarChart3 size={120} />
          </div>

          <p className="text-lg opacity-80 mb-3">
            Platform Growth
          </p>

          <h2 className="text-6xl font-black">
            +89%
          </h2>

        </div>

      </div>

    </>

  )

}

export default DashboardStats