// src/features/auth/LoginForm.jsx
import React, { useState } from 'react';
import {
    auth,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword
} from '../../lib/firebase/auth';
import { db, doc, setDoc } from '../../lib/firebase/db';
import { Activity, AlertCircle, Loader2 } from 'lucide-react';

export default function LoginForm() {
    // console.log("Auth instance:", auth); // should NOT be undefined
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [role, setRole] = useState('patient');
    const [gender, setGender] = useState('Not set');
    const [birthDate, setBirthDate] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const appId = 'clinic-saas-v1';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (isLogin) {
                await signInWithEmailAndPassword(auth, email, password);
            } else {
                const res = await createUserWithEmailAndPassword(auth, email, password);
                const age = birthDate
                    ? Math.floor((new Date() - new Date(birthDate).getTime()) / 3.15576e+10)
                    : 'N/A';

                const profileData = {
                    uid: res.user.uid,
                    name,
                    email,
                    role,
                    gender,
                    birthDate,
                    age,
                    createdAt: new Date().toISOString()
                };

                await setDoc(doc(db, 'artifacts', appId, 'users', res.user.uid, 'profile', 'data'), profileData);

                if (role !== 'patient') {
                    await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'staff', res.user.uid), {
                        uid: res.user.uid,
                        name,
                        role,
                        email
                    });
                }

                if (role === 'doctor') {
                    await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'doctors', res.user.uid), {
                        uid: res.user.uid,
                        name,
                        role: 'doctor'
                    });
                }

                if (role === 'patient') {
                    await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'patients', res.user.uid), {
                        id: res.user.uid,
                        name,
                        role: 'patient',
                        gender,
                        age,
                        createdAt: new Date().toISOString()
                    });
                }
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#f0f4f8] font-sans p-4">
            <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-2xl w-full max-w-md border border-white/20">
                <div className="flex flex-col items-center mb-10">
                    <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-4 shadow-xl shadow-blue-200">
                        <Activity className="text-white" size={32} />
                    </div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">MediFlow Pro</h1>
                    <p className="text-slate-500 font-medium mt-2">
                        {isLogin ? 'Welcome back' : 'Start your practice'}
                    </p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-xs mb-6 border border-red-100 flex items-center gap-2">
                        <AlertCircle size={14} /> {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {!isLogin && (
                        <>
                            <input
                                type="text"
                                placeholder="Full Name"
                                className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                            <div className="grid grid-cols-2 gap-2">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Gender</label>
                                    <select
                                        className="w-full p-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm outline-none"
                                        value={gender}
                                        onChange={(e) => setGender(e.target.value)}
                                    >
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Birth Date</label>
                                    <input
                                        type="date"
                                        className="w-full p-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm outline-none"
                                        value={birthDate}
                                        onChange={(e) => setBirthDate(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Account Type</label>
                                <select
                                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition appearance-none"
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                >
                                    <option value="patient">Patient</option>
                                    <option value="doctor">Doctor</option>
                                    <option value="receptionist">Receptionist</option>
                                    <option value="admin">Clinic Admin</option>
                                </select>
                            </div>
                        </>
                    )}

                    <input
                        type="email"
                        placeholder="Email"
                        className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <button
                        disabled={loading}
                        type="submit"
                        className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-100 disabled:opacity-50 mt-4 flex items-center justify-center gap-2"
                    >
                        {loading && <Loader2 size={18} className="animate-spin" />}
                        {loading ? 'Processing...' : isLogin ? 'Sign In' : 'Create Account'}
                    </button>
                </form>

                <button
                    onClick={() => setIsLogin(!isLogin)}
                    className="w-full mt-8 text-slate-400 text-sm font-medium hover:text-blue-600 transition"
                >
                    {isLogin ? "Don't have an account? Register" : "Already registered? Sign in"}
                </button>
            </div>
        </div>
    );
}