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
import { GiftApp } from "../types/gift";

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

// AUTH
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

export const getAllGifts = async (): Promise<GiftApp[]> => {
  try {
    const giftsCollection = collection(db, "gifts");
    const giftsQuery = query(giftsCollection);
    const giftsSnapshot = await getDocs(giftsQuery);

    return giftsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as GiftApp[];
  } catch (error) {
    console.error("Error getting gifts:", error);
    throw error;
  }
};

export const updateUserWishes = async (uid: string, giftId: string) => {
  try {
    const userDocRef = doc(db, "users", uid);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      await updateDoc(userDocRef, {
        wishes: [...(userDoc.data().wishes || []), giftId],
      });
    }
  } catch (error) {
    console.error('Error updating user wishes:', error);
    throw error;
  }
};

export const removeGiftFromWishes = async (uid: string, giftId: string) => {
  try {
    const userDocRef = doc(db, "users", uid);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      await updateDoc(userDocRef, {
        wishes: userDoc.data().wishes.filter((id: string) => id !== giftId),
      });
    }
  } catch (error) {
    console.error('Error removing gift from wishes:', error);
    throw error;
  }
};


export const updateDesiredGifts = async (uid: string, giftId: string) => {
  try {
    const userDocRef = doc(db, 'users', uid);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      await updateDoc(userDocRef, {
        desiredGifts: [...(userDoc.data().desiredGifts || []), giftId],
      });
    }
  } catch (error) {
    console.error('Error updating desiredGifts:', error);
    throw error;
  }
};

export const removeGiftFromDesiredGifts = async (uid: string, giftId: string) => {
  try {
    const userDocRef = doc(db, 'users', uid);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      await updateDoc(userDocRef, {
        desiredGifts: userDoc.data().desiredGifts.filter((id: string) => id !== giftId),
      });
    }
  } catch (error) {
    console.error('Error removing gift from desiredGifts:', error);
    throw error;
  }
};