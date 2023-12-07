import React from "react";
import { Link } from "react-router-dom";
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import "../loginForm/LoginForm.scss";
import SignUpButton from "../singUpButton/SignUpButton";
import { signInAuthUserWithEmailAndPassword } from "../../utils/firebase/firebase.utils";
import { FirebaseError } from "firebase/app";

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

  const handleSubmit = async (fieldsValues: LoginFieldsValues) => {
    const { email, password } = fieldsValues;

    try {
      const response = await signInAuthUserWithEmailAndPassword(email, password);
      console.log(response);
      alert("Login successful");
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
      <div className="LoginForm__logoName">
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
          <SignUpButton />
        </div>
      </div>
    </div>
  );
}

export default LoginForm;
