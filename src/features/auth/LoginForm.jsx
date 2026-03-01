import React, { useState } from 'react';
import { 
  Activity, 
  AlertCircle, 
  Loader2, 
  Mail, 
  Lock, 
  User, 
  ChevronRight,
  Stethoscope
} from 'lucide-react';
import {
    auth,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword
} from '../../lib/firebase/auth';
import { db, doc, setDoc } from '../../lib/firebase/db';

export default function LoginForm() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [role, setRole] = useState('patient');
    const [gender, setGender] = useState('Male');
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
            setError(err.message.replace('Firebase: ', ''));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-white font-sans overflow-hidden">
            {/* Left Branding Panel */}
            <div className="hidden lg:flex lg:w-1/2 bg-blue-600 relative items-center justify-center p-12">
                <div className="relative z-10 text-white max-w-lg">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl">
                            <Stethoscope size={32} />
                        </div>
                        <span className="text-2xl font-bold tracking-tight">Clinic Management</span>
                    </div>
                    <h1 className="text-5xl font-extrabold leading-tight mb-6">Seamless Healthcare Management.</h1>
                    <p className="text-blue-100 text-lg mb-8">The all-in-one platform for clinics, doctors, and patients to streamline appointments, records, and communication.</p>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/10">
                            <h3 className="font-bold text-xl">99.9%</h3>
                            <p className="text-blue-200 text-sm">Uptime</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/10">
                            <h3 className="font-bold text-xl">Secure</h3>
                            <p className="text-blue-200 text-sm">Data Protection</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Form Panel */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-slate-50/50">
                <div className="w-full max-w-md">
                    <div className="mb-10 text-center lg:text-left">
                        <h2 className="text-3xl font-bold text-slate-900">{isLogin ? 'Welcome Back' : 'Join Our Network'}</h2>
                        <p className="text-slate-500 mt-2 font-medium">{isLogin ? 'Sign in to access your account' : 'Register to start managing your health journey.'}</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3 text-red-600 text-sm">
                            <AlertCircle size={18} className="shrink-0 mt-0.5" />
                            <p>{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {!isLogin && (
                            <div className="space-y-4">
                                <div className='space-y-1.5'>
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">Your Name</label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                        <input
                                            type="text"
                                            placeholder="Full Name"
                                            className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition shadow-sm"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="inline-block text-xs font-bold text-slate-400 uppercase tracking-wider px-1">Gender</label>
                                        <select
                                            className="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-blue-500 shadow-sm appearance-none"
                                            value={gender}
                                            onChange={(e) => setGender(e.target.value)}
                                        >
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="inline-block text-xs font-bold text-slate-400 uppercase tracking-wider px-1">Birth Date</label>
                                        <input
                                            type="date"
                                            className="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                                            value={birthDate}
                                            onChange={(e) => setBirthDate(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="inline-block text-xs font-bold text-slate-400 uppercase tracking-wider px-1">Role</label>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                        {['patient', 'doctor', 'receptionist', 'admin'].map((r) => (
                                            <button
                                                key={r}
                                                type="button"
                                                onClick={() => setRole(r)}
                                                className={`py-2 text-[11px] font-bold uppercase tracking-tighter rounded-xl border transition duration-500 cursor-pointer ${
                                                    role === r 
                                                    ? 'bg-blue-600 border-blue-600 text-white shadow-md' 
                                                    : 'bg-white border-slate-200 text-slate-500 hover:border-blue-300'
                                                }`}
                                            >
                                                {r}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="email"
                                placeholder="Email Address"
                                className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition shadow-sm"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="password"
                                placeholder="Password"
                                className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition shadow-sm"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <button
                            disabled={loading}
                            type="submit"
                            className="cursor-pointer w-full bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-700 transition duration-300 shadow-xl shadow-blue-200 hover:shadow-blue-300 disabled:opacity-50 mt-6 flex items-center justify-center gap-2 group active:scale-[0.95]"
                        >
                            {loading ? <Loader2 size={20} className="animate-spin" /> : (
                                <>{isLogin ? 'Sign In' : 'Create Account'} <ChevronRight size={18} /></>
                            )}
                        </button>
                    </form>


                    <div className="mt-8 pt-8 border-t border-slate-200 text-center">
                        <p className="text-slate-500 text-sm font-medium">
                            {isLogin ? "Don't have an account yet?" : "Already have an account?"}
                            <button
                                onClick={() => setIsLogin(!isLogin)}
                                className="ml-2 text-blue-600 font-bold hover:underline cursor-pointer"
                            >
                                {isLogin ? 'Register Now' : 'Log In'}
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}