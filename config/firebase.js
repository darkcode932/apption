// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import AuthError from "../components/Auth/Error";
import firebase from "firebase/app"
import 'firebase/auth';
import 'firebase/firestore'
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);

//export const db = firebase.firestore();
//export const auth = firebase.auth();

// Handle email sign-in
const handleEmailSignIn = async (email, password) => {
  try {
    await auth.signInWithEmailAndPassword(email, password);
    // Handle successful sign-in
  } catch (error) {
    // Handle sign-in error
  }
};

// Handle email sign-up
 const handleEmailSignUp = async (email, password) => {
  try {
    await auth.createUserWithEmailAndPassword(email, password);
    // Handle successful sign-up
  } catch (error) {
    // Handle sign-up error
  }
};

// Handle email sign-out
 const handleEmailSignOut = async () => {
  try {
    await auth.signOut();
    // Handle successful sign-out
  } catch (error) {
    // Handle sign-out error
  }
};

const currentUser = () => {
  return auth.currentUser;
};

const isAuthenticated = () => {
  return !!currentUser();
};

export {firebase, handleEmailSignIn, handleEmailSignOut, handleEmailSignUp, currentUser, isAuthenticated};
