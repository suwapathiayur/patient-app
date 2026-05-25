"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
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
  const [patientRegistry, setPatientRegistry] = useState<Record<string, any>>({});
  const [autoFillNote, setAutoFillNote] = useState("");

  const yearPrefix = new Date().getFullYear().toString().slice(-2);

  const patientId = `${yearPrefix}${idPart}`;
  const searchParams = useSearchParams();
  const [prefilled, setPrefilled] = useState(false);

  useEffect(() => {
    if (prefilled) return;

    const patientIdParam = searchParams.get("patientId");
    const titleParam = searchParams.get("title");
    const patientNameParam = searchParams.get("patientName");
    const telephoneParam = searchParams.get("telephone");
    const whatsappParam = searchParams.get("whatsapp");

    if (patientIdParam) {
      if (patientIdParam.startsWith(yearPrefix)) {
        setIdPart(patientIdParam.slice(yearPrefix.length));
      } else {
        setIdPart(patientIdParam);
      }
    }

    if (titleParam) setTitle(titleParam);
    if (patientNameParam) setPatientName(patientNameParam);
    if (telephoneParam) setTelephone(telephoneParam);
    if (whatsappParam) setWhatsapp(whatsappParam);
    setPrefilled(true);
  }, [searchParams, prefilled, yearPrefix]);

  useEffect(() => {
    const stored = window.localStorage.getItem("patientRegistry");
    if (!stored) return;
    try {
      const registry = JSON.parse(stored) as Record<string, any>;
      setPatientRegistry(registry);
    } catch {
      setPatientRegistry({});
    }
  }, []);

  useEffect(() => {
    if (!patientId || !patientRegistry[patientId]) {
      setAutoFillNote("");
      return;
    }

    const existing = patientRegistry[patientId];
    if (!title && !patientName && !telephone && !whatsapp) {
      setTitle(existing.title || "");
      setPatientName(existing.patient_name || "");
      setTelephone(existing.telephone || "");
      setWhatsapp(existing.whatsapp || "");
      setAutoFillNote("Auto-filled from patient history.");
    }
  }, [patientId, patientRegistry, title, patientName, telephone, whatsapp]);

  function formatDate(date: Date) {
    return date.toISOString().slice(0, 10);
  }

  function changeAppointmentDate(days: number) {
    const current = appointmentDate ? new Date(appointmentDate) : new Date();
    current.setDate(current.getDate() + days);
    setAppointmentDate(formatDate(current));
  }

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
    if (!idPart || !appointmentDate || !time) {
      alert("Please fill the required fields: ID, Date and Time.");
      return;
    }

    if (telephone && !/^0\d{9}$/.test(telephone)) {
      alert("Invalid telephone number");
      return;
    }

    const { error } = await supabase.from("appointments").insert({
      patient_id: patientId,
      appointment_date: appointmentDate,
      time_slot: time,
      title: title || null,
      patient_name: patientName || null,
      telephone: telephone || null,
      whatsapp: whatsapp || null,
      reason: reason || null,
    });

    if (error) {
      console.log(error);
      alert(error.message);
    } else {
      const stored = window.localStorage.getItem("patientRegistry");
      const registry = stored ? (JSON.parse(stored) as Record<string, any>) : {};
      registry[patientId] = {
        patient_id: patientId,
        title: title || null,
        patient_name: patientName || null,
        telephone: telephone || null,
        whatsapp: whatsapp || null,
      };
      window.localStorage.setItem("patientRegistry", JSON.stringify(registry));
      setPatientRegistry(registry);

      alert("Appointment Saved Successfully!");

      setIdPart("");
      setAppointmentDate("");
      setTime("");
      setTitle("");
      setPatientName("");
      setTelephone("");
      setWhatsapp("");
      setReason("");
      setAutoFillNote("");
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 flex justify-center p-6 text-slate-100">
      <div className="bg-slate-900 w-full max-w-3xl rounded-3xl shadow-2xl shadow-cyan-900/20 p-8 border border-slate-700">

        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-cyan-300">
            Add Appointment
          </h1>

          <p className="text-slate-400 mt-2 max-w-xl leading-7">
            Create a new patient appointment with reliable fields and high contrast styling.
            Only the ID, date, and time are required; other information is optional.
          </p>
        </div>

        {/* Patient ID */}
        <div className="mt-6">
          <label className="text-sm font-semibold text-slate-200">
            Patient ID
          </label>

          <div className="flex gap-3 mt-3">
            <input
              className="w-24 p-3 rounded-2xl border border-slate-700 bg-slate-800 text-center text-slate-100"
              value={yearPrefix}
              disabled
            />

            <input
              className="flex-1 p-3 rounded-2xl border border-slate-700 bg-slate-800 text-slate-100 placeholder:text-slate-500"
              placeholder="E232"
              value={idPart}
              onChange={(e) => setIdPart(e.target.value)}
            />
          </div>

          <p className="text-sm text-slate-400 mt-3">
            Generated ID: <span className="font-semibold text-cyan-200">{patientId}</span>
          </p>

          {autoFillNote && (
            <p className="text-sm text-emerald-300 mt-2">{autoFillNote}</p>
          )}
        </div>

        {/* Date */}
        <div className="mt-4">
          <label className="text-sm font-semibold text-slate-200">
            Appointment Date
          </label>

          <div className="mt-3 flex items-center gap-3">
            <button
              type="button"
              onClick={() => changeAppointmentDate(-1)}
              className="px-4 py-2 rounded-2xl bg-cyan-600 text-slate-950 font-semibold hover:bg-cyan-500"
            >
              ←
            </button>

            <input
              type="date"
              className="flex-1 p-3 rounded-2xl border border-slate-700 bg-slate-800 text-slate-100"
              value={appointmentDate}
              onChange={(e) => setAppointmentDate(e.target.value)}
            />

            <button
              type="button"
              onClick={() => changeAppointmentDate(1)}
              className="px-4 py-2 rounded-2xl bg-cyan-600 text-slate-950 font-semibold hover:bg-cyan-500"
            >
              →
            </button>
          </div>

          <p className="text-sm text-slate-400 mt-2">
            Use the arrows to step the date backward or forward.
          </p>
        </div>

        {/* Time */}
        <div className="mt-4">
          <label className="text-sm font-semibold text-slate-200">
            Appointment Time
          </label>

          <select
            className="w-full mt-3 p-3 rounded-2xl border border-slate-700 bg-slate-800 text-slate-100"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          >
            <option value="" className="text-slate-500">Select time</option>

            {timeSlots.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        {/* Title */}
        <div className="mt-4">
          <label className="text-sm font-semibold text-slate-200">
            Title
          </label>

          <select
            className="w-full mt-3 p-3 rounded-2xl border border-slate-700 bg-slate-800 text-slate-100"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          >
            <option value="" className="text-slate-500">Select title</option>
            <option>Mr</option>
            <option>Mrs</option>
            <option>Miss</option>
            <option>Dr</option>
          </select>
        </div>

        {/* Name */}
        <div className="mt-4">
          <label className="text-sm font-semibold text-slate-200">
            Patient Name
          </label>

          <input
            type="text"
            className="w-full mt-3 p-3 rounded-2xl border border-slate-700 bg-slate-800 text-slate-100 placeholder:text-slate-500"
            placeholder="Enter patient name"
            value={patientName}
            onChange={(e) => setPatientName(e.target.value)}
          />
        </div>

        {/* Telephone */}
        <div className="mt-4">
          <label className="text-sm font-semibold text-slate-200">
            Telephone
          </label>

          <input
            type="text"
            className="w-full mt-3 p-3 rounded-2xl border border-slate-700 bg-slate-800 text-slate-100 placeholder:text-slate-500"
            placeholder="0771234567"
            value={telephone}
            onChange={(e) => setTelephone(e.target.value)}
          />
        </div>

        {/* WhatsApp */}
        <div className="mt-4">
          <label className="text-sm font-semibold text-slate-200">
            WhatsApp
          </label>

          <input
            type="text"
            className="w-full mt-3 p-3 rounded-2xl border border-slate-700 bg-slate-800 text-slate-100 placeholder:text-slate-500"
            placeholder="0771234567"
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
          />
        </div>

        {/* Reason */}
        <div className="mt-4">
          <label className="text-sm font-semibold text-slate-200">
            Reason
          </label>

          <textarea
            className="w-full mt-3 p-3 rounded-3xl border border-slate-700 bg-slate-800 text-slate-100 placeholder:text-slate-500"
            placeholder="Reason for appointment"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </div>

        {/* Save Button */}
        <button
          onClick={saveAppointment}
          className="mt-8 w-full bg-cyan-500 text-slate-950 p-4 rounded-3xl font-semibold shadow-xl shadow-cyan-500/20 hover:bg-cyan-400 transition"
        >
          Save Appointment
        </button>

      </div>
    </main>
  );
}