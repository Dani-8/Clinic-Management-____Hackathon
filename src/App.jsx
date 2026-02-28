import React, { useState, useEffect } from 'react';


import { app } from './lib/firebase/app';
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from './lib/firebase/auth';
import { db, doc, setDoc, getDoc, collection, addDoc, getDocs, query, orderBy, where, onSnapshot, updateDoc, deleteDoc } from './lib/firebase/db';

import { generateClinicalPDF } from './lib/pdf/generateClinicalPDF';

import { Modal } from './components/common/Modal';
import { LoadingScreen } from './components/common/LoadingScreen';
import { Sidebar } from './components/common/Sidebar';

import PatientDashboard from './components/patient/PatientDashboard';
import PatientRecords from './components/patient/PatientRecords';
import StaffDirectory from './components/admin/StaffDirectory';

import DashboardStats from './components/dashboard/DashboardStats';

import MyPatients from './components/doctor/MyPatients';

import AppointmentManager from './components/receptionist/AppointmentManager';


import { AuthProvider, useAuth } from './features/auth/AuthProvider';
import LoginForm from './features/auth/LoginForm';



import './App.css'

// ===================================================================================
// ===================================================================================
// ===================================================================================




function AppContent() {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('Dashboard');

  useEffect(() => {
    if (user?.role === 'receptionist') setActiveTab('Appointments');
  }, [user]);

  if (loading) return <LoadingScreen />;
  if (!user) return <LoginForm />;   // ← make sure you import LoginForm

  const renderScreen = () => {
    if (user.role === 'admin') {
      return activeTab === 'Dashboard' ? <DashboardStats /> : <StaffDirectory />;
    }
    if (user.role === 'doctor') {
      if (activeTab === 'Dashboard') return <DashboardStats />;
      if (activeTab === 'Patients') return <MyPatients />;
      return <AppointmentManager />;
    }
    if (user.role === 'receptionist') {
      return activeTab === 'Appointments' ? <AppointmentManager /> : <MyPatients />;
    }
    if (user.role === 'patient') {
      return activeTab === 'Dashboard' ? <PatientDashboard /> : <PatientRecords />;
    }
    return <div className="p-20 text-center">Access Denied</div>;
  };

  return (
    <div className="flex bg-[#fbfcfd] min-h-screen">
      <Sidebar role={user.role} activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 overflow-y-auto h-screen">
        <header className="h-24 bg-white/80 backdrop-blur-md border-b border-slate-50 px-10 flex justify-between items-center sticky top-0 z-40">
          <div className="animate-in slide-in-from-left-4 duration-300">
            <h1 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">{activeTab}</h1>
            <p className="text-slate-900 font-extrabold text-lg">Practice Management</p>
            <HeaderUserInfo />
          </div>
          <div className="flex items-center gap-5 animate-in slide-in-from-right-4 duration-300">
            <div className="text-right hidden md:block">
              <p className="text-sm font-black text-slate-900 leading-none">{user?.name || 'User'}</p>
              <p className="text-[10px] text-blue-600 font-bold uppercase tracking-wider mt-1">{user?.role || 'Patient'}</p>
            </div>
            <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 border border-slate-100 shadow-sm">
              {/* You can later extract this to HeaderUserInfo.jsx if you want */}
              <UserIcon size={24} />
            </div>
          </div>
        </header>
        <div className="max-w-7xl mx-auto">
          {renderScreen()}
        </div>
      </main>
    </div>
  );
}

// ===================================================================================
// ===================================================================================
// ===================================================================================
// export default function App() {
//   return (
//     <AuthProvider>
//       <AppContent />
//     </AuthProvider>
//   );
// }
// ===================================================================================
// ===================================================================================
// ===================================================================================

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <p className="text-center text-lg font-semibold text-rose-500 mt-60">
        Project is in development, pls wait for the next commit, thanks you
      </p>
    </>
  )
}

export default App
