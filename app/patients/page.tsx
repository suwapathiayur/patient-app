"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function PatientsPage() {
  const [patients, setPatients] = useState<any[]>([]);

  useEffect(() => {
    loadPatients();
  }, []);

  async function loadPatients() {
    const { data, error } = await supabase
      .from("appointments")
      .select("*")
      .order("appointment_date", { ascending: false });

    if (!error && data) {
      setPatients(data);
    }
  }

  return (
    <main>

      {/* Header */}
      <div className="flex justify-between items-center">

        <div>
          <h1 className="text-4xl font-bold text-blue-500">
            Patients
          </h1>

          <p className="text-gray-400 mt-1">
            Patient records and appointments
          </p>
        </div>

      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl mt-8 overflow-hidden">

        <table className="w-full">

          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="text-left p-4">Patient ID</th>
              <th className="text-left p-4">Name</th>
              <th className="text-left p-4">Date</th>
              <th className="text-left p-4">Time</th>
              <th className="text-left p-4">Telephone</th>
            </tr>
          </thead>

          <tbody>

            {patients.map((patient) => (

              <tr
                key={patient.id}
                className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              >

                {/* Clickable Patient ID */}
                <td className="p-4">

                  <Link
                    href={`/patients/${patient.patient_id}`}
                    className="text-blue-500 font-semibold hover:underline"
                  >
                    {patient.patient_id}
                  </Link>

                </td>

                <td className="p-4">
                  {patient.title} {patient.patient_name}
                </td>

                <td className="p-4">
                  {patient.appointment_date}
                </td>

                <td className="p-4">
                  {patient.time_slot}
                </td>

                <td className="p-4">
                  {patient.telephone}
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </main>
  );
}