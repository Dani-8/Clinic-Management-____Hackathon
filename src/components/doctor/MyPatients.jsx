// src/components/doctor/MyPatients.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../features/auth/AuthProvider';
import { db, collection, query, where, onSnapshot, addDoc, updateDoc, doc } from '../../lib/firebase/db';
import { Modal } from '../common/Modal';
import { Activity, AlertCircle, ChevronRight, Loader2 } from 'lucide-react';

export default function MyPatients() {
    const { user } = useAuth();
    const [patients, setPatients] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [prescriptionText, setPrescriptionText] = useState('');

    const appId = 'clinic-saas-v1';

    useEffect(() => {
        if (!user) return;

        const patQ = collection(db, 'artifacts', appId, 'public', 'data', 'patients');

        if (user.role === 'doctor') {
            // Doctor: only patients from their appointments
            const apptQ = query(
                collection(db, 'artifacts', appId, 'public', 'data', 'appointments'),
                where('doctorId', '==', user.uid)
            );

            const unsubscribe = onSnapshot(apptQ, snap => {
                const myPatientIds = [...new Set(snap.docs.map(d => d.data().patientId))];
                if (myPatientIds.length === 0) {
                    setPatients([]);
                    return;
                }

                onSnapshot(patQ, pSnap => {
                    const all = pSnap.docs.map(d => ({ id: d.id, ...d.data() }));
                    setPatients(all.filter(p => myPatientIds.includes(p.id)));
                });
            });

            return () => unsubscribe();
        } else {
            // Receptionist (and admin if needed): show ALL patients
            const unsubscribe = onSnapshot(patQ, snap => {
                const all = snap.docs.map(d => ({ id: d.id, ...d.data() }));
                setPatients(all);
            });

            return () => unsubscribe();
        }
    }, [user]);

    const handlePrescribe = async () => {
        if (!prescriptionText || !selectedPatient) return;
        try {
            await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'prescriptions'), {
                patientId: selectedPatient.id,
                patientName: selectedPatient.name,
                doctorId: user.uid,
                doctorName: user.name || 'Staff Member',
                notes: prescriptionText,
                role: user.role,
                date: new Date().toISOString()
            });
            await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'patients', selectedPatient.id), {
                lastVisit: new Date().toISOString(),
                lastStaff: user.name || 'MediFlow Staff'
            });
            setPrescriptionText('');
            setSelectedPatient(null);
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div className="p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-10">
                <h2 className="text-3xl font-bold text-slate-900">Patient Directory</h2>
                <p className="text-slate-400 font-medium">
                    {user.role === 'doctor' ? 'Your active patient list' : 'Full clinic patient directory'}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {patients.map(p => (
                    <div
                        key={p.id}
                        className="group bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-blue-50/50 hover:border-blue-200 transition-all duration-300 cursor-pointer"
                        onClick={() => setSelectedPatient(p)}
                    >
                        <div className="flex justify-between items-start mb-6">
                            <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center font-bold text-blue-600 text-xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                {p.name?.[0] || 'P'}
                            </div>
                            <div className="bg-slate-50 px-3 py-1 rounded-full text-[10px] font-black uppercase text-slate-400 tracking-widest">
                                Profile
                            </div>
                        </div>
                        <h3 className="font-bold text-xl text-slate-800 mb-1">{p.name}</h3>
                        <p className="text-slate-400 text-sm mb-4 font-medium">
                            {(p.age !== undefined && p.age !== null) ? p.age : 'N/A'} Yrs • {p.gender || 'Not set'}
                        </p>
                        <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                            <span className="text-[10px] font-bold text-slate-300 uppercase">
                                Last: {p.lastVisit ? new Date(p.lastVisit).toLocaleDateString() : 'Never'}
                            </span>
                            <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-blue-600 group-hover:translate-x-1 transition-transform">
                                <ChevronRight size={16} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <Modal isOpen={!!selectedPatient} onClose={() => setSelectedPatient(null)} title={`Clinical Record: ${selectedPatient?.name}`}>
                <div className="space-y-6">
                    <div className="bg-blue-50 p-4 rounded-2xl flex items-start gap-3">
                        <AlertCircle className="text-blue-600 mt-1" size={18} />
                        <p className="text-sm text-blue-800 leading-relaxed font-medium">
                            {user.role === 'doctor'
                                ? 'Entering a new prescription will notify the patient.'
                                : 'Entering clinical notes will be shared with the patient as a formal record.'}
                        </p>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                            {user.role === 'doctor' ? 'Clinical Notes & Prescription' : 'Clinical Visit Notes'}
                        </label>
                        <textarea
                            className="w-full p-5 bg-slate-50 border border-slate-100 rounded-3xl min-h-[180px] outline-none focus:ring-2 focus:ring-blue-500 transition text-slate-700 leading-relaxed"
                            placeholder={user.role === 'doctor' ? "Detailed findings, diagnosis, and medications..." : "Observation notes, instructions, or follow-up details..."}
                            value={prescriptionText}
                            onChange={(e) => setPrescriptionText(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={handlePrescribe}
                        className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 transition"
                    >
                        Save & Finalize Record
                    </button>
                </div>
            </Modal>
        </div>
    );
}