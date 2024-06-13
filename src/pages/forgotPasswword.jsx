import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/images/logo.png';
import PinInput from 'react-pin-input';
import {
    sendPasswordResetEmail, confirmPasswordReset
} from 'firebase/auth';

import { auth } from '../config/firebaseConfig';
import { ToastContainer, toast } from 'react-toastify';
import '../App.css';
import Loader from './loader';

function ForgotPassword() {
    const [inputs, setInputs] = useState({
        email: '',
    });
    const [pin, setPin] = useState('');
    const [cpin, setCpin] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [success, setIsSuccess] = useState(false);
    const { email } = inputs;
    const [validEmail, setValidEmail] = useState(true);
    const [load, setLoad] = useState(false);

    const queryParameters = new URLSearchParams(window.location.search)
    const oobCode = queryParameters.get("oobCode");
    const [isVerifyPassword, setIsVerifyPassword] = useState(false);
    const [vSubmitted, setVSubmitted] = useState(false);
    const navigate = useNavigate();



    useEffect(() => {

        // console.log(mode)
        console.log(oobCode);
        if (oobCode) {
            setIsVerifyPassword(true);
            // verifyResetCode();

        }
    })

    function verifyResetCode(e) {
        e.preventDefault();

        setVSubmitted(true);

        if (pin !== '' && cpin !== '' && pin == cpin) {
            confirmPasswordReset(auth, oobCode, cpin).then((res) => {
                console.log(res);
                setVSubmitted(false);
                toast.success('Password changed sucessfully, User will navigate to login screen', {
                    theme: 'dark',
                    position: "top-right",
                    hideProgressBar: true,
                    pauseOnHover: false,
                    draggable: false,
                    autoClose: 3000,
                });
                setTimeout(() => {
                    navigate('/');
                }, 3000);

            }).catch((err) => {
                console.log(err);
                setVSubmitted(false);
                toast.error(err.message, {
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
            {!isVerifyPassword ? <div className='auth-bg'>
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
            </div> : <div className='auth-bg'>
                <img src={logo} alt="" className="logo-img" />
                <div className="container-body">
                    <h2 className='f-w-b'>Create new password</h2>
                    <br />
                    <form name="login" onSubmit={verifyResetCode}>
                        <div className='mt-3'>
                            <label htmlFor="password" className='f-w-l fs-14 my-2'>Create a new 6 digit code</label>
                            <PinInput
                                length={6}
                                initialValue={pin}
                                secret
                                secretDelay={10}
                                onChange={(value, index) => { setPin(value) }}
                                type="numeric"
                                inputMode="number"
                                style={{}}
                                inputStyle={{ borderColor: 'white', color: '#fff' }}
                                inputFocusStyle={{ borderColor: 'white', color: '#fff'  }}
                                onComplete={(value, index) => { }}
                                autoSelect={false}
                                name="password"
                                regexCriteria={/^[ A-Za-z0-9_@./#&+-]*$/}
                            />
                            {vSubmitted && pin == '' && <div className="invalid-feedback d-block">
                                Pin is required
                            </div>}
                            {vSubmitted && pin && pin.length != 6 && <div className="invalid-feedback d-block">
                                Pin length should be 6
                            </div>}
                        </div>
                        <div className='mt-3'>
                            <label htmlFor="cpassword" className='f-w-l fs-14 my-2'>Confirm Password</label>
                            <PinInput
                                length={6}
                                initialValue={cpin}
                                secret
                                secretDelay={100}
                                onChange={(value, index) => { setCpin(value) }}
                                type="numeric"
                                inputMode="number"
                                style={{}}
                                inputStyle={{ borderColor: 'white', color: '#fff'  }}
                                inputFocusStyle={{ borderColor: 'white', color: '#fff'  }}
                                onComplete={(value, index) => { }}
                                autoSelect={false}
                                name="password"
                                regexCriteria={/^[ A-Za-z0-9_@./#&+-]*$/}
                            />
                            {vSubmitted && cpin == '' && <div className="invalid-feedback d-block">
                                Confirm Pin is required
                            </div>}
                            {vSubmitted && cpin && cpin.length != 6 && <div className="invalid-feedback d-block">
                                Confirm Pin length should be 6
                            </div>}
                            {vSubmitted && pin != cpin && <div className="invalid-feedback d-block">
                                Pin & Confirm Pin is not matching
                            </div>}
                        </div>
                        <div className='mt-20 fs-18 f-w-b'>
                            <button id="loginBtn" type='submit'>Continue</button>
                        </div>
                    </form>
                </div>
            </div>}
        </>
    )

}
export default ForgotPassword;