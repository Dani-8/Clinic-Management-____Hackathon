import React, { useState, useEffect } from 'react';
import { useAuth } from '../../features/auth/AuthProvider';
import {
    db, collection, query, orderBy, where, onSnapshot, addDoc, updateDoc, deleteDoc, doc, getDocs
} from '../../lib/firebase/db';

import { Modal } from '../common/Modal';
import { Calendar, Plus, Check, XCircle, Loader2, Clock } from 'lucide-react';

// ===========================================================
// ===========================================================
// ===========================================================

export default function AppointmentManager() {
    const { user } = useAuth();
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [doctors, setDoctors] = useState([]);
    const [patients, setPatients] = useState([]);
    const [formData, setFormData] = useState({ patientId: '', doctorId: '', date: '', notes: '' });
    const [submitting, setSubmitting] = useState(false);

    const appId = 'clinic-saas-v1';

    useEffect(() => {
        let q = query(
            collection(db, 'artifacts', appId, 'public', 'data', 'appointments'),
            orderBy('date', 'desc')
        );

        if (user.role === 'doctor') {
            q = query(q, where('doctorId', '==', user.uid));
        }

        const unsubscribe = onSnapshot(q, (snap) => {
            let data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            if (user.role === 'doctor') {
                data = data.sort((a, b) => new Date(b.date) - new Date(a.date));
            }

            setAppointments(data);
            setLoading(false);
        }, (err) => {
            console.error(err);
            setLoading(false);
        });


        return () => unsubscribe();
    }, [user]);

    const openNewAppModal = async () => {
        setIsModalOpen(true);
        const docQuery = query(collection(db, 'artifacts', appId, 'public', 'data', 'doctors'))
        const patQuery = query(collection(db, 'artifacts', appId, 'public', 'data', 'patients'))
        const [docSnap, patSnap] = await Promise.all([getDocs(docQuery), getDocs(patQuery)])

        setDoctors(docSnap.docs.map(d => d.data()));
        setPatients(patSnap.docs.map(p => ({ id: p.id, ...p.data() })));
    };

    const handleUpdateStatus = async (id, status) => {
        try {
            if (status === 'declined') {
                await deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', 'appointments', id));
            } else {
                await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'appointments', id), { status });
            }
        } catch (e) {
            console.error(e);
        }
    };

    
    const handleCreateAppointment = async () => {
        if (!formData.patientId || !formData.doctorId || !formData.date) return;
        setSubmitting(true);

        try {
            const selectedDoc = doctors.find(d => d.uid === formData.doctorId);
            const selectedPat = patients.find(p => p.id === formData.patientId);

            await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'appointments'), {
                patientId: formData.patientId,
                patientName: selectedPat?.name || 'Unknown',
                doctorId: formData.doctorId,
                doctorName: selectedDoc?.name || 'Unknown',
                date: formData.date,
                notes: formData.notes,
                status: 'confirmed',
                createdAt: new Date().toISOString()
            });

            setIsModalOpen(false);
            setFormData({ patientId: '', doctorId: '', date: '', notes: '' });
        } catch (e) {
            console.error(e);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="p-20 flex justify-center"><Loader2 className="animate-spin text-blue-600" size={40} /></div>;

    return (
        <div className="p-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h2 className="text-3xl font-bold text-slate-900">
                        {user.role === 'doctor' ? 'My Schedule' : 'Clinic Schedule'}
                    </h2>
                    <p className="text-slate-400 font-medium">
                        {user.role === 'doctor' ? 'Manage your upcoming consultations' : 'Manage patient traffic and bookings'}
                    </p>
                </div>
                {(user.role === 'receptionist' || user.role === 'admin') && (
                    <button
                        onClick={openNewAppModal}
                        className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold text-sm flex items-center gap-2 shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all"
                    >
                        <Plus size={20} /> New Appointment
                    </button>
                )}
            </div>

            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50/80 border-b border-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
                            <tr>
                                <th className="p-8">Patient Name</th>
                                <th className="p-8">Doctor</th>
                                <th className="p-8">Date / Time</th>
                                <th className="p-8">Status</th>
                                {(user.role === 'receptionist' || user.role === 'admin') && <th className="p-8">Actions</th>}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {appointments.map(app => (
                                <tr key={app.id} className="hover:bg-slate-50/30 transition-colors">
                                    <td className="p-8 font-bold text-slate-800">{app.patientName}</td>
                                    <td className="p-8 text-slate-500 font-medium">Dr. {app.doctorName}</td>
                                    <td className="p-8 text-slate-500 font-medium">
                                        {new Date(app.date).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                                    </td>
                                    <td className="p-8">
                                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${app.status === 'confirmed' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                                            }`}>
                                            {app.status}
                                        </span>
                                    </td>
                                    {(user.role === 'receptionist' || user.role === 'admin') && (
                                        <td className="p-8">
                                            {app.status === 'pending' ? (
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleUpdateStatus(app.id, 'confirmed')}
                                                        className="p-2 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-all"
                                                    >
                                                        <Check size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleUpdateStatus(app.id, 'declined')}
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

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Manual Booking">
                <div className="space-y-5">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Patient</label>
                        <select
                            className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none"
                            value={formData.patientId}
                            onChange={e => setFormData({ ...formData, patientId: e.target.value })}
                        >
                            <option value="">Select Patient...</option>
                            {patients.map(p => (
                                <option key={p.id} value={p.id}>{p.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Assign Doctor</label>
                        <select
                            className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none"
                            value={formData.doctorId}
                            onChange={e => setFormData({ ...formData, doctorId: e.target.value })}
                        >
                            <option value="">Select Specialist...</option>
                            {doctors.map(d => (
                                <option key={d.uid} value={d.uid}>Dr. {d.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Date & Time</label>
                        <input
                            type="datetime-local"
                            className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none"
                            value={formData.date}
                            onChange={e => setFormData({ ...formData, date: e.target.value })}
                        />
                    </div>

                    <button
                        disabled={submitting}
                        onClick={handleCreateAppointment}
                        className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold shadow-lg mt-4 disabled:opacity-50"
                    >
                        {submitting ? 'Processing...' : 'Book Appointment'}
                    </button>
                </div>
            </Modal>
        </div>
    );
}