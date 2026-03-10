// Import Firebase functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc, updateDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// !!! ئەڤان زانیاریان ژ Firebase Console وەرگرە !!!
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT.appspot.com",
    messagingSenderId: "YOUR_ID",
    appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Authentication Logic
window.handleRegister = async () => {
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;
    const name = document.getElementById('reg-name').value;

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        // Create user record in Database
        await setDoc(doc(db, "users", user.uid), {
            name: name,
            balance: 100.00, // Welcome Bonus
            role: "investor"
        });
        alert("Account Created!");
    } catch (error) { alert(error.message); }
};

window.handleLogin = async () => {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    try {
        await signInWithEmailAndPassword(auth, email, password);
    } catch (error) { alert("Login Failed!"); }
};

// Listen for User Session
onAuthStateChanged(auth, async (user) => {
    if (user) {
        document.getElementById('auth-container').style.display = 'none';
        document.getElementById('app-dashboard').style.display = 'block';
        
        // Load User Data from Firestore
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
            document.getElementById('display-name').innerText = userSnap.data().name;
            document.getElementById('user-balance').innerText = `$${userSnap.data().balance.toFixed(2)}`;
        }
    } else {
        document.getElementById('auth-container').style.display = 'flex';
        document.getElementById('app-dashboard').style.display = 'none';
    }
});

window.handleLogout = () => signOut(auth);

window.toggleAuth = () => {
    const login = document.getElementById('login-form');
    const register = document.getElementById('register-form');
    login.style.display = login.style.display === 'none' ? 'block' : 'none';
    register.style.display = register.style.display === 'none' ? 'block' : 'none';
};
