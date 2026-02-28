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
        if (!user || user.role !== 'doctor') return;

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

            const patQ = collection(db, 'artifacts', appId, 'public', 'data', 'patients');
            onSnapshot(patQ, pSnap => {
                const all = pSnap.docs.map(d => ({ id: d.id, ...d.data() }));
                setPatients(all.filter(p => myPatientIds.includes(p.id)));
            });
        });

        return () => unsubscribe();
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

    // Paste your original return JSX here (patient cards grid + Modal)
    return (
        <div className="p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* ... your original patient list + modal JSX ... */}
        </div>
    );
}