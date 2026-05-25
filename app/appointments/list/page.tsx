"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function AppointmentListPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const today = currentDate.toISOString().slice(0, 10);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [editingAppointment, setEditingAppointment] = useState<any>(null);
  const [editForm, setEditForm] = useState({
    appointment_date: "",
    time_slot: "",
    title: "",
    patient_name: "",
    telephone: "",
    whatsapp: "",
    reason: "",
  });

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

  function normalizeDate(value: any) {
    if (!value) return "";
    const raw = String(value);
    return raw.includes("T") ? raw.slice(0, 10) : raw;
  }

  useEffect(() => {
    const interval = window.setInterval(() => {
      setCurrentDate(new Date());
    }, 30000);

    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    loadAppointments();
  }, []);

  async function loadAppointments() {
    const { data } = await supabase
      .from("appointments")
      .select("*")
      .order("appointment_date", { ascending: true });

    const normalized = (data || []).map((item: any) => ({
      ...item,
      appointment_date: normalizeDate(item.appointment_date),
    }));

    const sorted = normalized.sort((a: any, b: any) => {
      const aToday = a.appointment_date === today ? 0 : 1;
      const bToday = b.appointment_date === today ? 0 : 1;
      if (aToday !== bToday) return aToday - bToday;
      const dateCompare = a.appointment_date.localeCompare(b.appointment_date);
      if (dateCompare !== 0) return dateCompare;

      const aTimeRank = timeSlots.indexOf(a.time_slot);
      const bTimeRank = timeSlots.indexOf(b.time_slot);
      const aRank = aTimeRank >= 0 ? aTimeRank : Number.MAX_SAFE_INTEGER;
      const bRank = bTimeRank >= 0 ? bTimeRank : Number.MAX_SAFE_INTEGER;
      return aRank - bRank;
    });

    setAppointments(sorted);
  }

  function startEdit(appointment: any) {
    setEditingAppointment(appointment);
    setEditForm({
      appointment_date: appointment.appointment_date || "",
      time_slot: appointment.time_slot || "",
      title: appointment.title || "",
      patient_name: appointment.patient_name || "",
      telephone: appointment.telephone || "",
      whatsapp: appointment.whatsapp || "",
      reason: appointment.reason || "",
    });
  }

  function cancelEdit() {
    setEditingAppointment(null);
  }

  async function saveEdit() {
    if (!editForm.appointment_date || !editForm.time_slot) {
      alert("Please save with a valid date and time.");
      return;
    }

    const { error } = await supabase
      .from("appointments")
      .update({
        appointment_date: editForm.appointment_date,
        time_slot: editForm.time_slot,
        title: editForm.title || null,
        patient_name: editForm.patient_name || null,
        telephone: editForm.telephone || null,
        whatsapp: editForm.whatsapp || null,
        reason: editForm.reason || null,
      })
      .eq("id", editingAppointment.id);

    if (error) {
      alert(error.message);
    } else {
      cancelEdit();
      loadAppointments();
    }
  }

  async function deleteAppointment(id: number) {
    if (!confirm("Delete this appointment?")) {
      return;
    }

    const { error } = await supabase
      .from("appointments")
      .delete()
      .eq("id", id);

    if (error) {
      alert(error.message);
    } else {
      loadAppointments();
    }
  }

  async function markAppointmentDone(appointment: any) {
    const { error } = await supabase
      .from("appointments")
      .update({ completed: true })
      .eq("id", appointment.id);

    if (error) {
      alert(error.message);
    } else {
      alert("Appointment marked as completed.");
      loadAppointments();
    }
  }

  const filtered = appointments.filter((item) =>
    item.patient_name?.toLowerCase().includes(search.toLowerCase()) ||
    item.patient_id?.toLowerCase().includes(search.toLowerCase())
  );

  const todayAppointments = filtered.filter(
    (item) => item.appointment_date === today
  );

  const upcomingAppointments = filtered.filter(
    (item) => item.appointment_date > today
  );

  function renderAppointmentCard(appointment: any) {
    const isToday = appointment.appointment_date === today;
    const isCompleted = appointment.completed || appointment.appointment_date < today;

    return (
      <div
        key={appointment.id}
        className={`rounded-2xl p-5 shadow-lg transition ${isToday ? "bg-cyan-900 border border-cyan-400" : "bg-gray-800 hover:shadow-cyan-500/20"}`}
      >
        {(isToday || isCompleted) && (
          <div className="mb-3 flex flex-wrap gap-2">
            {isToday && !isCompleted && (
              <span className="text-sm uppercase tracking-wide text-cyan-200 font-semibold">
                Today
              </span>
            )}
            {isCompleted && (
              <span className="text-sm uppercase tracking-wide text-emerald-200 font-semibold">
                Completed
              </span>
            )}
          </div>
        )}

        {editingAppointment?.id === appointment.id ? (
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm text-gray-300">Date</label>
                <input
                  type="date"
                  className="mt-2 w-full p-2 rounded border bg-gray-900 text-white"
                  value={editForm.appointment_date}
                  onChange={(e) => setEditForm({ ...editForm, appointment_date: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300">Time</label>
                <select
                  className="mt-2 w-full p-2 rounded border bg-gray-900 text-white"
                  value={editForm.time_slot}
                  onChange={(e) => setEditForm({ ...editForm, time_slot: e.target.value })}
                >
                  <option value="">Select time</option>
                  {[
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
                  ].map((slot) => (
                    <option key={slot} value={slot}>{slot}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm text-gray-300">Title</label>
                <input
                  className="mt-2 w-full p-2 rounded border bg-gray-900 text-white"
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300">Name</label>
                <input
                  className="mt-2 w-full p-2 rounded border bg-gray-900 text-white"
                  value={editForm.patient_name}
                  onChange={(e) => setEditForm({ ...editForm, patient_name: e.target.value })}
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm text-gray-300">Telephone</label>
                <input
                  className="mt-2 w-full p-2 rounded border bg-gray-900 text-white"
                  value={editForm.telephone}
                  onChange={(e) => setEditForm({ ...editForm, telephone: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300">WhatsApp</label>
                <input
                  className="mt-2 w-full p-2 rounded border bg-gray-900 text-white"
                  value={editForm.whatsapp}
                  onChange={(e) => setEditForm({ ...editForm, whatsapp: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-300">Reason</label>
              <textarea
                className="mt-2 w-full p-2 rounded border bg-gray-900 text-white"
                rows={3}
                value={editForm.reason}
                onChange={(e) => setEditForm({ ...editForm, reason: e.target.value })}
              />
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={saveEdit}
                className="px-4 py-2 bg-cyan-500 rounded-xl hover:bg-cyan-400"
              >
                Save
              </button>
              <button
                onClick={cancelEdit}
                className="px-4 py-2 bg-gray-700 rounded-xl hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex flex-col md:flex-row md:justify-between gap-4">
              <div>
                <Link
                  href={`/patients/${appointment.patient_id}`}
                  className="text-cyan-400 text-xl font-bold hover:underline"
                >
                  {appointment.patient_id}
                </Link>

                <p className="text-lg mt-2 text-white">
                  {appointment.title} {appointment.patient_name}
                </p>

                <p className="text-gray-300 mt-1">
                  {appointment.reason}
                </p>
              </div>

              <div className="text-right">
                <p className="text-cyan-300 font-semibold">
                  {appointment.appointment_date}
                </p>

                <p className="mt-1 text-white">
                  {appointment.time_slot}
                </p>

                <p className="mt-2 text-gray-400">
                  {appointment.telephone}
                </p>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              {isToday && !isCompleted && (
                <button
                  onClick={() => markAppointmentDone(appointment)}
                  className="px-4 py-2 bg-emerald-500 rounded-xl hover:bg-emerald-400"
                >
                  Mark Done
                </button>
              )}
              <button
                onClick={() => startEdit(appointment)}
                className="px-4 py-2 bg-blue-600 rounded-xl hover:bg-blue-500"
              >
                Edit
              </button>
              <button
                onClick={() => deleteAppointment(appointment.id)}
                className="px-4 py-2 bg-red-600 rounded-xl hover:bg-red-500"
              >
                Delete
              </button>
            </div>
          </>
        )}
      </div>
    );
  }

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

      <div className="space-y-10 mt-8">

        <section>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-4">
            <div>
              <h2 className="text-2xl font-bold text-cyan-400">Today's Appointments</h2>
              <p className="text-gray-400 mt-1">Appointments scheduled for today.</p>
            </div>
            <span className="text-sm text-slate-400">{todayAppointments.length} appointment{todayAppointments.length === 1 ? '' : 's'}</span>
          </div>

          {todayAppointments.length > 0 ? (
            <div className="grid gap-4">
              {todayAppointments.map(renderAppointmentCard)}
            </div>
          ) : (
            <div className="rounded-2xl p-6 bg-gray-900 text-gray-300">
              No appointments scheduled for today.
            </div>
          )}
        </section>

        <section>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-4">
            <div>
              <h2 className="text-2xl font-bold text-cyan-400">Upcoming Appointments</h2>
              <p className="text-gray-400 mt-1">Appointments scheduled after today.</p>
            </div>
            <span className="text-sm text-slate-400">{upcomingAppointments.length} appointment{upcomingAppointments.length === 1 ? '' : 's'}</span>
          </div>

          {upcomingAppointments.length > 0 ? (
            <div className="grid gap-4">
              {upcomingAppointments.map(renderAppointmentCard)}
            </div>
          ) : (
            <div className="rounded-2xl p-6 bg-gray-900 text-gray-300">
              No upcoming appointments found.
            </div>
          )}
        </section>

      </div>

    </main>
  );
}