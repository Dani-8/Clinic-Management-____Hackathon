import React from 'react';

import {
    LayoutDashboard, Users, Calendar, FileText, LogOut, Activity
} from 'lucide-react';

import { auth, signOut } from '../../lib/firebase/auth';




export default function Sidebar({ role, activeTab, setActiveTab }) {
    const menuGroups = {
        admin: [
            { id: 'Dashboard', icon: LayoutDashboard },
            { id: 'Staff', icon: Users }
        ],
        doctor: [
            { id: 'Dashboard', icon: LayoutDashboard },
            { id: 'Patients', icon: FileText },
            { id: 'Appointments', icon: Calendar }
        ],
        receptionist: [
            { id: 'Appointments', icon: Calendar },
            { id: 'Patients', icon: Users }
        ],
        patient: [
            { id: 'Dashboard', icon: LayoutDashboard },
            { id: 'Prescriptions', icon: FileText }
        ]
    };

    const menuItems = menuGroups[role] || [];

    return (
        <aside className="w-72 bg-white border-r border-slate-100 h-screen sticky top-0 flex flex-col p-8">
            <div className="flex items-center gap-3 mb-12">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-100">
                    <Activity className="text-white" size={20} />
                </div>
                <span className="font-black text-slate-900 text-xl tracking-tighter uppercase">Clinic <span className='text-blue-600'>Connect</span></span>
            </div>

            <nav className="flex-1 space-y-2">
                {menuItems.map(item => (
                    <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-200 font-semibold text-sm duration-300 active:scale-[0.95] ${activeTab === item.id
                                ? 'bg-blue-600 text-white shadow-xl shadow-blue-100'
                                : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600 cursor-pointer'
                            }`}
                    >
                        <item.icon size={20} />
                        {item.id}
                    </button>
                ))}
            </nav>

            <button
                onClick={() => signOut(auth)}
                className="cursor-pointer flex items-center gap-4 px-5 py-4 text-slate-400 rounded-2xl hover:text-red-500 hover:bg-red-100/60 transition-colors text-sm font-bold mt-auto  active:scale-[0.95]"
            >
                <LogOut size={20} />
                Logout
            </button>
        </aside>
    );
}