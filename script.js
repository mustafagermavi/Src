// Import Firebase SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// Your Firebase Configuration (Yên تە مە لێرە دانان)
const firebaseConfig = {
  apiKey: "AIzaSyDOfmXC-fU_A3mvnSYWvYbagfvGdOWbdWA",
  authDomain: "hjkhss.firebaseapp.com",
  projectId: "hjkhss",
  storageBucket: "hjkhss.firebasestorage.app",
  messagingSenderId: "304514748115",
  appId: "1:304514748115:web:84589540a5529ee0354e26",
  measurementId: "G-C1GZKVJ273"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// --- 1. Handle User Registration ---
window.handleRegister = async () => {
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;
    const name = document.getElementById('reg-name').value;

    if(!email || !password || !name) return alert("Please fill all fields!");

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        // Create Initial User Data in Firestore
        await setDoc(doc(db, "users", user.uid), {
            name: name,
            balance: 50.00, // Welcome Bonus $50
            email: email,
            joinedAt: new Date()
        });
        
        alert("Account Created Successfully!");
    } catch (error) {
        alert("Error: " + error.message);
    }
};

// --- 2. Handle User Login ---
window.handleLogin = async () => {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    try {
        await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
        alert("Login Failed: Check email or password");
    }
};

// --- 3. Auth State Observer (Checking if user is logged in) ---
onAuthStateChanged(auth, async (user) => {
    const authContainer = document.getElementById('auth-container');
    const dashboard = document.getElementById('app-dashboard');

    if (user) {
        // User is logged in
        authContainer.style.display = 'none';
        dashboard.style.display = 'block';
        
        // Fetch Real Data from Firestore
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        
        if (userSnap.exists()) {
            const userData = userSnap.data();
            document.getElementById('display-name').innerText = userData.name;
            document.getElementById('user-balance').innerText = `$${userData.balance.toLocaleString(undefined, {minimumFractionDigits: 2})}`;
        }
    } else {
        // User is logged out
        authContainer.style.display = 'flex';
        dashboard.style.display = 'none';
    }
});

// --- 4. Handle Logout ---
window.handleLogout = () => {
    signOut(auth).then(() => {
        location.reload(); // Refresh page after logout
    });
};

// Toggle between Login and Register views
window.toggleAuth = () => {
    const lForm = document.getElementById('login-form');
    const rForm = document.getElementById('register-form');
    lForm.style.display = lForm.style.display === 'none' ? 'block' : 'none';
    rForm.style.display = rForm.style.display === 'none' ? 'block' : 'none';
};
