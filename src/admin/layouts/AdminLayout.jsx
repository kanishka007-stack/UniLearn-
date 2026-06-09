import Sidebar from "../components/Sidebar"

const AdminLayout = ({
  children,
  activeSection,
  setActiveSection,
}) => {

  return (

    <div className="min-h-screen bg-[#0f172a] text-white flex">

      <Sidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />

      <main className="flex-1 p-8 overflow-y-auto h-screen">

        {children}

      </main>

    </div>

  )

}

export default AdminLayout