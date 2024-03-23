import React from 'react'
import { Navigate, Outlet } from 'react-router'

export default function Protect() {
    const token = localStorage.getItem('token')
  return (
    token ? <Outlet /> : <Navigate to="/login" />
  )
}
