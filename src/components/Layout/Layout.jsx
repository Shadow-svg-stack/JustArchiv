import React from "react"
import Sidebar from "./Sidebar"
import Header from "./Header"
import { Outlet } from "react-router-dom"

const Layout = () => {
  return (
    <div className="flex h-screen bg-surface-dark">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="flex flex-col flex-1">
        {/* Header */}
        <Header />

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6 animate-fadeIn">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default Layout
