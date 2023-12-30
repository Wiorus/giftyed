import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  getDocs,
  query,
} from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDBv2xXKlGAs89GdEMEmSOoKo_AUcqGizw",
  authDomain: "giftyed-database.firebaseapp.com",
  projectId: "giftyed-database",
  storageBucket: "giftyed-database.appspot.com",
  messagingSenderId: "907405230951",
  appId: "1:907405230951:web:33cd340116c573b9aae5c2",
};

initializeApp(firebaseConfig);

const provider = new GoogleAuthProvider();
provider.setCustomParameters({
  prompt: "select_account",
});

export const signInWithGooglePopup = () => signInWithPopup(auth, provider);

export const auth = getAuth();
export const db = getFirestore();
export const storagePhoto = getStorage();

export const createUserDocumentFromAuth = async (
  userAuth: any,
  additionalInformation = {}
) => {
  if (!userAuth) return;
  const userDocRef = doc(db, "users", userAuth.uid);
  const userSnapshot = await getDoc(userDocRef);

  if (!userSnapshot.exists()) {
    const { displayName, email } = userAuth;
    const createAt = new Date();

    try {
      await setDoc(userDocRef, {
        displayName,
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

export const signInAuthUserWithEmailAndPassword = async (
  email: string,
  password: string
) => {
  if (!email || !password) return;
  return await signInWithEmailAndPassword(auth, email, password);
};

export const updateUserDoc = async (uid: string, updatedData: any) => {
  const userDocRef = doc(db, "users", uid);
  try {
    await updateDoc(userDocRef, { ...updatedData });
  } catch (error) {
    console.error("Error updating user data:", error);
    throw error;
  }
};

// GIFTS

// Funkcja do pobierania wszystkich prezentów
export const getAllGifts = async () => {
  try {
    const giftsCollection = collection(db, "gifts");
    const giftsQuery = query(giftsCollection);
    const giftsSnapshot = await getDocs(giftsQuery);

    return giftsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error getting gifts:", error);
    throw error;
  }
};

// Funkcja do pobierania prezentów na podstawie tagów
// export const getGiftsByTags = async (tags) => {
//   try {
//     const giftsCollection = collection(db, "gifts");
//     const giftsQuery = query(giftsCollection, where("tags", "array-contains-any", tags));
//     const giftsSnapshot = await getDocs(giftsQuery);

//     return giftsSnapshot.docs.map((doc) => ({
//       id: doc.id,
//       ...doc.data(),
//     }));
//   } catch (error) {
//     console.error("Error getting gifts by tags:", error);
//     throw error;
//   }
// };
