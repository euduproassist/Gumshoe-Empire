import { auth, db } from "./firebase-config.js";
import { signInWithPopup, GoogleAuthProvider, signInAnonymously, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-auth.js";
import { doc, getDoc, setDoc, updateDoc } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";

const provider = new GoogleAuthProvider();

// Auth Logic
async function handleLogin(isGoogle = false) {
    try {
        const userCredential = isGoogle ? await signInWithPopup(auth, provider) : await signInAnonymously(auth);
        const user = userCredential.user;
        await initializePlayerDoc(user, isGoogle ? 'Google' : 'Guest');
        document.getElementById('screen-menu').classList.remove('is-active');
        document.getElementById('screen-profile').classList.add('is-active');
    } catch (error) { console.error(error); }
}

async function initializePlayerDoc(user, type) {
    const docRef = doc(db, "players", user.uid);
    const snap = await getDoc(docRef);
    if (!snap.exists()) {
        await setDoc(docRef, {
            detectiveName: "Detective",
            avatar: "default_avatar",
            level: 1,
            rank: "Novice Private Investigator (P.I.)",
            accountType: type,
            createdAt: new Date().toISOString()
        });
    }
}

// Event Listeners
document.querySelector('.btn-guest').addEventListener('click', () => handleLogin(false));
document.querySelector('.btn-google').addEventListener('click', () => handleLogin(true));
