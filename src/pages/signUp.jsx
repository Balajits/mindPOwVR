import { useEffect, useState } from 'react';
import logo from '../assets/images/logo.png';
import { auth, db } from '../config/firebaseConfig';
import {
    createUserWithEmailAndPassword,
    sendEmailVerification, updateProfile

} from 'firebase/auth';
import { collection, addDoc, getDocs, doc, setDoc } from "firebase/firestore";
import PinInput from 'react-pin-input';
import { ToastContainer, toast } from 'react-toastify';
import { useLocation, Link } from 'react-router-dom';
import '../App.css';
import Loader from './loader';

function SignUp() {
    const [inputs, setInputs] = useState({
        name: '',
        phoneNumber: '',
        email: '',
    });
    const [pin, setPin] = useState('');
    const [cpin, setCpin] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [validEmail, setValidEmail] = useState(true);
    const [isActivationScreen, setIsActivationScreen] = useState(null);
    const { name, email, phoneNumber } = inputs;
    const location = useLocation();
    const [load, setLoad] = useState(false);


    function handleChange(e) {

        var { name, value } = e.target;
        if (name == 'phoneNumber') {
            value = value.replace(/\D/g, "");
        }
        setInputs(inputs => ({ ...inputs, [name]: value }));
        if (email != '') {
            let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            emailRegex.test(email) ? setValidEmail(true) : setValidEmail(false);

        }
    }



    function handleSubmit(e) {
        e.preventDefault();

        setSubmitted(true);
        // generateRecaptcha();
        if (name !== '' && phoneNumber !== '' && email !== '' && pin !== '' && cpin !== '' && validEmail && (cpin == pin)) {
            console.log('OK');
            setLoad(true);

            createUserWithEmailAndPassword(auth, email, pin).then((result) => {
                const actionCodeSettings = {
                    url: 'https://mindpowvr.netlify.app/',
                    handleCodeInApp: true
                };
                toast.success('User created sucessfully', {
                    theme: 'dark',
                    position: "top-right",
                    hideProgressBar: true,
                    pauseOnHover: false,
                    draggable: false,
                    autoClose: 5000,
                });
                setLoad(false);

                sendEmailVerification(result.user, actionCodeSettings).then(async (res) => {
                    await setDoc(doc(db, "users", result.user.uid), {
                        name: name,
                        email: email,
                        phoneNumber: phoneNumber,
                        pin: pin,
                        uid: result.user.uid,
                        accountStatus: 'Active',
                        availableSessions: 0,
                        disableReason: 'Your account has been disabled!',
                        rating: '',
                        sessionLog: []
                    });
                    setIsActivationScreen(email);
                    setCpin('');
                    setPin('');
                    setInputs({
                        name: '',
                        phoneNumber: '',
                        email: '',
                    });
                    auth.signOut();
                }).catch((err) => {
                    console.log(err);
                    setLoad(false);
                    toast.error(err.message, {
                        theme: 'dark',
                        position: "top-right",
                        hideProgressBar: true,
                        pauseOnHover: false,
                        draggable: false,
                        autoClose: 5000,
                    });
                })
            }).catch((error) => {
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
                    {!isActivationScreen ? <div id="form">
                        <h2 className='f-w-b'>Create your account</h2>
                        <form name="login" onSubmit={handleSubmit}>
                            <div className='mt-3'>
                                <label htmlFor="name" className='f-w-l fs-14'>Name</label>
                                <div>
                                    <input className={` ${submitted && inputs.name == '' ? 'form-control is-invalid' : ''}`} type="text" name='name' id="Name" onChange={handleChange} value={inputs.name} />
                                </div>
                                {submitted && inputs.name == '' && <div className="invalid-feedback d-block">
                                    Name is required
                                </div>}
                            </div>
                            <div className='mt-3'>
                                <label htmlFor="phoneNumber" className='f-w-l fs-14'>Phone Number</label>
                                <div>
                                    <input type="text" maxLength={14} name='phoneNumber' id="phoneNumber" onChange={handleChange} value={inputs.phoneNumber} />
                                </div>
                                {submitted && inputs.phoneNumber == '' && <div className="invalid-feedback d-block">
                                    Phone number is required
                                </div>}
                            </div>

                            <div className='mt-3'>
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

                            <div className='mt-3'>
                                <label htmlFor="password" className='f-w-l fs-14'>Pin</label>
                                <PinInput
                                    length={6}
                                    initialValue={pin}
                                    secret
                                    secretDelay={100}
                                    onChange={(value, index) => { setPin(value) }}
                                    type="numeric"
                                    inputMode="number"
                                    style={{}}
                                    inputStyle={{ borderColor: 'white' }}
                                    inputFocusStyle={{ borderColor: 'white' }}
                                    onComplete={(value, index) => { }}
                                    autoSelect={false}
                                    name="password"
                                    regexCriteria={/^[ A-Za-z0-9_@./#&+-]*$/}
                                />
                                {submitted && pin == '' && <div className="invalid-feedback d-block">
                                    Pin is required
                                </div>}
                                {submitted && pin && pin.length != 6 && <div className="invalid-feedback d-block">
                                    Pin length should be 6
                                </div>}
                            </div>

                            <div className='mt-3'>
                                <label htmlFor="cpassword" className='f-w-l fs-14'>Confirm Password</label>
                                <PinInput
                                    length={6}
                                    initialValue={cpin}
                                    secret
                                    secretDelay={100}
                                    onChange={(value, index) => { setCpin(value) }}
                                    type="numeric"
                                    inputMode="number"
                                    style={{}}
                                    inputStyle={{ borderColor: 'white' }}
                                    inputFocusStyle={{ borderColor: 'white' }}
                                    onComplete={(value, index) => { }}
                                    autoSelect={false}
                                    name="password"
                                    regexCriteria={/^[ A-Za-z0-9_@./#&+-]*$/}
                                />
                                {submitted && cpin == '' && <div className="invalid-feedback d-block">
                                    Confirm Pin is required
                                </div>}
                                {submitted && cpin && cpin.length != 6 && <div className="invalid-feedback d-block">
                                    Confirm Pin length should be 6
                                </div>}
                                {submitted && pin != cpin && <div className="invalid-feedback d-block">
                                    Pin & Confirm Pin is not matching
                                </div>}
                            </div>
                            <div id="recaptcha-container"></div>
                            <div className='mt-20 fs-18 f-w-b'>
                                <button id="loginBtn" type='submit'>Create Account</button>
                            </div>
                            <br />
                        </form>


                    </div> :
                        <div id="form">
                            <h2>Activation Mail send to this email address <b>{isActivationScreen}</b> </h2>
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
export default SignUp;