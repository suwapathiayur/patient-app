"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Dashboard() {
  const [total, setTotal] = useState(0);

  useEffect(() => {
    async function loadData() {
      const { data } = await supabase
        .from("appointments")
        .select("*");

      setTotal(data?.length || 0);
    }

    loadData();
  }, []);

  return (
    <main>

      <h1 className="text-4xl font-bold text-blue-500">
        Dashboard
      </h1>

      <p className="text-gray-400 mt-2">
        Your Wellness - Our Happiness
      </p>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">

        <div className="bg-gradient-to-r from-cyan-600 to-cyan-500 p-6 rounded-3xl shadow-xl">
          <p className="text-sm opacity-80">
            Total Appointments
          </p>

          <h2 className="text-5xl font-bold mt-3">
            {total}
          </h2>
        </div>

        <Link
          href="/appointments"
          className="bg-gradient-to-r from-purple-600 to-purple-500 p-6 rounded-3xl shadow-xl hover:scale-105 transition"
        >
          <p className="text-sm opacity-80">
            Quick Access
          </p>

          <h2 className="text-3xl font-bold mt-3">
            + Add Appointment
          </h2>
        </Link>

        <Link
          href="/patients"
          className="bg-gradient-to-r from-emerald-600 to-emerald-500 p-6 rounded-3xl shadow-xl hover:scale-105 transition"
        >
          <p className="text-sm opacity-80">
            View
          </p>

          <h2 className="text-3xl font-bold mt-3">
            Patient Records
          </h2>
        </Link>

      </div>

    </main>
  );
}