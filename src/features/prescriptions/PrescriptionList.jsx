// src/features/prescriptions/PrescriptionList.jsx
import React from 'react';
import PrescriptionCard from './PrescriptionCard';
import { Activity } from 'lucide-react';

export default function PrescriptionList({ prescriptions }) {
    if (!prescriptions?.length) {
        return (
            <div className="text-center py-40 bg-slate-50/50 rounded-[3rem] border-2 border-dashed border-slate-100">
                <Activity size={48} className="mx-auto text-slate-200 mb-6" />
                <p className="text-slate-400 font-bold text-xl">No records available.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-6">
            {prescriptions.map(p => (
                <PrescriptionCard key={p.id} prescription={p} />
            ))}
        </div>
    );
}