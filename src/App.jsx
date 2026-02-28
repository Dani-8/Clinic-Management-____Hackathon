import { useState } from 'react'// instead of old imports
import { app } from './lib/firebase/app';
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from './lib/firebase/auth';
import { db, doc, setDoc, getDoc, collection, addDoc, getDocs, query, orderBy, where, onSnapshot, updateDoc, deleteDoc } from './lib/firebase/db';
import { generateClinicalPDF } from './lib/pdf/generateClinicalPDF';
import { Modal } from './components/common/Modal';
import { LoadingScreen } from './components/common/LoadingScreen';
import { Sidebar } from './components/common/Sidebar';


import './App.css'

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
