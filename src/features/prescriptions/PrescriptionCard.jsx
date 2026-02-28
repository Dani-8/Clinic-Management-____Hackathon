// src/features/prescriptions/PrescriptionCard.jsx
import React from 'react';
import { Download, Stethoscope, FileText } from 'lucide-react';
import { generateClinicalPDF } from '../../lib/pdf/generateClinicalPDF';

export default function PrescriptionCard({ prescription }) {
    return (
        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6 hover:shadow-lg transition-all">
            <div className="flex items-center gap-6 flex-1">
                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center">
                    {prescription.role === 'doctor' ? <Stethoscope size={32} /> : <FileText size={32} />}
                </div>
                <div>
                    <p className="font-black text-xl text-slate-800">
                        {prescription.role === 'doctor' ? `Dr. ${prescription.doctorName}` : `Staff: ${prescription.doctorName}`}
                    </p>
                    <p className="text-sm font-bold text-slate-400 mt-1 uppercase tracking-widest">
                        {prescription.role === 'doctor' ? 'Clinical Prescription' : 'Clinical Visit Note'} •{' '}
                        {new Date(prescription.date).toLocaleDateString()}
                    </p>
                    <p className="text-slate-600 mt-4 leading-relaxed">{prescription.notes}</p>
                </div>
            </div>

            <button
                onClick={() => generateClinicalPDF(prescription)}
                className="flex items-center gap-3 bg-slate-50 text-slate-900 px-6 py-4 rounded-2xl font-bold hover:bg-blue-600 hover:text-white transition-all shadow-sm whitespace-nowrap"
            >
                <Download size={20} /> Download PDF
            </button>
        </div>
    );
}