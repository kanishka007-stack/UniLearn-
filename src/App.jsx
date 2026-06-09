import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
} from "react-router-dom"

import { Toaster } from "react-hot-toast"

import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import ScrollToTop from "./components/ScrollToTop"
import ProtectedRoute from "./components/ProtectedRoute"
import AdminProtectedRoute from "./components/AdminProtectedRoute"

import Home from "./pages/Home"
import AboutPage from "./pages/AboutPage"
import SignIn from "./pages/SignIn"
import RegisterPage from "./pages/RegisterPage"
import ServicesPage from "./pages/ServicesPage"
import ContactPage from "./pages/ContactPage"
import CoursesPage from "./pages/CoursesPage"
import Dashboard from "./pages/Dashboard"
import CertificatePage from "./pages/CertificatePage"
import CourseDetails from "./pages/CourseDetails"
import MyCourses from "./pages/MyCourses"
import EnrollPage from "./pages/EnrollPage"
import LearningPage from "./pages/LearningPage"
import ProfilePage from "./pages/ProfilePage"
import ForgotPassword from "./pages/ForgotPassword"
import ResetPassword from "./pages/ResetPassword"
import AdminDashboard from "./admin/pages/AdminDashboard"
import AdminLogin from "./pages/AdminLogin"

function Layout() {

  const location = useLocation()

  const isAdminPage =
    location.pathname.startsWith(
      "/admin-dashboard"
    ) ||
    location.pathname.startsWith(
      "/admin-login"
    )

  return (

    <>

      {!isAdminPage && <Navbar />}

      <ScrollToTop />

      <Routes>

        {/* HOME */}
        <Route
          path="/"
          element={<Home />}
        />

        {/* PUBLIC PAGES */}
        <Route
          path="/about"
          element={<AboutPage />}
        />

        <Route
          path="/signin"
          element={<SignIn />}
        />

        <Route
          path="/register"
          element={<RegisterPage />}
        />

        <Route
          path="/services"
          element={<ServicesPage />}
        />

        <Route
          path="/contact"
          element={<ContactPage />}
        />

        {/* PROFILE */}
        <Route
          path="/profile"
          element={<ProfilePage />}
        />

        {/* COURSES */}
        <Route
          path="/course/:slug"
          element={<CourseDetails />}
        />

        <Route
          path="/courses/:slug"
          element={<CourseDetails />}
        />

        <Route
          path="/learning/:slug"
          element={<LearningPage />}
        />

        {/* PROTECTED ROUTES */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/courses"
          element={
            <ProtectedRoute>
              <CoursesPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/enroll/:courseId"
          element={
            <ProtectedRoute>
              <EnrollPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-courses"
          element={
            <ProtectedRoute>
              <MyCourses />
            </ProtectedRoute>
          }
        />

        {/* CERTIFICATE */}
        <Route
          path="/certificate/:courseId"
          element={<CertificatePage />}
        />

        {/* FORGOT PASSWORD */}
        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />

        {/* RESET PASSWORD */}
        <Route
          path="/reset-password/:token"
          element={<ResetPassword />}
        />

        {/* ADMIN LOGIN */}
        <Route
          path="/admin-login"
          element={<AdminLogin />}
        />

        {/* ADMIN DASHBOARD */}
        <Route
          path="/admin-dashboard"
          element={
            <AdminProtectedRoute>
              <AdminDashboard />
            </AdminProtectedRoute>
          }
        />

      </Routes>

      {!isAdminPage && <Footer />}

    </>

  )

}

function App() {

  return (

    <BrowserRouter>

      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#111827",
            color: "#fff",
            border: "1px solid #374151",
          },
        }}
      />

      <Layout />

    </BrowserRouter>

  )

}

export default App