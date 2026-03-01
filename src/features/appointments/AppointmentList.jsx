// src/features/appointments/AppointmentList.jsx
import React from 'react';
import { Clock } from 'lucide-react';

export default function AppointmentList({ appointments = [] }) {
    if (!appointments.length) {
        return (
            <div className="text-center py-20 bg-slate-50/50 rounded-[3rem] border-2 border-dashed border-slate-100">
                <p className="text-slate-400 font-bold text-xl">No appointments found.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {appointments.map((app) => (
                <div
                    key={app.id}
                    className="group p-6 bg-slate-50/50 rounded-3xl border border-slate-50 flex justify-between items-center hover:bg-white hover:shadow-xl transition-all duration-300"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm bg-emerald-50 text-emerald-600">
                            <Clock size={24} />
                        </div>
                        <div>
                            <p className="font-extrabold text-slate-800 text-lg">
                                Dr. {app.doctorName}
                            </p>
                            <p className="text-sm text-slate-400 font-bold">
                                {new Date(app.date).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                            </p>
                        </div>
                    </div>
                    <div
                        className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${app.status === 'confirmed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                            }`}
                    >
                        {app.status}
                    </div>
                </div>
            ))}
        </div>
    );
}