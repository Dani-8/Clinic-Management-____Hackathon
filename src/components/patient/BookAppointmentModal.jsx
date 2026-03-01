import React from 'react';
import { Modal } from '../common/Modal';
import { CheckCircle, Loader2 } from 'lucide-react';

export default function BookAppointmentModal({
    isOpen,
    onClose,
    doctors,
    selectedDoctorId,
    setSelectedDoctorId,
    appDate,
    setAppDate,
    appNotes,
    setAppNotes,
    bookingStatus,
    handleRequestAppointment
}) {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Request New Appointment">
            {bookingStatus === 'success' ? (
                <div className="py-12 flex flex-col items-center text-center animate-in zoom-in-95 duration-300">
                    <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-6">
                        <CheckCircle size={48} />
                    </div>
                    <h4 className="text-2xl font-black text-slate-800 mb-2">Request Sent!</h4>
                    <p className="text-slate-400 font-medium">
                        The clinic has received your request and will confirm shortly.
                    </p>
                </div>
            ) : (
                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                            Select Doctor
                        </label>
                        <select
                            className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition appearance-none"
                            value={selectedDoctorId}
                            onChange={(e) => setSelectedDoctorId(e.target.value)}
                        >
                            <option value="">Choose a specialist...</option>
                            {doctors.map(d => (
                                <option key={d.uid} value={d.uid}>
                                    Dr. {d.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                            Preferred Date & Time
                        </label>
                        <input
                            type="datetime-local"
                            className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition"
                            value={appDate}
                            onChange={(e) => setAppDate(e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                            Brief Description
                        </label>
                        <textarea
                            className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition min-h-[100px]"
                            placeholder="Reason for visit (e.g., General checkup, flu symptoms...)"
                            value={appNotes}
                            onChange={(e) => setAppNotes(e.target.value)}
                        />
                    </div>

                    <button
                        disabled={bookingStatus === 'loading' || !selectedDoctorId || !appDate}
                        onClick={handleRequestAppointment}
                        className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {bookingStatus === 'loading' && <Loader2 size={18} className="animate-spin" />}
                        {bookingStatus === 'loading' ? 'Sending Request...' : 'Send Request'}
                    </button>
                </div>
            )}
        </Modal>
    );
}