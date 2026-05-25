"use client";

import "./globals.css";
import Link from "next/link";
import { useState } from "react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  return (
    <html lang="en">
      <body
        className={
          darkMode
            ? "bg-gray-900 text-white"
            : "bg-gray-100 text-black"
        }
      >
        <div className="flex min-h-screen">

          {/* Mobile Menu Button */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden fixed top-4 left-4 z-50 bg-cyan-600 text-white px-4 py-2 rounded-xl shadow-lg"
          >
            ☰
          </button>

          {/* Sidebar */}
          <aside
            className={`
              fixed md:static top-0 left-0 z-40
              h-screen w-64 p-5 transition-transform duration-300
              ${darkMode ? "bg-gray-800" : "bg-white shadow"}
              ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
            `}
          >
            <h1 className="text-2xl font-bold text-cyan-400 mb-8">
              Clinic System
            </h1>

            <nav className="flex flex-col gap-3">

              <Link
                href="/dashboard"
                className="hover:bg-cyan-500 hover:text-white p-3 rounded-xl transition"
              >
                Dashboard
              </Link>

              <Link
                href="/appointments"
                className="hover:bg-cyan-500 hover:text-white p-3 rounded-xl transition"
              >
                Add Appointment
              </Link>

              <Link
                href="/appointments/list"
                className="hover:bg-cyan-500 hover:text-white p-3 rounded-xl transition"
              >
                Appointment List
              </Link>

              <Link
                href="/patients"
                className="hover:bg-cyan-500 hover:text-white p-3 rounded-xl transition"
              >
                Patients
              </Link>

            </nav>

            <button
              onClick={() => setDarkMode(!darkMode)}
              className="mt-10 bg-cyan-600 hover:bg-cyan-700 px-4 py-2 rounded-xl w-full"
            >
              {darkMode ? "Light Mode" : "Dark Mode"}
            </button>
          </aside>

          {/* Main Content */}
          <main className="flex-1 p-4 md:p-6 md:ml-0 ml-0 w-full overflow-x-hidden">
            {children}
          </main>

        </div>
      </body>
    </html>
  );
}