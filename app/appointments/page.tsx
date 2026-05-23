"use client";
import { supabase } from "@/lib/supabase";

import { useState } from "react";

export default function AppointmentPage() {
  const [idPart, setIdPart] = useState("");
  const [time, setTime] = useState("");

  const yearPrefix = new Date().getFullYear().toString().slice(-2);

  const patientId = `${yearPrefix}${idPart}`;

  const timeSlots = [
    "9:00 AM","9:30 AM","10:00 AM","10:30 AM","11:00 AM","11:30 AM",
    "12:00 PM","12:30 PM","1:00 PM",
    "3:00 PM","3:30 PM","4:00 PM","4:30 PM","5:00 PM","5:30 PM","6:00 PM","6:30 PM","7:00 PM"
  ];

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white w-full max-w-xl p-6 rounded-2xl shadow-xl">
        
        <h1 className="text-2xl font-bold text-blue-600">
          Appointment Booking
        </h1>

        {/* Patient ID */}
        <div className="mt-6">
          <label className="text-sm font-medium">Patient ID</label>

          <div className="flex gap-2 mt-2">
            <input
              className="w-16 p-2 border rounded bg-gray-100 text-center"
              value={yearPrefix}
              disabled
            />
            <input
              className="flex-1 p-2 border rounded"
              placeholder="E232"
              value={idPart}
              onChange={(e) => setIdPart(e.target.value)}
            />
          </div>

          <p className="text-sm text-gray-500 mt-2">
            Generated ID: <b>{patientId}</b>
          </p>
        </div>

        {/* Time */}
        <div className="mt-6">
          <label className="text-sm font-medium">Appointment Time</label>

          <select
            className="w-full mt-2 p-2 border rounded"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          >
            <option value="">Select time</option>
            {timeSlots.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        {/* Button (next step) */}
        <button
  className="mt-6 w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
  onClick={async () => {
    const yearPrefix = new Date().getFullYear().toString().slice(-2);
    const patientId = `${yearPrefix}${idPart}`;

    if (!idPart || !time) {
      alert("Please enter Patient ID and select time");
      return;
    }

    const { error } = await supabase.from("appointments").insert({
      patient_id: patientId,
      time_slot: time,
    });

    if (error) {
      console.log("ERROR:", error);
      alert(error.message);
    } else {
      alert("Appointment Saved Successfully!");
      setIdPart("");
      setTime("");
    }
  }}
>
  Save Appointment
</button>
      </div>
    </main>
  );
}