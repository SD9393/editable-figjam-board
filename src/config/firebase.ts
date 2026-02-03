import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCknjodvT095K0M3ASxCEeeoChn9RBU1CQ",
  authDomain: "realtime-board-ocd.firebaseapp.com",
  databaseURL: "https://realtime-board-ocd-default-rtdb.firebaseio.com",
  projectId: "realtime-board-ocd",
  storageBucket: "realtime-board-ocd.firebasestorage.app",
  messagingSenderId: "258036246275",
  appId: "1:258036246275:web:a93405647e4013aef3eb36",
};

const app = initializeApp(firebaseConfig);

export const db = getDatabase(app);
