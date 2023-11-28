import React from 'react'
import "../registerForm/RegisterForm.scss"
import { useState } from 'react';
import { createAuthUserWithEmailAndPassword, createUserDocumentFromAuth } from '../../utils/firebase/firebase.utils';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { FirebaseError } from 'firebase/app';


type RegisterFieldsValues = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string
}

const initialValues: RegisterFieldsValues = {
  name: "",
  email: "",
  password: "",
  confirmPassword: ""
}

const RegisterForm: React.FC = () => {

  // const [registerFields, setRegisterFields] = useState<RegisterFieldsValues>(initialValues);


  const handleSubmit = async (values: RegisterFieldsValues) => {
    const { email, name, password, confirmPassword } = values;
    if (password != confirmPassword) {
      alert("password do not match");
      return;
    }
    try {
      const userCredential = await createAuthUserWithEmailAndPassword(email, password);
      if (!userCredential) return;
      const { user } = userCredential;
      await createUserDocumentFromAuth(user, { name })

      alert("poszło");
    } catch (error) {
      if (error instanceof FirebaseError) {
        if (error.code === "auth/email-already-in-use") {
          alert("email już w użyciu!");
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
      // validationSchema={validationSchema}
      >

        {({ isSubmitting, handleChange, values }) => (
          <Form>
            <div className="RegisterForm__login">
              <label htmlFor="loginName">Login</label>
              <Field
                type="text"
                name="name"
                value={values.name}
                onChange={handleChange}
              />
            </div>
            <ErrorMessage name="name" component="div" />

            <div className="RegisterForm__email">
              <label htmlFor="emailName">Email</label>
              <Field
                type="email"
                name="email"
              />
            </div>
            <ErrorMessage name="email" component="div" />

            <div className="RegisterForm__password">
              <label htmlFor="passwordName">Password</label>
              <Field type="password" name="password" />
            </div>
            <ErrorMessage name="password" component="div" />

            <div className="RegisterForm__confirmPassword">
              <label htmlFor="passwordName-confirmPassword">Password</label>
              <Field type="password" name="confirmPassword" />
            </div>
            <ErrorMessage name="confirmPassword" component="div" />
            
            <div className="RegisterForm__button">
              <button type="submit" disabled={isSubmitting}>
                Register
              </button>
            </div>
          </Form>
        )}

      </Formik>

    </div>
  )
}
export default RegisterForm;