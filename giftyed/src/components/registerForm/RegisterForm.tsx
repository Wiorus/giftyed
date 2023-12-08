import React from 'react'
import "../registerForm/RegisterForm.scss"
import { createAuthUserWithEmailAndPassword, createUserDocumentFromAuth } from '../../utils/firebase/firebase.utils';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { FirebaseError } from 'firebase/app';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';


type RegisterFieldsValues = {
  displayName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const initialValues: RegisterFieldsValues = {
  displayName: "",
  email: "",
  password: "",
  confirmPassword: ""
}

const validationSchema = Yup.object().shape({
  displayName: Yup.string().required('Login is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Password must contain at least one uppercase letter, one digit, and one special character'
    )
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Confirm Password is required'),
});

const RegisterForm: React.FC = () => {
  const navigate = useNavigate();
  const handleSubmit = async (fieldsValues: RegisterFieldsValues) => {
    const { email, displayName, password, confirmPassword } = fieldsValues;

    if (password !== confirmPassword) {
      alert("password does not match");
      return;
    }
    try {
      const userCredential = await createAuthUserWithEmailAndPassword(email, password);
      if (!userCredential) return;
      const { user } = userCredential;
      await createUserDocumentFromAuth(user, { displayName })
      navigate("/login")
      // alert("registered successfully");
    } catch (error) {
      if (error instanceof FirebaseError) {
        if (error.code === "auth/email-already-in-use") {
          alert("email is already in use!");
        }
        else {
          console.log(error)
        }
      }
    }
  }

  return (
    <div className="RegisterForm">
      <div className="RegisterForm__logoName">
        <span className="RegisterForm__logoName-one">Gift</span>
        <span className="RegisterForm__logoName-two">yed</span>
      </div>

      <Formik initialValues={initialValues}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
      >
        {({ isSubmitting }) => (

          <Form>
            <div className='RegisterForm__container'>
              <div className="RegisterForm__container-login">
                <label htmlFor="loginName">Login</label>
                <ErrorMessage name="displayName" component="div" className="error-message" />
                <Field type="text" name="displayName" />
              </div>

              <div className="RegisterForm__container-email">
                <label htmlFor="emailName">Email</label>
                <ErrorMessage name="email" component="div" className="error-message" />
                <Field type="email" name="email" />
              </div>


              <div className="RegisterForm__container-password">
                <label htmlFor="passwordName">Password</label>
                <ErrorMessage name="password" component="div" className="error-message" />
                <Field type="password" name="password" />
              </div>


              <div className="RegisterForm__container-confirmPassword">
                <label htmlFor="passwordName-confirmPassword">Password</label>
                <ErrorMessage name="confirmPassword" component="div" className="error-message" />
                <Field type="password" name="confirmPassword" />
              </div>


              <div className="RegisterForm__container-button">
                <button type="submit" disabled={isSubmitting}>
                  Register
                </button>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  )
}
export default RegisterForm;