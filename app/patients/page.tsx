"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function PatientsPage() {
  const [patients, setPatients] = useState<any[]>([]);
  const [editingPatientId, setEditingPatientId] = useState("");
  const [patientForm, setPatientForm] = useState({
    title: "",
    patient_name: "",
    telephone: "",
    whatsapp: "",
  });

  useEffect(() => {
    loadPatients();
  }, []);

  function getRegistry() {
    const stored = window.localStorage.getItem("patientRegistry");
    if (!stored) return {};
    try {
      return JSON.parse(stored) as Record<string, any>;
    } catch {
      return {};
    }
  }

  async function loadPatients() {
    const registry = getRegistry();
    const registryValues = Object.values(registry);
    if (registryValues.length > 0) {
      setPatients(registryValues);
      return;
    }

    const { data, error } = await supabase
      .from("appointments")
      .select("*")
      .order("appointment_date", { ascending: false });

    if (!error && data) {
      const uniquePatients: Record<string, any> = {};

      data.forEach((appointment: any) => {
        if (!appointment.patient_id) return;
        if (!uniquePatients[appointment.patient_id]) {
          uniquePatients[appointment.patient_id] = appointment;
        }
      });

      setPatients(Object.values(uniquePatients));
    }
  }

  function savePatient() {
    if (!editingPatientId) return;

    const registry = getRegistry();
    registry[editingPatientId] = {
      patient_id: editingPatientId,
      ...registry[editingPatientId],
      title: patientForm.title || null,
      patient_name: patientForm.patient_name || null,
      telephone: patientForm.telephone || null,
      whatsapp: patientForm.whatsapp || null,
    };

    window.localStorage.setItem("patientRegistry", JSON.stringify(registry));
    setPatients(Object.values(registry));
    setEditingPatientId("");
  }

  function startEditPatient(patient: any) {
    setEditingPatientId(patient.patient_id);
    setPatientForm({
      title: patient.title || "",
      patient_name: patient.patient_name || "",
      telephone: patient.telephone || "",
      whatsapp: patient.whatsapp || "",
    });
  }

  function cancelEditPatient() {
    setEditingPatientId("");
  }

  function deletePatient(patientId: string) {
    if (!confirm("Delete this patient record? This will not delete appointments.")) {
      return;
    }

    const registry = getRegistry();
    delete registry[patientId];
    window.localStorage.setItem("patientRegistry", JSON.stringify(registry));
    setPatients(Object.values(registry));
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
            Patient name, ID and contact details
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
              <th className="text-left p-4">Contact</th>
              <th className="text-left p-4">Actions</th>
            </tr>
          </thead>

          <tbody>

            {patients.map((patient) => (

              <tr
                key={patient.patient_id}
                className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              >

                <td className="p-4">
                  <Link
                    href={`/patients/${patient.patient_id}`}
                    className="text-blue-500 font-semibold hover:underline"
                  >
                    {patient.patient_id}
                  </Link>
                </td>

                <td className="p-4">
                  {editingPatientId === patient.patient_id ? (
                    <div className="space-y-2">
                      <select
                        className="w-full p-2 rounded border bg-white text-black"
                        value={patientForm.title}
                        onChange={(e) => setPatientForm({ ...patientForm, title: e.target.value })}
                      >
                        <option value="">Title</option>
                        <option>Mr</option>
                        <option>Mrs</option>
                        <option>Miss</option>
                        <option>Dr</option>
                      </select>
                      <input
                        className="w-full p-2 rounded border bg-white text-black"
                        value={patientForm.patient_name}
                        placeholder="Patient Name"
                        onChange={(e) => setPatientForm({ ...patientForm, patient_name: e.target.value })}
                      />
                    </div>
                  ) : (
                    <>{patient.title} {patient.patient_name}</>
                  )}
                </td>

                <td className="p-4">
                  {editingPatientId === patient.patient_id ? (
                    <div className="space-y-2 text-sm text-gray-700 dark:text-gray-200">
                      <input
                        className="w-full p-2 rounded border bg-white text-black"
                        value={patientForm.telephone}
                        placeholder="Telephone"
                        onChange={(e) => setPatientForm({ ...patientForm, telephone: e.target.value })}
                      />
                      <input
                        className="w-full p-2 rounded border bg-white text-black"
                        value={patientForm.whatsapp}
                        placeholder="WhatsApp"
                        onChange={(e) => setPatientForm({ ...patientForm, whatsapp: e.target.value })}
                      />
                    </div>
                  ) : (
                    <div className="space-y-1 text-sm text-gray-700 dark:text-gray-200">
                      <div>{patient.telephone || "-"}</div>
                      <div>{patient.whatsapp || "-"}</div>
                    </div>
                  )}
                </td>

                <td className="p-4">
                  {editingPatientId === patient.patient_id ? (
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={savePatient}
                        className="px-3 py-2 bg-cyan-600 text-white rounded-xl hover:bg-cyan-500"
                      >
                        Save
                      </button>
                      <button
                        onClick={cancelEditPatient}
                        className="px-3 py-2 bg-gray-700 text-white rounded-xl hover:bg-gray-600"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => startEditPatient(patient)}
                        className="px-3 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-500"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deletePatient(patient.patient_id)}
                        className="px-3 py-2 bg-red-600 text-white rounded-xl hover:bg-red-500"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </main>
  );
}