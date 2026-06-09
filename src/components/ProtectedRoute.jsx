import React from "react"

import { Navigate } from "react-router-dom"

const ProtectedRoute = ({ children }) => {

  // CHECK USER
  const user =
    localStorage.getItem("user")

  // IF NOT LOGGED IN
  if (!user) {

    return <Navigate to="/signin" replace />

  }

  // ALLOW ACCESS
  return children

}

export default ProtectedRoute