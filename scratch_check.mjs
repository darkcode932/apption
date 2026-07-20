import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC1b-18HULSVKPlWwvHBvLw9x-ve-k4Nqo",
  authDomain: "apption-acf56.firebaseapp.com",
  projectId: "apption-acf56",
  storageBucket: "apption-acf56.appspot.com",
  messagingSenderId: "333058824443",
  appId: "1:333058824443:web:68acc7aa22c286906a785e"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function checkNotifications() {
  console.log("Fetching notifications...");
  const snap = await getDocs(collection(db, "notifications"));
  snap.forEach(doc => {
    console.log(`Doc ID: ${doc.id} | Data:`, doc.data());
  });
  console.log("Done.");
  process.exit(0);
}

checkNotifications();
