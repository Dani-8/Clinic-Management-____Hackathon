// src/features/appointments/AppointmentFormModal.jsx
import React from 'react';
import { Modal } from '../../components/common/Modal';

export default function AppointmentFormModal({
    isOpen,
    onClose,
    patients = [],
    doctors = [],
    formData,
    setFormData,
    onSubmit,
    submitting = false
}) {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Manual Booking">
            <div className="space-y-5">
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Patient</label>
                    <select
                        className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition"
                        value={formData.patientId}
                        onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
                    >
                        <option value="">Select Patient...</option>
                        {patients.map((p) => (
                            <option key={p.id} value={p.id}>
                                {p.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Assign Doctor</label>
                    <select
                        className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition"
                        value={formData.doctorId}
                        onChange={(e) => setFormData({ ...formData, doctorId: e.target.value })}
                    >
                        <option value="">Select Specialist...</option>
                        {doctors.map((d) => (
                            <option key={d.uid} value={d.uid}>
                                Dr. {d.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Date & Time</label>
                    <input
                        type="datetime-local"
                        className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    />
                </div>

                <button
                    disabled={submitting}
                    onClick={onSubmit}
                    className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold shadow-lg mt-4 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                    {submitting && <Loader2 size={18} className="animate-spin" />}
                    {submitting ? 'Processing...' : 'Book Appointment'}
                </button>
            </div>
        </Modal>
    );
}