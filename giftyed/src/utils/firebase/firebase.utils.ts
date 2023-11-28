import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { Await } from "react-router-dom";

const firebaseConfig = {
  apiKey: "AIzaSyDBv2xXKlGAs89GdEMEmSOoKo_AUcqGizw",
  authDomain: "giftyed-database.firebaseapp.com",
  projectId: "giftyed-database",
  storageBucket: "giftyed-database.appspot.com",
  messagingSenderId: "907405230951",
  appId: "1:907405230951:web:33cd340116c573b9aae5c2",
};

const firebaseApp = initializeApp(firebaseConfig);

const provider = new GoogleAuthProvider();
provider.setCustomParameters({
  prompt: "select_account",
});

export const auth = getAuth();
export const signInWithGooglePopup = () => signInWithPopup(auth, provider);
export const db = getFirestore();

export const createUserDocumentFromAuth = async (
  userAuth: any,
  additionalInformation = {}
) => {
  if (!userAuth) return;
  const userDocRef = doc(db, "users", userAuth.uid);
  const userSnapshot = await getDoc(userDocRef);

  if (!userSnapshot.exists()) {
    const { name, email } = userAuth;
    const createAt = new Date();

    try {
      await setDoc(userDocRef, {
        name,
        email,
        createAt,
        ...additionalInformation,
      });
    } catch (error) {
      console.log("error creating the user", error);
    }
  }

  return userDocRef;
};

export const createAuthUserWithEmailAndPassword = async (
  email: string,
  password: string
) => {
  if (!email || !password) return;
  return await createUserWithEmailAndPassword(auth, email, password);
};
