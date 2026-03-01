import React, { useState, useEffect } from 'react';


import { getAuth } from 'firebase/auth';
import { app } from './lib/firebase/app';
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from './lib/firebase/auth';
import { db, doc, setDoc, getDoc, collection, addDoc, getDocs, query, orderBy, where, onSnapshot, updateDoc, deleteDoc } from './lib/firebase/db';

import { generateClinicalPDF } from './lib/pdf/generateClinicalPDF';

import { Modal } from './components/common/Modal';
import { LoadingScreen } from './components/common/LoadingScreen';
import Sidebar from './components/common/Sidebar';
import HeaderUserInfo from './components/common/HeaderUserInfo';

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
  if (!user) return <LoginForm />;


  const renderScreen = () => {
    switch (user.role) {
      case 'admin':
        return activeTab === 'Dashboard' ? <DashboardStats /> : <StaffDirectory />;
      case 'doctor':
        if (activeTab === 'Dashboard') return <DashboardStats />;
        if (activeTab === 'Patients') return <MyPatients />;
        return <AppointmentManager />;
      case 'receptionist':
        return activeTab === 'Appointments' ? <AppointmentManager /> : <MyPatients />;
      case 'patient':
        return activeTab === 'Dashboard' ? <PatientDashboard /> : <PatientRecords />;
      default:
        return (
          <div className="p-20 text-center text-slate-500 font-bold">
            Access Denied
          </div>
        );
    }
  }



  return (
    <div className="flex bg-[#fbfcfd] min-h-screen">
      <Sidebar
        role={user.role}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      <main className="flex-1 overflow-y-auto h-screen">

        <header className="h-24 bg-white/80 backdrop-blur-md border-b border-slate-50 px-10 flex justify-between items-center sticky top-0 z-40">
          <div className="animate-in slide-in-from-left-4 duration-300">
            <h1 className="text-slate-700 font-extrabold text-lg uppercase">
              {activeTab}
            </h1>
          </div>
          <HeaderUserInfo />
        </header>

        <div className="max-w-7xl mx-auto">
          {renderScreen()}
        </div>

      </main>
    </div>
  );
}

// ===================================================================================

export default function App() {
  return (

    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
