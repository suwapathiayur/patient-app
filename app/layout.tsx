"use client";

import "./globals.css";
import Link from "next/link";
import { useState } from "react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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

          {/* Sidebar */}
          <aside
            className={
              darkMode
                ? "w-64 bg-gray-800 p-5"
                : "w-64 bg-white p-5 shadow"
            }
          >
            <h1 className="text-2xl font-bold text-blue-500 mb-8">
              Clinic System
            </h1>

            <nav className="flex flex-col gap-3">

              <Link
                href="/dashboard"
                className="hover:bg-blue-500 hover:text-white p-3 rounded-xl transition"
              >
                Dashboard
              </Link>

              <Link
                href="/appointments"
                className="hover:bg-blue-500 hover:text-white p-3 rounded-xl transition"
              >
                Add Appointment
              </Link>

              <Link
                href="/appointments/list"
                className="hover:bg-blue-500 hover:text-white p-3 rounded-xl transition"
              >
                Appointment List
              </Link>
              <Link
                 href="/patients"
                className="hover:bg-blue-500 hover:text-white p-3 rounded-xl transition"
              >
                Patients
</Link>

            </nav>

            {/* Dark Mode Button */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="mt-10 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-xl w-full"
            >
              {darkMode ? "Light Mode" : "Dark Mode"}
            </button>
          </aside>

          {/* Main Content */}
          <main className="flex-1 p-6">
            {children}
          </main>

        </div>
      </body>
    </html>
  );
}