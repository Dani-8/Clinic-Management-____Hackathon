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

    const appId = 'clinic-saas-v1';

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

    return (
        <div className="p-8 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {kpis.map((stat, i) => (
                    <div
                        key={i}
                        className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm group hover:bg-blue-600 transition-all duration-300"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <stat.icon size={20} className="text-blue-600 group-hover:text-white transition-colors" />
                        </div>
                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2 group-hover:text-blue-100 transition-colors">
                            {stat.label}
                        </p>
                        <p className="text-3xl font-black text-slate-900 group-hover:text-white transition-colors">
                            {stat.value}
                        </p>
                    </div>
                ))}
            </div>

            <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
                <h3 className="font-black text-2xl text-slate-800 mb-8 flex items-center gap-3">
                    <Activity size={24} className="text-blue-600" />
                    {user.role === 'admin' ? 'Clinic Overview' : 'Weekly Engagement'}
                </h3>
                <div className="h-[350px]">
                    <Bar
                        data={{
                            labels: data.dailyLabels.length > 0 ? data.dailyLabels : ['Jan', 'Feb', 'Mar'],
                            datasets: [{
                                label: user.role === 'admin' ? 'Clinic Metrics' : 'Appointments',
                                data: data.dailyValues.length > 0 ? data.dailyValues : [0, 0, 0],
                                backgroundColor: ['#3b82f6', '#818cf8', '#6366f1', '#4f46e5', '#4338ca', '#3730a3', '#312e81'],
                                borderRadius: 16
                            }]
                        }}
                        options={{
                            maintainAspectRatio: false,
                            plugins: { legend: { display: false } },
                            scales: {
                                y: { border: { display: false }, grid: { color: '#f1f5f9' }, beginAtZero: true },
                                x: { border: { display: false }, grid: { display: false } }
                            }
                        }}
                    />
                </div>
            </div>
        </div>
    );
}