import React from 'react';
import PatientCard from './PatientCard';
import { Activity } from 'lucide-react';

export default function PatientList({ patients, onSelectPatient }) {
    if (!patients?.length) {
        return (
            <div className="text-center py-20 bg-slate-50/50 rounded-[3rem] border-2 border-dashed border-slate-100">
                <Activity size={48} className="mx-auto text-slate-200 mb-6" />
                <p className="text-slate-400 font-bold text-xl">No patients found.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {patients.map(p => (
                <PatientCard key={p.id} patient={p} onClick={onSelectPatient} />
            ))}
        </div>
    );
}