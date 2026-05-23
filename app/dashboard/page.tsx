"use client";

import { useEffect, useState } from "react";

export default function Dashboard() {
  const [stats, setStats] = useState({
    total: 0,
    today: 0,
  });

  useEffect(() => {
    // temporary mock data (we connect Supabase later)
    setStats({
      total: 24,
      today: 6,
    });
  }, []);

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      
      {/* Header */}
      <h1 className="text-3xl font-bold text-blue-700">
        Clinic Dashboard
      </h1>

      <p className="text-gray-600 mt-1">
        Welcome back, Doctor 👨‍⚕️
      </p>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">

        <div className="bg-white p-5 rounded-2xl shadow">
          <h2 className="text-gray-500">Total Appointments</h2>
          <p className="text-3xl font-bold">{stats.total}</p>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow">
          <h2 className="text-gray-500">Today</h2>
          <p className="text-3xl font-bold">{stats.today}</p>
        </div>

      </div>

      {/* Quick Actions */}
      <div className="mt-6 bg-white p-5 rounded-2xl shadow">
        <h2 className="font-semibold mb-3">Quick Actions</h2>

        <div className="flex gap-3">
          <a
            href="/appointments"
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            New Appointment
          </a>

          <a
            href="/appointments/list"
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            View Appointments
          </a>
        </div>
      </div>

    </main>
  );
}