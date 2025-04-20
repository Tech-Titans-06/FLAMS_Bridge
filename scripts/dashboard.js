import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-analytics.js";
import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAh8qCfNYH2cFHJVy5JOyyMp844cNQAC80",
  authDomain: "flams-bridge.firebaseapp.com",
  projectId: "flams-bridge",
  storageBucket: "flams-bridge.firebasestorage.app",
  messagingSenderId: "115007789610",
  appId: "1:115007789610:web:b2da9310cc7c0e19c20153",
  measurementId: "G-YG30RYRBB9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth();
const db = getFirestore();

// Get stored user ID from local storage
const loggedInUserId = localStorage.getItem('loggedInUserId');

if (loggedInUserId) {
  const docRef = doc(db, "users", loggedInUserId);
  getDoc(docRef)
    .then((docSnap) => {
      if (docSnap.exists()) {
        const userData = docSnap.data();
        document.getElementById('loggedUserCName').innerText = userData.companyName;
        document.getElementById('loggedUserGstNumber').innerText = userData.gstNumber;
        document.getElementById('loggedUserEmail').innerText = userData.email;
        document.getElementById('loggedUserCity').innerText = userData.city;
        document.getElementById('loggedUserState').innerText = userData.state;
        document.getElementById('loggedUserZipcode').innerText = userData.zipcode;
      } else {
        console.error("No document found for this user.");
      }
    })
    .catch((error) => {
      console.error("Error getting user document:", error);
    });
} else {
  console.warn("No logged-in user found in local storage.");
}

// Logout functionality
const logoutButton = document.getElementById('logout');
logoutButton.addEventListener('click', () => {
  localStorage.removeItem('loggedInUserId');
  signOut(auth)
    .then(() => {
      window.location.href = 'login.html';
    })
    .catch((error) => {
      console.error("Error signing out:", error);
    });
});
