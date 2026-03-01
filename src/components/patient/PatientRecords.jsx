import React, { useState, useEffect } from 'react';
import { useAuth } from '../../features/auth/AuthProvider';
import { db, collection, query, where, onSnapshot, orderBy } from '../../lib/firebase/db';
import { generateClinicalPDF } from '../../lib/pdf/generateClinicalPDF';
import { Activity, Download, Stethoscope, FileText, Loader2 } from 'lucide-react';
import { LoadingScreen } from '../common/LoadingScreen';

export default function PatientRecords() {
    const { user } = useAuth();
    const [prescriptions, setPrescriptions] = useState([]);
    const [loading, setLoading] = useState(true);

    const appId = 'clinic-saas-v1';

    useEffect(() => {
        if (!user?.uid) return;

        const q = query(
            collection(db, 'artifacts', appId, 'public', 'data', 'prescriptions'),
            where('patientId', '==', user.uid),
            orderBy('date', 'desc')
        );

        const unsubscribe = onSnapshot(q, (snap) => {
            setPrescriptions(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            setLoading(false);
        }, (err) => {
            console.error(err);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user]);

    if (loading) return <LoadingScreen />;

    return (
        <div className="p-8 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-3xl font-bold text-slate-900">Medical Records</h2>
                    <p className="text-slate-400 font-medium">Your prescriptions and visit history</p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {prescriptions.map(p => (
                    <div
                        key={p.id}
                        className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6 hover:shadow-lg transition-all"
                    >
                        <div className="flex items-center gap-6">
                            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center">
                                {p.role === 'doctor' ? <Stethoscope size={32} /> : <FileText size={32} />}
                            </div>
                            <div>
                                <p className="font-black text-xl text-slate-800">
                                    {p.role === 'doctor' ? `Dr. ${p.doctorName}` : `Staff: ${p.doctorName}`}
                                </p>
                                <p className="text-sm font-bold text-slate-400 mt-1 uppercase tracking-widest">
                                    {p.role === 'doctor' ? 'Clinical Prescription' : 'Clinical Visit Note'} • {new Date(p.date).toLocaleDateString()}
                                </p>
                                <p className="text-slate-600 mt-4 leading-relaxed max-w-xl">{p.notes}</p>
                            </div>
                        </div>

                        <button
                            onClick={() => generateClinicalPDF(p)}
                            className="flex items-center gap-3 bg-slate-50 text-slate-900 px-6 py-4 rounded-2xl font-bold hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                        >
                            <Download size={20} /> Download PDF
                        </button>
                    </div>
                ))}

                {prescriptions.length === 0 && (
                    <div className="text-center py-40 bg-slate-50/50 rounded-[3rem] border-2 border-dashed border-slate-100">
                        <Activity size={48} className="mx-auto text-slate-200 mb-6" />
                        <p className="text-slate-400 font-bold text-xl">No records available.</p>
                    </div>
                )}
            </div>
        </div>
    );
}