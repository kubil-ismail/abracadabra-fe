// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider,FacebookAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAVt_TnnotzBGLV8Uv7zRc_SF3WHLMQ2bM",
  authDomain: "portfolio-9131b.firebaseapp.com",
  projectId: "portfolio-9131b",
  storageBucket: "portfolio-9131b.appspot.com",
  messagingSenderId: "406112137022",
  appId: "1:406112137022:web:afae9457b8b7a3bc11866f",
  measurementId: "G-E63N6YDTM6",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

export { auth, googleProvider, facebookProvider };
