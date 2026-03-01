// src/components/common/HeaderUserInfo.jsx
import React from 'react';
import { User as UserIcon, LogOut } from 'lucide-react';
import { useAuth } from '../../features/auth/AuthProvider';
import { signOut } from '../../lib/firebase/auth';

export default function HeaderUserInfo() {
    const { user } = useAuth();

    return (
        <div className="flex items-center gap-5 animate-in slide-in-from-right-4 duration-300">
            <div className="text-right hidden md:block">
                <p className="text-sm font-black text-slate-900 leading-none">{user?.name || 'User'}</p>
                <p className="text-[10px] text-blue-600 font-bold uppercase tracking-wider mt-1">
                    {user?.role || 'Patient'}
                </p>
            </div>
            <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 border border-slate-100 shadow-sm">
                <UserIcon size={24} />
            </div>
        </div>
    );
}