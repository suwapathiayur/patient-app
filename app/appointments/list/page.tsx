"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AppointmentList() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase.from("appointments").select("*");
      setData(data || []);
    };

    fetchData();
  }, []);

  return (
    <main className="p-6">
      <h1 className="text-xl font-bold">Appointments List</h1>

      <div className="mt-4 space-y-2">
        {data.map((item) => (
          <div key={item.id} className="p-3 border rounded">
            <p><b>ID:</b> {item.patient_id}</p>
            <p><b>Time:</b> {item.time_slot}</p>
          </div>
        ))}
      </div>
    </main>
  );
}