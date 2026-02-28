// src/components/admin/StaffDirectory.jsx
import React, { useState, useEffect } from 'react';
import { db, collection, query, onSnapshot } from '../../lib/firebase/db';
import { Activity, Stethoscope, ShieldCheck, User as UserIcon, Loader2 } from 'lucide-react';

export default function StaffDirectory() {
    const [staff, setStaff] = useState([]);
    const [loading, setLoading] = useState(true);

    const appId = 'clinic-saas-v1';

    useEffect(() => {
        const q = query(collection(db, 'artifacts', appId, 'public', 'data', 'staff'));
        const unsubscribe = onSnapshot(q, (snap) => {
            const staffList = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setStaff(staffList);
            setLoading(false);
        }, (err) => {
            console.error("Staff fetch error:", err);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return (
        <div className="p-8 animate-in fade-in duration-500">
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-slate-900">Clinical Staff</h2>
                <p className="text-slate-400 font-medium">Directory of active personnel</p>
            </div>

            {loading ? (
                <div className="p-20 flex justify-center">
                    <Loader2 className="animate-spin text-blue-600" size={40} />
                </div>
            ) : staff.length === 0 ? (
                <div className="text-center py-40 bg-slate-50/50 rounded-[3rem] border-2 border-dashed border-slate-100">
                    <Activity size={48} className="mx-auto text-slate-200 mb-6" />
                    <p className="text-slate-400 font-bold text-xl">
                        Staff list empty. Register users as Doctors/Staff to see them here.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {staff.map(s => (
                        <div
                            key={s.id}
                            className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4 hover:border-blue-200 transition-all cursor-default"
                        >
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black ${s.role === 'doctor' ? 'bg-blue-50 text-blue-600' :
                                    s.role === 'admin' ? 'bg-indigo-50 text-indigo-600' :
                                        'bg-amber-50 text-amber-600'
                                }`}>
                                {s.role === 'doctor' ? <Stethoscope size={20} /> :
                                    s.role === 'admin' ? <ShieldCheck size={20} /> :
                                        <UserIcon size={20} />}
                            </div>
                            <div>
                                <p className="font-bold text-slate-800">
                                    {s.role === 'doctor' ? `Dr. ${s.name}` : s.name}
                                </p>
                                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">{s.role}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}