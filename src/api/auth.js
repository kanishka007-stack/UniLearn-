import axios from "axios";

// BASE URL
const API = "http://localhost:5000";

// =========================
// REGISTER API
// =========================
export const registerUser = async (userData) => {

  const response = await axios.post(
    `${API}/api/auth/register`,
    userData
  );

  return response.data;

};

// =========================
// LOGIN API
// =========================
export const loginUser = async (userData) => {

  const response = await axios.post(
    `${API}/api/auth/login`,
    userData
  );

  return response.data;

};

// =========================
// ENROLL COURSE API
// =========================
export const enrollCourse = async (courseData) => {

  const response = await axios.post(
    `${API}/api/enrollments`,
    courseData
  );

  return response.data;

};

// =========================
// GET ENROLLMENTS
// =========================
export const getEnrollments = async (email) => {

  const response = await axios.get(
    `${API}/api/enrollments/${encodeURIComponent(email)}`
  );

  return response.data;

};
