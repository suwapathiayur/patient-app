"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function AppointmentListPage() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadAppointments();
  }, []);

  async function loadAppointments() {
    const { data } = await supabase
      .from("appointments")
      .select("*")
      .order("appointment_date", { ascending: false });

    setAppointments(data || []);
  }

  const filtered = appointments.filter((item) =>
    item.patient_name?.toLowerCase().includes(search.toLowerCase()) ||
    item.patient_id?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

        <div>
          <h1 className="text-4xl font-bold text-cyan-400">
            Appointment List
          </h1>

          <p className="text-gray-400 mt-1">
            Manage clinic appointments
          </p>
        </div>

        <input
          type="text"
          placeholder="Search patient..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-3 rounded-xl bg-gray-800 border border-gray-700 w-full md:w-80"
        />

      </div>

      <div className="grid gap-4 mt-8">

        {filtered.map((appointment) => (

          <div
            key={appointment.id}
            className="bg-gray-800 rounded-2xl p-5 shadow-lg hover:shadow-cyan-500/20 transition"
          >

            <div className="flex flex-col md:flex-row md:justify-between gap-4">

              <div>
                <Link
                  href={`/patients/${appointment.patient_id}`}
                  className="text-cyan-400 text-xl font-bold hover:underline"
                >
                  {appointment.patient_id}
                </Link>

                <p className="text-lg mt-2">
                  {appointment.title} {appointment.patient_name}
                </p>

                <p className="text-gray-400 mt-1">
                  {appointment.reason}
                </p>
              </div>

              <div className="text-right">
                <p className="text-cyan-300 font-semibold">
                  {appointment.appointment_date}
                </p>

                <p className="mt-1">
                  {appointment.time_slot}
                </p>

                <p className="mt-2 text-gray-400">
                  {appointment.telephone}
                </p>
              </div>

            </div>

          </div>

        ))}

      </div>

    </main>
  );
}