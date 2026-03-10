// 1. Import Firebase Functions ژ سێرڤەرێن فەرمی یێن گوگل
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// 2. کلیلێن تە یێن تایبەت (Your Config)
const firebaseConfig = {
  apiKey: "AIzaSyDOfmXC-fU_A3mvnSYWvYbagfvGdOWbdWA",
  authDomain: "hjkhss.firebaseapp.com",
  projectId: "hjkhss",
  storageBucket: "hjkhss.firebasestorage.app",
  messagingSenderId: "304514748115",
  appId: "1:304514748115:web:84589540a5529ee0354e26",
  measurementId: "G-C1GZKVJ273"
};

// 3. Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// --- [A] دروستکرنا حسابا نوی (Register) ---
window.handleRegister = async () => {
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;
    const name = document.getElementById('reg-name').value;

    if(!email || !password || !name) return alert("Please fill all fields!");

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        // پاشکەفتکرنا داتایێن دەسپێکێ د داتابەیسێ دا
        await setDoc(doc(db, "users", user.uid), {
            name: name,
            balance: 50.00, // وەک دیاری $50 بۆ هەر کەسەکێ نوی
            email: email,
            createdAt: new Date()
        });
        
        alert("Account Created! Welcome " + name);
    } catch (error) {
        alert("Error: " + error.message);
    }
};

// --- [B] چوونەژوورەوا ڕاستەقینە (Login) ---
window.handleLogin = async () => {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    try {
        await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
        alert("Login Failed: Please check your email/password");
    }
};

// --- [C] چاودێریا حالەتێ بەکارهێنەری (Auth Observer) ---
onAuthStateChanged(auth, async (user) => {
    const authUI = document.getElementById('auth-container');
    const dashboardUI = document.getElementById('app-dashboard');

    if (user) {
        // ئەگەر یێ داخل بووی بیت
        authUI.style.display = 'none';
        dashboardUI.style.display = 'block';
        
        // وەرگرتنا داتایان ژ Firestore
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        
        if (userSnap.exists()) {
            const data = userSnap.data();
            document.getElementById('display-name').innerText = data.name;
            document.getElementById('user-balance').innerText = `$${data.balance.toLocaleString()}`;
        }
    } else {
        // ئەگەر یێ دەرکەفتی بیت
        authUI.style.display = 'flex';
        dashboardUI.style.display = 'none';
    }
});

// --- [D] دەرکەفتن (Logout) ---
window.handleLogout = () => {
    signOut(auth).then(() => {
        alert("Logged out!");
    });
};

// گۆهرینا شاشێ د ناڤبەرا Login و Register
window.toggleAuth = () => {
    const lForm = document.getElementById('login-form');
    const rForm = document.getElementById('register-form');
    lForm.style.display = lForm.style.display === 'none' ? 'block' : 'none';
    rForm.style.display = rForm.style.display === 'none' ? 'block' : 'none';
};
