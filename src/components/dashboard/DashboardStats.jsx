// src/components/dashboard/DashboardStats.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import {
    Stethoscope, Calendar, TrendingUp, Users, Activity, UserCheck
} from 'lucide-react';
import { useAuth } from '../../features/auth/AuthProvider';
import { db, collection, onSnapshot, query, where } from '../../lib/firebase/db';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function DashboardStats() {
    const { user } = useAuth();
    const [data, setData] = useState({
        specialists: 0, appointments: 0, revenue: 0, patients: 0,
        dailyLabels: [], dailyValues: []
    });

    const appId = 'clinic-saas-v1'; // ← keep hardcoded or move to env/const later

    useEffect(() => {
        if (!user) return;

        if (user.role === 'admin') {
            let specialistsCount = 0, patientsCount = 0, appointmentsCount = 0;

            const update = () => {
                setData({
                    specialists: specialistsCount,
                    patients: patientsCount,
                    appointments: appointmentsCount,
                    revenue: appointmentsCount * 50,
                    dailyLabels: ['Specialists', 'Appointments', 'Patients'],
                    dailyValues: [specialistsCount, appointmentsCount, patientsCount]
                });
            };

            onSnapshot(collection(db, 'artifacts', appId, 'public', 'data', 'doctors'), snap => {
                specialistsCount = snap.size; update();
            });
            onSnapshot(collection(db, 'artifacts', appId, 'public', 'data', 'patients'), snap => {
                patientsCount = snap.size; update();
            });
            onSnapshot(collection(db, 'artifacts', appId, 'public', 'data', 'appointments'), snap => {
                appointmentsCount = snap.size; update();
            });
        }

        if (user.role === 'doctor') {
            const q = query(
                collection(db, 'artifacts', appId, 'public', 'data', 'appointments'),
                where('doctorId', '==', user.uid)
            );
            onSnapshot(q, snap => {
                const myAppts = snap.docs.map(d => d.data());
                const myPatientIds = [...new Set(myAppts.map(a => a.patientId))];

                const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                const dayCounts = Array(7).fill(0);
                myAppts.forEach(a => {
                    const d = new Date(a.date).getDay();
                    dayCounts[d]++;
                });

                setData({
                    specialists: 1,
                    appointments: myAppts.length,
                    revenue: myAppts.length * 40,
                    patients: myPatientIds.length,
                    dailyLabels: days,
                    dailyValues: dayCounts
                });
            });
        }
    }, [user]);

    const kpis = useMemo(() => {
        if (user?.role === 'admin') {
            return [
                { label: 'Specialists', value: data.specialists, icon: Stethoscope },
                { label: 'Appointments', value: data.appointments, icon: Calendar },
                { label: 'Revenue', value: `$${data.revenue}`, icon: TrendingUp },
                { label: 'Patient Base', value: data.patients, icon: Users }
            ];
        }
        return [
            { label: 'My Patients', value: data.patients, icon: UserCheck },
            { label: 'Total Appointments', value: data.appointments, icon: Calendar },
            { label: 'Total Earnings', value: `$${data.revenue}`, icon: TrendingUp },
            { label: 'Patient Selects', value: data.patients > 0 ? 'High' : 'N/A', icon: Activity }
        ];
    }, [user?.role, data]);

    // Paste your original return JSX here (the grid of cards + Bar chart)
    return (
        <div className="p-8 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* ... your original dashboard JSX ... */}
        </div>
    );
}