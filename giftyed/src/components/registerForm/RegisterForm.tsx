import React from 'react'
import "../registerForm/RegisterForm.scss"
import { createAuthUserWithEmailAndPassword, createUserDocumentFromAuth } from '../../utils/firebase/firebase.utils';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { FirebaseError } from 'firebase/app';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';


type RegisterFieldsValues = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const initialValues: RegisterFieldsValues = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: ""
}

const validationSchema = Yup.object().shape({
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
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
    const { email, firstName, lastName, password, confirmPassword } = fieldsValues;
    const displayName = `${firstName} ${lastName}`;

    if (password !== confirmPassword) {
      alert('Password does not match');
      return;
    }

    try {
      const userCredential = await createAuthUserWithEmailAndPassword(email, password);
      if (!userCredential) return;

      const { user } = userCredential;
      const initialUserData = {
        _id: user.uid,
        createAt: new Date(),
        displayName: displayName,
        email: email,
        birthday: null,
        age: null,
        photoURL: null,
        interests: null,
      };

      await createUserDocumentFromAuth(user, initialUserData);
      navigate('/login');
    } catch (error) {
      if (error instanceof FirebaseError) {
        if (error.code === 'auth/email-already-in-use') {
          alert('Email is already in use!');
        } else {
          console.log(error);
        }
      }
    }
  };

  return (
    <div className="RegisterForm">
      <div className="RegisterForm__logoName" onClick={() => navigate("/")}>
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
              <div className="RegisterForm__container-firstName">
                <label htmlFor="firstName">First Name</label>
                <ErrorMessage name="firstName" component="div" className="error-message" />
                <Field type="text" name="firstName" />
              </div>

              <div className="RegisterForm__container-lastName">
                <label htmlFor="lastName">Last Name</label>
                <ErrorMessage name="lastName" component="div" className="error-message" />
                <Field type="text" name="lastName" />
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