import React, { useContext, useEffect } from 'react'
import { signInWithGooglePopup, createUserDocumentFromAuth, db } from '../../utils/firebase/firebase.utils'
import { UsersContext, UsersContextType } from '../../contexts/user.context';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { FirebaseError } from 'firebase/app';
import { useNavigate } from 'react-router-dom';
import { UserApp } from '../../utils/types/user';
import './SignInButton.scss'

const SignInButton: React.FC = () => {

    const navigate = useNavigate();
    const { currentUserContext, setCurrentUserContext } = useContext(UsersContext) as UsersContextType;
    useEffect(() => {
        // console.log(currentUserContext);
    }, [currentUserContext]);

    useEffect(() => {
        const storedUserData = localStorage.getItem('userData');
        if (storedUserData) {
            const parsedUserData: UserApp = JSON.parse(storedUserData);
            setCurrentUserContext(parsedUserData);
        }
    }, [setCurrentUserContext]);

    const logGoogleUser = async () => {
        try {
            const userAuth = await signInWithGooglePopup();
            if (userAuth && userAuth.user) {
                const userDocRef = doc(db, "users", userAuth.user.uid);
                const userSnapshot = await getDoc(userDocRef);

                if (userSnapshot.exists()) {
                    const userData = userSnapshot.data();

                    let loggedUser: UserApp = {
                        _id: userAuth.user.uid,
                        createAt: userData.createAt,
                        displayName: userData.displayName,
                        email: userData.email,
                        birthday: userData.birthday || null,
                        age: userData.age || null,
                        photoURL: userData.photoURL || null,
                        interests: userData.interests || null,
                        followed: userData.followed || null,
                        wishes: userData.wishes || null,
                        calendarNote: userData.calendarNote || null,
                        desiredGifts: userData.desiredGifts || null,
                    };
                    localStorage.setItem('userData', JSON.stringify(loggedUser));
                    setCurrentUserContext(loggedUser);
                    // alert("Sign in with google successful");
                    navigate("/");
                    // console.log(currentUserContext);
                } else {
                    const newUserData = {
                        _id: userAuth.user.uid,
                        createAt: new Date(),
                        displayName: userAuth.user.displayName || "",
                        email: userAuth.user.email || "",
                        birthday: null,
                        age: null,
                        photoURL: userAuth.user.photoURL || null,
                        interests: null,
                        followed: null,
                        wishes: null,
                        calendarNote: null,
                        desiredGifts: null,
                    };

                    await setDoc(userDocRef, newUserData);

                    let newLoggedUser: UserApp = {
                        _id: userAuth.user.uid,
                        createAt: newUserData.createAt,
                        displayName: newUserData.displayName,
                        email: newUserData.email,
                        birthday: newUserData.birthday,
                        age: newUserData.age,
                        photoURL: newUserData.photoURL,
                        interests: newUserData.interests,
                        followed: newUserData.followed,
                        wishes: newUserData.wishes,
                        calendarNote: newUserData.calendarNote,
                        desiredGifts: newUserData.desiredGifts,
                    };

                    localStorage.setItem('userData', JSON.stringify(newLoggedUser));
                    setCurrentUserContext(newLoggedUser);
                    // alert("Sign in with google successful");
                    navigate("/");
                    // console.log(currentUserContext);
                    // alert("Acount created/signed with Google");
                    // console.log(currentUserContext);
                }
            }
            await createUserDocumentFromAuth(userAuth);
        } catch (error) {
            if (error instanceof FirebaseError) {
                if (error.code === "auth/popup-closed-by-user") {
                    // console.log("GooglePopup window closed by user");
                    return;
                } else {
                    console.error(error.message);
                }
            }
        }
    };

    return (
        <div className='sign-in-button'>
            <button type='button' className="gsi-material-button" onClick={logGoogleUser}>
                <div className="gsi-material-button-state"></div>
                <div className="gsi-material-button-content-wrapper">
                    <div className="gsi-material-button-icon">
                        <svg
                            version="1.1"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 48 48"
                            xmlnsXlink="http://www.w3.org/1999/xlink"
                        >
                            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                            <path fill="none" d="M0 0h48v48H0z"></path>
                        </svg>
                    </div>
                    <span className="gsi-material-button-contents">Sign in</span>
                </div>
            </button>
        </div>
    )
}

export default SignInButton