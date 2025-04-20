// Import Firebase SDK modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-analytics.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import { getFirestore, setDoc, doc, getDoc } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";
import { sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";


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

// Utility: Display message
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

// Wait for the DOM to load
document.addEventListener("DOMContentLoaded", () => {

  // 🔹 SIGN-UP HANDLER (Farmer)
  const signUpBtn = document.getElementById('submitSignUp');
  if (signUpBtn) {
    signUpBtn.addEventListener('click', (event) => {
      event.preventDefault();

      const email = document.getElementById('email')?.value;
      const password = document.getElementById('password')?.value;
      const firstName = document.getElementById('first-name')?.value;
      const lastName = document.getElementById('last-name')?.value;
      const city = document.getElementById('city')?.value;
      const state = document.getElementById('state')?.value;
      const contactNumber = document.getElementById('contact-number')?.value;

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
            role: "farmer"  // 👈 IMPORTANT: Set user role
          };

          const docRef = doc(db, "users", user.uid);
          return setDoc(docRef, userData).then(() => {
            showMessage('Account Created Successfully', 'signUpMessage');
            setTimeout(() => {
              window.location.href = 'login.html';
            }, 1500);
          });
        })
        .catch((error) => {
          if (error.code === 'auth/email-already-in-use') {
            showMessage('Email Address Already Exists !!', 'signUpMessage');
          } else {
            console.error("Sign-up error:", error);
            showMessage('Unable to create user.', 'signUpMessage');
          }
        });
    });
  }

  // 🔹 LOGIN HANDLER (All roles)
  const signInBtn = document.getElementById('submitSignIn');
  if (signInBtn) {
    signInBtn.addEventListener('click', (event) => {
      event.preventDefault();

      const email = document.getElementById('email')?.value;
      const password = document.getElementById('password')?.value;

      if (!email || !password) {
        showMessage("Please enter both email and password.", "signInMessage");
        return;
      }

      signInWithEmailAndPassword(auth, email, password)
        .then(async (userCredential) => {
          const user = userCredential.user;
          localStorage.setItem('loggedInUserId', user.uid);

          const userRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(userRef);

          if (docSnap.exists()) {
            const userData = docSnap.data();
            const role = userData.role;

            if (role === "company") {
              window.location.href = "Home2.html";
            } else if (role === "farmer" || role === "customer") {
              window.location.href = "GoToApp.html";
            } else {
              alert("Unknown user role.");
            }
          } else {
            showMessage('User data not found.', 'signInMessage');
          }
        })
        .catch((error) => {
          if (error.code === 'auth/invalid-credential') {
            showMessage('Incorrect Email or Password', 'signInMessage');
          } else {
            console.error("Login error:", error);
            showMessage('Account does not exist', 'signInMessage');
          }
        });
    });
  }
});

// 🔹 FORGOT PASSWORD HANDLER
window.forgotPassword = function () {
  const email = document.getElementById("email")?.value;
  if (!email) {
    alert("Please enter your email address first.");
    return;
  }

  sendPasswordResetEmail(auth, email)
    .then(() => {
      alert("Password reset email sent! Check your inbox.");
    })
    .catch((error) => {
      console.error("Reset error:", error);
      alert("Error sending reset email: " + error.message);
    });
};

