import { getFirestore, doc, setDoc, getDoc, collection, addDoc, getDocs, query, orderBy, where, onSnapshot, updateDoc, deleteDoc } from "firebase/firestore";
import { app } from "./app";

const db = getFirestore(app);

export {
    db,
    doc, setDoc, getDoc, collection, addDoc, getDocs, query, orderBy, where, onSnapshot, updateDoc, deleteDoc
};