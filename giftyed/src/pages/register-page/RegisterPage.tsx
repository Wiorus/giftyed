import React from 'react'
import waves from "../../utils/waves.png"
import "./RegisterPage.scss"
import RegisterForm from '../../components/registerForm/RegisterForm';

const RegisterPage: React.FC = () => {
    return (
        <div className="RegisterPage">
            <div className="RegisterPage__form">
                <RegisterForm />
            </div>
            <img className="RegisterPage__wavesImg" src={waves} alt="waves" />
        </div>
    );
};
export default RegisterPage;