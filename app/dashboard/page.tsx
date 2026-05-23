"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Dashboard() {
  const [total, setTotal] = useState(0);

  useEffect(() => {
    async function loadStats() {
      const { data, error } = await supabase
        .from("appointments")
        .select("*");

      if (!error && data) {
        setTotal(data.length);
      }
    }

    loadStats();
  }, []);

  return (
    <main className="min-h-screen bg-gray-100 p-6">

      <h1 className="text-3xl font-bold text-blue-700">
        Clinic Dashboard
      </h1>

      <p className="text-gray-600 mt-1">
        Live appointment statistics
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">

        {/* Total Appointments */}
        <div className="bg-white p-5 rounded-2xl shadow">
          <h2 className="text-gray-500">
            Total Appointments
          </h2>

          <p className="text-4xl font-bold mt-2">
            {total}
          </p>
        </div>

        {/* Status */}
        <div className="bg-white p-5 rounded-2xl shadow">
          <h2 className="text-gray-500">
            System Status
          </h2>

          <p className="text-green-600 text-xl mt-2">
            Online
          </p>
        </div>

      </div>
    </main>
  );
}