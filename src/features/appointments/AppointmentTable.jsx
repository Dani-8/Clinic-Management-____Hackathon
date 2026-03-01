// src/features/appointments/AppointmentTable.jsx
import React from 'react';
import { Check, XCircle } from 'lucide-react';

export default function AppointmentTable({
    appointments = [],
    userRole,
    onUpdateStatus
}) {
    const canManage = userRole === 'receptionist' || userRole === 'admin';

    return (
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50/80 border-b border-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
                        <tr>
                            <th className="p-8">Patient Name</th>
                            <th className="p-8">Doctor</th>
                            <th className="p-8">Date / Time</th>
                            <th className="p-8">Status</th>
                            {canManage && <th className="p-8">Actions</th>}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {appointments.map((app) => (
                            <tr key={app.id} className="hover:bg-slate-50/30 transition-colors">
                                <td className="p-8 font-bold text-slate-800">{app.patientName}</td>
                                <td className="p-8 text-slate-500 font-medium">Dr. {app.doctorName}</td>
                                <td className="p-8 text-slate-500 font-medium">
                                    {new Date(app.date).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                                </td>
                                <td className="p-8">
                                    <span
                                        className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${app.status === 'confirmed' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                                            }`}
                                    >
                                        {app.status}
                                    </span>
                                </td>
                                {canManage && (
                                    <td className="p-8">
                                        {app.status === 'pending' ? (
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => onUpdateStatus(app.id, 'confirmed')}
                                                    className="p-2 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-all"
                                                >
                                                    <Check size={16} />
                                                </button>
                                                <button
                                                    onClick={() => onUpdateStatus(app.id, 'declined')}
                                                    className="p-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all"
                                                >
                                                    <XCircle size={16} />
                                                </button>
                                            </div>
                                        ) : (
                                            <span className="text-slate-300 font-bold text-xs">Processed</span>
                                        )}
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {appointments.length === 0 && (
                <div className="text-center py-20 text-slate-300 font-bold">No appointments found.</div>
            )}
        </div>
    );
}