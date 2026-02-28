// src/features/auth/LoginForm.jsx
import React, { useState } from 'react';
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword
} from '../../lib/firebase/auth';
import { db, doc, setDoc } from '../../lib/firebase/db';
import { Activity, AlertCircle, Loader2 } from 'lucide-react';

export default function LoginForm() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [role, setRole] = useState('patient');
    const [gender, setGender] = useState('Not set');
    const [birthDate, setBirthDate] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const appId = 'clinic-saas-v1'; // ← still hardcoded, later can come from env or context

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (isLogin) {
                await signInWithEmailAndPassword(email, password);
            } else {
                const res = await createUserWithEmailAndPassword(email, password);
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

                // Create public records depending on role
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
                {/* ... rest of your login UI code remains exactly the same ... */}
                {/* paste your original LoginView JSX content here */}
                {/* (form, inputs, button, error display, toggle link) */}
            </div>
        </div>
    );
}