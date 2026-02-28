// src/features/auth/AuthProvider.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from '../../lib/firebase/auth';
import { db, doc, getDoc } from '../../lib/firebase/db';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged((firebaseUser) => {
            if (firebaseUser) {
                // Try to get extended profile
                const profileRef = doc(db, 'artifacts', 'clinic-saas-v1', 'users', firebaseUser.uid, 'profile', 'data');
                getDoc(profileRef)
                    .then((snap) => {
                        if (snap.exists()) {
                            setUser({ ...firebaseUser, ...snap.data() });
                        } else {
                            setUser({
                                uid: firebaseUser.uid,
                                email: firebaseUser.email,
                                name: firebaseUser.displayName || 'User',
                                role: 'patient'
                            });
                        }
                    })
                    .catch((err) => {
                        console.error("Profile fetch error:", err);
                        setUser({
                            uid: firebaseUser.uid,
                            email: firebaseUser.email,
                            name: 'User',
                            role: 'patient'
                        });
                    })
                    .finally(() => setLoading(false));
            } else {
                setUser(null);
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);