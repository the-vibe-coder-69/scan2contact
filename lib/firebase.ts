// lib/firebase.ts
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';


const firebaseConfig = {

    apiKey: "AIzaSyAgeYUJhOHRe9uBXuoN5Xjwb8l4PDjJ1pw",
  
    authDomain: "contact-snap.firebaseapp.com",
  
    projectId: "contact-snap",
  
    storageBucket: "contact-snap.firebasestorage.app",
  
    messagingSenderId: "850462001681",
  
    appId: "1:850462001681:web:5f397c0b281f409b2c3fb0",
  
    measurementId: "G-JVGXTB0VNC"
  
  };
  
  

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };



// rules_version = '2';


// service cloud.firestore {

//   match /databases/{database}/documents {

//     match /{document=**} {

//       allow read, write: if false;

//     }

//   }

// }