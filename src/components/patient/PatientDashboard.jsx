// src/components/patient/PatientDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../features/auth/AuthProvider';
import { db, collection, query, where, onSnapshot, addDoc, getDocs } from '../../lib/firebase/db';
import { Modal } from '../common/Modal';
import { LoadingScreen } from '../common/LoadingScreen';
import {
    Calendar, Clock, CheckCircle, AlertCircle, Loader2, Activity
} from 'lucide-react';

export default function PatientDashboard() {
    const { user } = useAuth();
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [doctors, setDoctors] = useState([]);
    const [bookingStatus, setBookingStatus] = useState('idle');

    const [selectedDoctorId, setSelectedDoctorId] = useState('');
    const [appDate, setAppDate] = useState('');
    const [appNotes, setAppNotes] = useState('');

    const appId = 'clinic-saas-v1';

    useEffect(() => {
        if (!user?.uid) return;

        const q = query(
            collection(db, 'artifacts', appId, 'public', 'data', 'appointments'),
            where('patientId', '==', user.uid)
        );

        const unsubscribe = onSnapshot(q, (snap) => {
            setAppointments(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            setLoading(false);
        }, (err) => {
            console.error(err);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user]);

    const openModal = async () => {
        setIsModalOpen(true);
        const q = query(collection(db, 'artifacts', appId, 'public', 'data', 'doctors'));
        const snap = await getDocs(q);
        setDoctors(snap.docs.map(d => d.data()));
    };

    const handleRequestAppointment = async () => {
        if (!selectedDoctorId || !appDate) return;
        setBookingStatus('loading');

        try {
            const selectedDoc = doctors.find(d => d.uid === selectedDoctorId);

            await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'appointments'), {
                patientId: user.uid,
                patientName: user.name,
                doctorId: selectedDoctorId,
                doctorName: selectedDoc?.name || 'Unknown Doctor',
                date: appDate,
                notes: appNotes,
                status: 'pending',
                createdAt: new Date().toISOString()
            });

            setBookingStatus('success');
            setTimeout(() => {
                setIsModalOpen(false);
                setBookingStatus('idle');
                setSelectedDoctorId('');
                setAppDate('');
                setAppNotes('');
            }, 2000);
        } catch (e) {
            console.error(e);
            setBookingStatus('idle');
        }
    };

    if (loading) return <LoadingScreen />;

    return (
        <div className="p-8 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-800 p-10 md:p-14 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
                <div className="relative z-10">
                    <h2 className="text-4xl font-black tracking-tight">Welcome, {user?.name || 'Patient'}</h2>
                    <div className="flex items-center gap-4 mt-2">
                        <span className="text-blue-100 text-sm font-bold bg-white/10 px-3 py-1 rounded-full border border-white/5">
                            {(user?.age != null) ? user.age : 'N/A'} Yrs • {user?.gender || 'Not set'}
                        </span>
                    </div>
                    <p className="opacity-80 mt-3 text-lg font-medium max-w-md">
                        Your health dashboard is active. Track your appointments and status here.
                    </p>
                    <div className="mt-8 flex gap-4">
                        <div className="bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/10">
                            <p className="text-[10px] font-bold uppercase opacity-60">Account</p>
                            <p className="font-bold flex items-center gap-2 mt-1">
                                <CheckCircle size={14} className="text-emerald-400" /> Health Verified
                            </p>
                        </div>
                    </div>
                </div>
                <div className="absolute top-[-20%] right-[-10%] w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-1 gap-10">
                <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
                    <div className="flex justify-between items-center mb-10">
                        <h3 className="font-black text-2xl text-slate-800 flex items-center gap-3">
                            <Calendar className="text-blue-600" /> Recent Appointments
                        </h3>
                        <button
                            onClick={openModal}
                            className="bg-blue-50 text-blue-600 px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all"
                        >
                            New Booking
                        </button>
                    </div>

                    <div className="space-y-6">
                        {appointments.map(app => (
                            <div
                                key={app.id}
                                className="group p-6 bg-slate-50/50 rounded-3xl border border-slate-50 flex justify-between items-center hover:bg-white hover:shadow-xl transition-all duration-300"
                            >
                                <div className="flex items-center gap-4">
                                    <div
                                        className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm ${app.status === 'confirmed' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-emerald-600'
                                            }`}
                                    >
                                        <Clock size={24} />
                                    </div>
                                    <div>
                                        <p className="font-extrabold text-slate-800 text-lg">Dr. {app.doctorName}</p>
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

                        {appointments.length === 0 && (
                            <div className="text-center py-20 bg-slate-50/50 rounded-[2rem] border-2 border-dashed border-slate-100">
                                <p className="text-slate-300 font-bold">No appointments found. Start by requesting one!</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Request New Appointment">
                {bookingStatus === 'success' ? (
                    <div className="py-12 flex flex-col items-center text-center animate-in zoom-in-95 duration-300">
                        <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-6">
                            <CheckCircle size={48} />
                        </div>
                        <h4 className="text-2xl font-black text-slate-800 mb-2">Request Sent!</h4>
                        <p className="text-slate-400 font-medium">The clinic has received your request and will confirm shortly.</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Select Doctor</label>
                            <select
                                className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition appearance-none"
                                value={selectedDoctorId}
                                onChange={(e) => setSelectedDoctorId(e.target.value)}
                            >
                                <option value="">Choose a specialist...</option>
                                {doctors.map(d => (
                                    <option key={d.uid} value={d.uid}>Dr. {d.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Preferred Date & Time</label>
                            <input
                                type="datetime-local"
                                className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition"
                                value={appDate}
                                onChange={(e) => setAppDate(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Brief Description</label>
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
        </div>
    );
}