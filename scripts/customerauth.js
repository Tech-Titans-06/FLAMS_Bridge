// Firebase SDK imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-analytics.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import { getFirestore, setDoc, doc, getDoc } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

// Config
const firebaseConfig = {
  apiKey: "AIzaSyAh8qCfNYH2cFHJVy5JOyyMp844cNQAC80",
  authDomain: "flams-bridge.firebaseapp.com",
  projectId: "flams-bridge",
  storageBucket: "flams-bridge.firebasestorage.app",
  messagingSenderId: "115007789610",
  appId: "1:115007789610:web:b2da9310cc7c0e19c20153",
  measurementId: "G-YG30RYRBB9"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth();
const db = getFirestore();

function showMessage(message, divId) {
  const messageDiv = document.getElementById(divId);
  if (!messageDiv) return;
  messageDiv.style.display = "block";
  messageDiv.innerHTML = message;
  messageDiv.style.opacity = 1;
  setTimeout(() => {
    messageDiv.style.opacity = 0;
  }, 5000);
}

document.addEventListener("DOMContentLoaded", () => {

  // Sign-up
  const signUpBtn = document.getElementById('customerSubmit');
  if (signUpBtn) {
    signUpBtn.addEventListener('click', (event) => {
      event.preventDefault();

      const email = document.getElementById('customer-email')?.value;
      const password = document.getElementById('customer-password')?.value;
      const firstName = document.getElementById('first-name')?.value;
      const lastName = document.getElementById('last-name')?.value;
      const city = document.getElementById('city')?.value;
      const state = document.getElementById('state')?.value;
      const contactNumber = document.getElementById('contact-number')?.value;
      const zipcode = document.getElementById('zip-code')?.value;

      if (!email || !password) {
        showMessage("Please fill in all fields.", "signUpMessage");
        return;
      }

      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          const userData = {
            email,
            password,
            firstName,
            lastName,
            city,
            state,
            contactNumber,
            zipcode,
            role: "customer"
          };
          return setDoc(doc(db, "users", user.uid), userData).then(() => {
            showMessage('Account Created Successfully', 'signUpMessage');
            setTimeout(() => {
              window.location.href = 'login.html';
            }, 1500);
          });
        })
        .catch((error) => {
          if (error.code === 'auth/email-already-in-use') {
            showMessage('Email already exists!', 'signUpMessage');
          } else {
            showMessage('Unable to create user.', 'signUpMessage');
          }
        });
    });
  }

  // Login
  const signInBtn = document.getElementById('submitSignIn');
  if (signInBtn) {
    signInBtn.addEventListener('click', (event) => {
      event.preventDefault();
      const email = document.getElementById('email')?.value;
      const password = document.getElementById('password')?.value;

      if (!email || !password) {
        showMessage("Enter both email and password", "signInMessage");
        return;
      }

      signInWithEmailAndPassword(auth, email, password)
        .then(async (userCredential) => {
          const user = userCredential.user;
          localStorage.setItem('loggedInUserId', user.uid);

          const docSnap = await getDoc(doc(db, "users", user.uid));
          const role = docSnap.exists() ? docSnap.data().role : null;

          if (role === "customer") {
            window.location.href = "GoToApp.html";
          } else {
            alert("Access denied for this role.");
          }
        })
        .catch((error) => {
          showMessage("Login failed: " + error.message, "signInMessage");
        });
    });
  }
});
