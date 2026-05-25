"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AppointmentPage() {
  const [idPart, setIdPart] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [time, setTime] = useState("");

  const [title, setTitle] = useState("");
  const [patientName, setPatientName] = useState("");
  const [telephone, setTelephone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [reason, setReason] = useState("");

  const yearPrefix = new Date().getFullYear().toString().slice(-2);

  const patientId = `${yearPrefix}${idPart}`;

  const timeSlots = [
    "9:00 AM",
    "9:30 AM",
    "10:00 AM",
    "10:30 AM",
    "11:00 AM",
    "11:30 AM",
    "12:00 PM",
    "12:30 PM",
    "1:00 PM",
    "3:00 PM",
    "3:30 PM",
    "4:00 PM",
    "4:30 PM",
    "5:00 PM",
    "5:30 PM",
    "6:00 PM",
    "6:30 PM",
    "7:00 PM",
  ];

  async function saveAppointment() {
    if (
      !idPart ||
      !appointmentDate ||
      !time ||
      !title ||
      !patientName
    ) {
      alert("Please fill required fields");
      return;
    }
    if (!/^0\d{9}$/.test(telephone)) {
  alert("Invalid telephone number");
  return;
}
    const { error } = await supabase.from("appointments").insert({
      patient_id: patientId,
      appointment_date: appointmentDate,
      time_slot: time,
      title: title,
      patient_name: patientName,
      telephone: telephone,
      whatsapp: whatsapp,
      reason: reason,
    });

    if (error) {
      console.log(error);
      alert(error.message);
    } else {
      alert("Appointment Saved Successfully!");

      setIdPart("");
      setAppointmentDate("");
      setTime("");
      setTitle("");
      setPatientName("");
      setTelephone("");
      setWhatsapp("");
      setReason("");
    }
  }

  return (
    <main className="min-h-screen bg-gray-100 flex justify-center p-6">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl p-6">

        <h1 className="text-3xl font-bold text-blue-700">
          Patient Appointment
        </h1>

        <p className="text-gray-500 mt-1">
          Add new clinic appointment
        </p>

        {/* Patient ID */}
        <div className="mt-6">
          <label className="text-sm font-medium">
            Patient ID
          </label>

          <div className="flex gap-2 mt-2">
            <input
              className="w-20 p-2 border rounded bg-gray-100 text-center"
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

        {/* Date */}
        <div className="mt-4">
          <label className="text-sm font-medium">
            Appointment Date
          </label>

          <input
            type="date"
            className="w-full mt-2 p-2 border rounded"
            value={appointmentDate}
            onChange={(e) => setAppointmentDate(e.target.value)}
          />
        </div>

        {/* Time */}
        <div className="mt-4">
          <label className="text-sm font-medium">
            Appointment Time
          </label>

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

        {/* Title */}
        <div className="mt-4">
          <label className="text-sm font-medium">
            Title
          </label>

          <select
            className="w-full mt-2 p-2 border rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          >
            <option value="">Select title</option>
            <option>Mr</option>
            <option>Mrs</option>
            <option>Miss</option>
            <option>Dr</option>
          </select>
        </div>

        {/* Name */}
        <div className="mt-4">
          <label className="text-sm font-medium">
            Patient Name
          </label>

          <input
            type="text"
            className="w-full mt-2 p-2 border rounded"
            placeholder="Enter patient name"
            value={patientName}
            onChange={(e) => setPatientName(e.target.value)}
          />
        </div>

        {/* Telephone */}
        <div className="mt-4">
          <label className="text-sm font-medium">
            Telephone
          </label>

          <input
            type="text"
            className="w-full mt-2 p-2 border rounded"
            placeholder="0771234567"
            value={telephone}
            onChange={(e) => setTelephone(e.target.value)}
          />
        </div>

        {/* WhatsApp */}
        <div className="mt-4">
          <label className="text-sm font-medium">
            WhatsApp
          </label>

          <input
            type="text"
            className="w-full mt-2 p-2 border rounded"
            placeholder="0771234567"
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
          />
        </div>

        {/* Reason */}
        <div className="mt-4">
          <label className="text-sm font-medium">
            Reason
          </label>

          <textarea
            className="w-full mt-2 p-2 border rounded"
            placeholder="Reason for appointment"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </div>

        {/* Save Button */}
        <button
          onClick={saveAppointment}
          className="mt-6 w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700"
        >
          Save Appointment
        </button>

      </div>
    </main>
  );
}