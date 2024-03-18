import React from 'react'
import Navbar from './pages/Navbar'
import { Outlet } from 'react-router-dom'

export default function App() {
  return (
    <>
    <Navbar />
    <Outlet />
    {/* <Footer/> */}
    </>
  )
}
