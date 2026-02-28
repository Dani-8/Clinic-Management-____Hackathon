import { initializeApp } from "firebase/app";

const firebaseConfig = typeof __firebase_config !== 'undefined'
    ? JSON.parse(__firebase_config)
    : {
        apiKey: "AIzaSyD_HKb4AcjHsrXns-GI8z-c3Io8qRQJHxU",
        authDomain: "clinic-management-75be7.firebaseapp.com",
        projectId: "clinic-management-75be7",
        storageBucket: "clinic-management-75be7.firebasestorage.app",
        messagingSenderId: "906330106874",
        appId: "1:906330106874:web:5a272349201c14b47d5243",
        measurementId: "G-18QSN9JMVH"
    };

const app = initializeApp(firebaseConfig);

export { app };