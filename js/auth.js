// /public/js/auth.js
import { auth, db } from "./firebaseConfig.js";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  doc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// DOM
const loginSection = document.getElementById("loginSection");
const dashboardSection = document.getElementById("dashboardSection");
const loginForm = document.getElementById("loginForm");
const loginEmail = document.getElementById("loginEmail");
const loginPassword = document.getElementById("loginPassword");
const loginError = document.getElementById("loginError");
const adminUserEmail = document.getElementById("adminUserEmail");
const logoutBtn = document.getElementById("logoutBtn");

// Helpers to show/hide
function showLogin() {
  if (loginSection) loginSection.style.display = "block";
  if (dashboardSection) dashboardSection.style.display = "none";
}
function showDashboard(email) {
  if (adminUserEmail && email) adminUserEmail.textContent = email;
  if (loginSection) loginSection.style.display = "none";
  if (dashboardSection) dashboardSection.style.display = "block";
}

// Admin check: prefer custom claim `admin: true`, else fallback to Firestore doc `admins/{uid}` with {active:true}
async function isAdminUser(user) {
  try {
    const token = await user.getIdTokenResult(true);
    if (token?.claims?.admin === true) return true;
  } catch (_) {}

  // Fallback: Firestore check
  try {
    const ref = doc(db, "admins", user.uid);
    const snap = await getDoc(ref);
    if (snap.exists() && (snap.data()?.active ?? true)) return true;
  } catch (_) {}

  return false;
}

// Auth state routing
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    showLogin();
    return;
  }
  const ok = await isAdminUser(user);
  if (!ok) {
    await signOut(auth);
    if (loginError) loginError.textContent = "You are not authorized.";
    showLogin();
    return;
  }
  showDashboard(user.email || user.uid);
  // Tell the dashboard it's safe to start (admin verified)
  window.dispatchEvent(new CustomEvent("admin:ready", { detail: { user } }));
});

// Login
loginForm?.addEventListener("submit", async (e) => {
  e.preventDefault();
  loginError.textContent = "";
  try {
    await signInWithEmailAndPassword(auth, loginEmail.value.trim(), loginPassword.value);
    // onAuthStateChanged will take it from here
  } catch (err) {
    loginError.textContent = err.message || "Login failed.";
  }
});

// Logout
logoutBtn?.addEventListener("click", async () => {
  try {
    await signOut(auth);
    showLogin();
  } catch (err) {
    alert("Error signing out.");
  }
});
