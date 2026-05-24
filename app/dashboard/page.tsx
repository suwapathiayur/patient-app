i"use client";

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
        Suwapathi Ayurveda
      </h1>

      <p className="text-gray-400 mt-2">
        Your Wellness - Our Happiness
      </p>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">

        <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-6 rounded-2xl shadow-xl">
          <p className="text-sm opacity-80">
            Total Appointments
          </p>

          <h2 className="text-5xl font-bold mt-3">
            {total}
          </h2>
        </div>

        <div className="bg-gradient-to-r from-green-600 to-green-500 p-6 rounded-2xl shadow-xl">
          <p className="text-sm opacity-80">
            System Status
          </p>

          <h2 className="text-3xl font-bold mt-3">
            Online
          </h2>
        </div>

        <div className="bg-gradient-to-r from-purple-600 to-purple-500 p-6 rounded-2xl shadow-xl">
          <p className="text-sm opacity-80">
            Doctor Mode
          </p>

          <h2 className="text-3xl font-bold mt-3">
            Active
          </h2>
        </div>

      </div>

    </main>
  );
}