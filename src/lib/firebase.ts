// Firebase entry point

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { collection, doc, getDoc, getFirestore } from 'firebase/firestore';

import type { FirebaseApp } from 'firebase/app';
import type { Auth } from 'firebase/auth';
import type { CollectionReference, DocumentData, Firestore } from 'firebase/firestore';

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
   fireStorage: FirebaseStorage;
}

function initializeFirebaseApp(): InitializeFirebaseAppType {
   const firebaseApp: FirebaseApp = initializeApp(firebaseConfig);
   const firebaseAuth: Auth = getAuth(firebaseApp);
   const firebaseStore: Firestore = getFirestore(firebaseApp);
   const fireStorage: FirebaseStorage = getStorage(firebaseApp);

   return {
      firebaseApp,
      firebaseAuth,
      firebaseStore,
      fireStorage
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
export const conversationsColRef = collection(firebase.firebaseStore, 'conversations');
export const agreementsColRef = collection(firebase.firebaseStore, 'agreements');

export const getDocData = async (colRef: CollectionReference<DocumentData>, docId: string) => {
   if (!docId) return null;
   const docRef = doc(colRef, docId);
   return (await getDoc(docRef)).data();
};

import { FirebaseStorage, getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';

export async function uploadBlobToFirestore(
   blob: Blob,
   destinationBlobName?: string
): Promise<string> {
   // Create a reference to the destination blob
   const storageRef = ref(firebase.fireStorage, `images/${destinationBlobName || uuidv4()}`);

   // Upload the blob to Firebase Storage
   await uploadBytes(storageRef, blob);

   // Get the URL of the uploaded file
   const url = await getDownloadURL(storageRef);

   return url;
}
