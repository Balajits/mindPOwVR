import { useEffect, useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import logo from '../assets/images/logo2.png';
import PinInput from 'react-pin-input';
import {
    signInWithEmailAndPassword
} from 'firebase/auth';
import { auth } from '../config/firebaseConfig';
import { toast } from 'react-toastify';
import '../App.css';
import Loader from './loader';
import Footer from './footer';

export default function SignIn() {
    const [inputs, setInputs] = useState({
        email: localStorage.getItem("myapp-email") || "",
        pin: localStorage.getItem("myapp-pin") || ""
    });
    const [submitted, setSubmitted] = useState(false);
    const [validEmail, setValidEmail] = useState(true);
    const { email, pin } = inputs;
    const location = useLocation();
    const navigate = useNavigate();
    const [load, setLoad] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);


    useEffect(() => {
        if (localStorage.getItem("myapp-email") && localStorage.getItem("myapp-pin")) {
            setRememberMe(true);
        }
    }, []);

    function handleChange(e) {
        const { name, value } = e.target;
        setInputs(inputs => ({ ...inputs, [name]: value.replace(/\s/g, '') }));
        if (email != '') {
            let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            emailRegex.test(email) ? setValidEmail(true) : setValidEmail(false);

        }
    }

    function handleSubmit(e) {
        e.preventDefault();

        setSubmitted(true);
        if (email && pin && pin.length == 6) {
            setLoad(true);
            if (rememberMe) {
                localStorage.setItem('myapp-email', email);
                localStorage.setItem('myapp-pin', pin);
            } else {
                localStorage.removeItem('myapp-email');
                localStorage.removeItem('myapp-pin');
            }
            // get return url from location state or default to home page
            if (email.toLowerCase() == 'admin@mindpowvr.com' && pin == '123123') {
                localStorage.setItem('admin', JSON.stringify({ 'name': 'admin' }));
                localStorage.removeItem('users');
                setLoad(false);
                navigate('/admin-dashboard');
            } else {
                signInWithEmailAndPassword(auth, email, pin).then((result) => {

                    localStorage.setItem('users', JSON.stringify(result.user));
                    localStorage.removeItem('admin');
                    if (result.user.emailVerified) {
                        toast.info('Success', {
                            theme: 'dark',
                            position: "top-right",
                            hideProgressBar: true,
                            pauseOnHover: false,
                            draggable: false,
                            autoClose: 3000,
                        });
                        setLoad(false);
                        navigate('/');
                    } else {
                        setLoad(false);
                        toast.error('Pls verify email address', {
                            theme: 'dark',
                            position: "top-right",
                            hideProgressBar: true,
                            pauseOnHover: false,
                            draggable: false,
                            autoClose: 5000,
                        })
                    }
                    setLoad(false);

                }).catch((err) => {
                    setLoad(false);
                    toast.error('Incorrect email address or pin', {
                        theme: 'dark',
                        position: "top-right",
                        hideProgressBar: true,
                        pauseOnHover: false,
                        draggable: false,
                        autoClose: 5000,
                    })
                })
            }

        }
    }

    return (
        <>
            <Loader isLoad={load} />
            <div className='auth-bg'>
                <img src={logo} alt="" className="logo-img" />
                <div className="container-body">
                    <div id="form">
                        <h2 className='f-w-b'>Login to your Account</h2>
                        <form autoComplete="off" name="login" onSubmit={handleSubmit}>
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
                                <label className='f-w-l fs-14' htmlFor="pin">Pin</label>
                                <PinInput
                                    length={6}
                                    initialValue={inputs.pin}
                                    secret
                                    secretDelay={100}
                                    onChange={(value, index) => { setInputs(inputs => ({ ...inputs, pin: value })); }}
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

                            <div className="rem-ForgPaswrd-Cont mt-3 fs-12">
                                <div>
                                    <input checked={rememberMe} onChange={e => { setRememberMe(e.target.checked) }} type="checkbox" id="remember" />
                                    <label htmlFor="remember" className='f-w-r fs-12' id="remLabel">Remember Me</label>
                                </div>

                                <div>
                                    <Link to='/forgot-password' className="forgetPasw f-w-r">Forgot Password?</Link>
                                </div>
                            </div>

                            <div className='mt-20 fs-18 f-w-b'>
                                <button id="loginBtn" >Login</button>
                            </div>
                            <br />
                        </form>
                        <div className='text-center fs-18' >
                            <label htmlFor="crtAcc" className='f-w-r' id="notreg-label">Not Registered Yet ? </label>
                            <Link to="/register" className='f-w-b' id="crtAcc">Create an account</Link>
                        </div>

                    </div>
                    <div className='mt-5'><Footer /></div>
                </div>


            </div>

        </>
    )
}