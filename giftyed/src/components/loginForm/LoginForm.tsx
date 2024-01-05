import React, { useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import "../loginForm/LoginForm.scss";
import SignInButton from "../singInButton/SignInButton";
import { db, signInAuthUserWithEmailAndPassword } from "../../utils/firebase/firebase.utils";
import { FirebaseError } from "firebase/app";
import { UsersContext, UsersContextType } from "../../contexts/user.context";
import { UserApp } from "../../utils/types/user";
import { doc, getDoc } from "firebase/firestore";

type LoginFieldsValues = {
  email: string;
  password: string;
};

const initialValues: LoginFieldsValues = {
  email: "",
  password: "",
};

const validationSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().required('Password is required'),
});

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const { currentUserContext, setCurrentUserContext } = useContext(UsersContext) as UsersContextType;
  useEffect(() => {
    console.log(currentUserContext)
  }, [currentUserContext])

  useEffect(() => {
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      const parsedUserData: UserApp = JSON.parse(storedUserData);
      setCurrentUserContext(parsedUserData);
    }
  }, [setCurrentUserContext]);

  const handleSubmit = async (fieldsValues: LoginFieldsValues) => {
    const { email, password } = fieldsValues;

    try {
      const userAuth = await signInAuthUserWithEmailAndPassword(email, password);
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
          }
          localStorage.setItem('userData', JSON.stringify(loggedUser));
          setCurrentUserContext(loggedUser);
          navigate("/")
          // alert("Login successful");
          console.log(currentUserContext)
        }
      }
    } catch (error) {
      if (error instanceof FirebaseError) {
        if (error.code === "auth/invalid-login-credentials") {
          alert("Invalid email or password");
        } else {
          console.log(error);
        }
      }
    }
  };

  return (
    <div className="LoginForm">
      <div className="LoginForm__logoName" onClick={() => navigate("/")}>
        <span className="LoginForm__logoName-one">Gift</span>
        <span className="LoginForm__logoName-two">yed</span>
      </div>

      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}>
        {({ isSubmitting }) => (
          <Form>
            <div className="LoginForm__container">
              <div className="LoginForm__container-login">
                <label htmlFor="email">Email</label>
                <ErrorMessage name="email" component="div" className="error-message" />
                <Field type="email" id="email" name="email" />
              </div>

              <div className="LoginForm__container-password">
                <label htmlFor="password">Password</label>
                <ErrorMessage name="password" component="div" className="error-message" />
                <Field type="password" id="password" name="password" />
              </div>

              <div className="LoginForm__container-loginButton">
                <button type="submit" disabled={isSubmitting}>Sign in</button>
              </div>
            </div>
          </Form>
        )}
      </Formik>

      <div className="LoginForm__otherOptions">
        <Link className="LoginForm__otherOptions-register" to="/register"> Don't have an account? </Link>
        <div className="LoginForm__otherOptions-google">
          <SignInButton />
        </div>
      </div>
    </div>
  );
}

export default LoginForm;