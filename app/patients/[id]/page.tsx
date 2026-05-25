"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function PatientDetail({
  params,
}: {
  params: { id: string };
}) {

  const [records, setRecords] = useState<any[]>([]);

  useEffect(() => {
    loadPatientHistory();
  }, []);

  async function loadPatientHistory() {

    const { data, error } = await supabase
      .from("appointments")
      .select("*")
      .eq("patient_id", params.id)
      .order("appointment_date", {
        ascending: false,
      });

    if (!error && data) {
      setRecords(data);
    }
  }

  /* Group by Year + Month */
  const grouped = records.reduce((acc: any, item: any) => {

    const date = new Date(item.appointment_date);

    const year = date.getFullYear();

    const month = date.toLocaleString("default", {
      month: "long",
    });

    if (!acc[year]) {
      acc[year] = {};
    }

    if (!acc[year][month]) {
      acc[year][month] = [];
    }

    acc[year][month].push(item);

    return acc;

  }, {});

  return (
    <main className="max-w-5xl mx-auto">

      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-600 to-blue-600 rounded-3xl p-8 shadow-xl">

        <h1 className="text-4xl font-bold text-white">
          Patient History
        </h1>

        <p className="text-cyan-100 mt-2">
          ID: {params.id}
        </p>

      </div>

      {/* History */}
      <div className="mt-8">

        {Object.entries(grouped).map(
          ([year, months]: any) => (

            <div key={year} className="mb-10">

              {/* Year */}
              <h2 className="text-3xl font-bold text-cyan-400 mb-4">
                {year}
              </h2>

              {/* Months */}
              {Object.entries(months).map(
                ([month, items]: any) => (

                  <details
                    key={month}
                    className="bg-gray-800 rounded-2xl mb-5 overflow-hidden"
                  >

                    {/* Month Header */}
                    <summary className="cursor-pointer p-5 text-xl font-semibold bg-gray-700 hover:bg-gray-600 transition">

                      {month}

                    </summary>

                    {/* Records */}
                    <div className="p-5 space-y-4">

                      {items.map((patient: any) => (

                        <div
                          key={patient.id}
                          className="bg-gray-900 rounded-2xl p-5 border border-gray-700"
                        >

                          <div className="flex flex-col md:flex-row md:justify-between gap-3">

                            <div>

                              <h3 className="text-xl font-bold text-cyan-300">
                                {patient.title} {patient.patient_name}
                              </h3>

                              <p className="text-gray-400 mt-1">
                                {patient.reason}
                              </p>

                            </div>

                            <div className="text-left md:text-right">

                              <p className="font-semibold">
                                {patient.appointment_date}
                              </p>

                              <p className="mt-1">
                                {patient.time_slot}
                              </p>

                              <p className="mt-2 text-gray-400">
                                {patient.telephone}
                              </p>

                            </div>

                          </div>

                        </div>

                      ))}

                    </div>

                  </details>

                )
              )}

            </div>

          )
        )}

      </div>

    </main>
  );
}