// src/components/patient/PatientDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../features/auth/AuthProvider';
import { db, collection, query, where, onSnapshot, addDoc, getDocs } from '../../lib/firebase/db';
import { Modal } from '../common/Modal';
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

    if (loading) return <div>Loading appointments...</div>; // you can use LoadingScreen here

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
                    {/* ... rest of the welcome banner ... */}
                </div>
                {/* decorative blob */}
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
                            <div key={app.id} className="group p-6 bg-slate-50/50 rounded-3xl border border-slate-50 flex justify-between items-center hover:bg-white hover:shadow-xl transition-all duration-300">
                                {/* ... appointment card content ... */}
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

            {/* Booking Modal */}
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
                        {/* doctor select, date input, notes textarea, submit button */}
                        {/* ... paste your original modal form content here ... */}
                    </div>
                )}
            </Modal>
        </div>
    );
}