import { useEffect, useState } from 'react';
import { useLocation, Link, useParams } from 'react-router-dom';
import logo from '../assets/images/logo.png';
import PinInput from 'react-pin-input';
import {
    sendPasswordResetEmail
} from 'firebase/auth';

import { auth } from '../config/firebaseConfig';
import { ToastContainer, toast } from 'react-toastify';
import '../App.css';
import Loader from './loader';

function ForgotPassword() {
    const [inputs, setInputs] = useState({
        email: '',
    });
    const [passwords, setPassword] = useState({
        password: '',
        cPassword: ''
    });
    const [submitted, setSubmitted] = useState(false);
    const [success, setIsSuccess] = useState(false);
    const { email } = inputs;
    const [validEmail, setValidEmail] = useState(true);
    const [load, setLoad] = useState(false);

    function handleChange(e) {
        const { name, value } = e.target;
        setInputs(inputs => ({ ...inputs, [name]: value }));
        if (email !== '') {
            let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            emailRegex.test(email) ? setValidEmail(true) : setValidEmail(false);
        }
    }
    useEffect(() => {
        localStorage.clear();
        auth.signOut();
    }, []);

    function handleSubmit(e) {
        e.preventDefault();


        setSubmitted(true);
        if (email && validEmail) {
            setLoad(true);
            // get return url from location state or default to home page
            sendPasswordResetEmail(auth, email).then((result) => {
                console.log(result);
                setLoad(false);

                setIsSuccess(true);
            }).catch((error) => {
                console.log(error);
                setLoad(false);

                toast.error(error.message, {
                    theme: 'dark',
                    position: "top-right",
                    hideProgressBar: true,
                    pauseOnHover: false,
                    draggable: false,
                    autoClose: 5000,
                });
            })

        }
    }

    return (
        <>
            <Loader isLoad={load} />
            <div className='auth-bg'>
                <img src={logo} alt="" className="logo-img" />
                <div className="container-body">
                    {!success ? <div id="form">
                        <h2 className='f-w-b'>Forgot Password</h2>
                        <br />
                        <form name="login" onSubmit={handleSubmit}>
                            <div className='mt-2'>
                                <label htmlFor="email" className='f-w-l fs-14'>Email</label>
                                <div>
                                    <input type="text" name='email' id="email" onChange={handleChange} value={inputs.email} />
                                </div>
                                {submitted && inputs.email == '' && <div className="invalid-feedback d-block">
                                    Email is required
                                </div>}
                                {submitted && !validEmail && inputs.email != '' && <div className="invalid-feedback d-block">
                                    Enter Valid email
                                </div>}
                            </div>
                            <div className='mt-20  fs-18 f-w-b'>
                                <button id="loginBtn" >Continue</button>
                            </div>
                        </form>
                    </div>
                        : <div id="form">
                            <h2>Reset password link send to this email address <b>{email}</b> </h2>
                            <br />
                            <div className='text-center' >

                                <Link to="/login" id="crtAcc">Back to Login</Link>
                            </div>
                        </div>}
                </div>
            </div>
        </>
    )

}
export default ForgotPassword;