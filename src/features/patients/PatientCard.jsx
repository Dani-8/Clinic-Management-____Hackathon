import React from 'react';
import { ChevronRight } from 'lucide-react';

export default function PatientCard({ patient, onClick }) {
    return (
        <div
            onClick={() => onClick?.(patient)}
            className="group bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-blue-50/50 hover:border-blue-200 transition-all duration-300 cursor-pointer"
        >
            <div className="flex justify-between items-start mb-6">
                <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center font-bold text-blue-600 text-xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    {patient.name?.[0] || 'P'}
                </div>
                <div className="bg-slate-50 px-3 py-1 rounded-full text-[10px] font-black uppercase text-slate-400 tracking-widest">
                    Profile
                </div>
            </div>

            <h3 className="font-bold text-xl text-slate-800 mb-1">{patient.name}</h3>
            <p className="text-slate-400 text-sm mb-4 font-medium">
                {(patient.age != null) ? `${patient.age} Yrs` : 'N/A'} • {patient.gender || 'Not set'}
            </p>

            <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-300 uppercase">
                    Last: {patient.lastVisit ? new Date(patient.lastVisit).toLocaleDateString() : 'Never'}
                </span>
                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-blue-600 group-hover:translate-x-1 transition-transform">
                    <ChevronRight size={16} />
                </div>
            </div>
        </div>
    );
}