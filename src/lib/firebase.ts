// Firebase entry point

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { collection, getFirestore } from 'firebase/firestore';

import type { FirebaseApp } from 'firebase/app';
import type { Auth } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';

const firebaseConfig = {
   apiKey: process.env.NEXT_PUBLIC_apiKey,
   authDomain: process.env.NEXT_PUBLIC_authDomain,
   projectId: process.env.NEXT_PUBLIC_projectId,
   storageBucket: process.env.NEXT_PUBLIC_storageBucket,
   messagingSenderId: process.env.NEXT_PUBLIC_messagingSenderId,
   appId: process.env.NEXT_PUBLIC_appId,
   measurementId: process.env.NEXT_PUBLIC_measurementId
};

interface InitializeFirebaseAppType {
   firebaseApp: FirebaseApp;
   firebaseAuth: Auth;
   firebaseStore: Firestore;
}

function initializeFirebaseApp(): InitializeFirebaseAppType {
   const firebaseApp: FirebaseApp = initializeApp(firebaseConfig);
   const firebaseAuth: Auth = getAuth(firebaseApp);
   const firebaseStore: Firestore = getFirestore(firebaseApp);

   return {
      firebaseApp,
      firebaseAuth,
      firebaseStore
   };
}

export const firebase: InitializeFirebaseAppType = initializeFirebaseApp();

// collections

export const articlesColRef = collection(firebase.firebaseStore, 'articles');
export const callsColRef = collection(firebase.firebaseStore, 'calls');
export const emblemsColRef = collection(firebase.firebaseStore, 'emblems');
export const globalColRef = collection(firebase.firebaseStore, 'global');
export const legalColRef = collection(firebase.firebaseStore, 'legal');
export const membersColRef = collection(firebase.firebaseStore, 'members');
export const tempMembersColRef = collection(firebase.firebaseStore, 'temp_members');
export const vehiclesColRef = collection(firebase.firebaseStore, 'vehicles');
export const paymentsColRef = collection(firebase.firebaseStore, 'payments');
