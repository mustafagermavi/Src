import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Your Verified Config
const firebaseConfig = {
  apiKey: "AIzaSyDOfmXC-fU_A3mvnSYWvYbagfvGdOWbdWA",
  authDomain: "hjkhss.firebaseapp.com",
  projectId: "hjkhss",
  storageBucket: "hjkhss.firebasestorage.app",
  messagingSenderId: "304514748115",
  appId: "1:304514748115:web:84589540a5529ee0354e26",
  measurementId: "G-C1GZKVJ273"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Auth Functions
window.handleRegister = async () => {
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;
    const name = document.getElementById('reg-name').value;
    try {
        const res = await createUserWithEmailAndPassword(auth, email, password);
        await setDoc(doc(db, "users", res.user.uid), { name, balance: 100, email });
        alert("Registration Successful!");
    } catch (e) { alert(e.message); }
};

window.handleLogin = async () => {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    try { await signInWithEmailAndPassword(auth, email, password); } 
    catch (e) { alert("Login Failed!"); }
};

// Real-Time UI Observer
onAuthStateChanged(auth, async (user) => {
    const authUI = document.getElementById('auth-container');
    const dashUI = document.getElementById('app-dashboard');
    if (user) {
        authUI.style.display = 'none';
        dashUI.style.display = 'block';
        const snap = await getDoc(doc(db, "users", user.uid));
        if (snap.exists()) {
            document.getElementById('display-name').innerText = snap.data().name;
            animateBalance(snap.data().balance);
        }
    } else {
        authUI.style.display = 'flex';
        dashUI.style.display = 'none';
    }
});

// Smooth Balance Animation
function animateBalance(target) {
    let current = 0;
    const el = document.getElementById('user-balance');
    const step = target / 50;
    const timer = setInterval(() => {
        current += step;
        if (current >= target) {
            el.innerText = `$${target.toLocaleString()}`;
            clearInterval(timer);
        } else {
            el.innerText = `$${current.toLocaleString(undefined, {maximumFractionDigits:0})}`;
        }
    }, 20);
}

window.handleLogout = () => signOut(auth);
window.toggleAuth = () => {
    const l = document.getElementById('login-form'), r = document.getElementById('register-form');
    l.style.display = l.style.display === 'none' ? 'block' : 'none';
    r.style.display = r.style.display === 'none' ? 'block' : 'none';
};
