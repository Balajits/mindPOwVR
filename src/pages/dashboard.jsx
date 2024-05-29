import { react, useEffect, useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { auth } from '../config/firebaseConfig';
import logo from '../assets/images/logo.png';
import '../dashboard.css';

function Dashboard() {
    const navigate = useNavigate();
    const [user, setUser] = useState('')

    useEffect(() => {
        console.log(auth.currentUser);
        if (localStorage.getItem('users')) {
            setUser(localStorage.getItem(JSON.stringify('users')))
        }
    })

    return (

        <div id="container">
            <div id="prfcont">
                <div>
                    <img src={logo} alt="" id="logo" />
                </div>
                <div className='avatar'>
                    <img src={''} alt="" />
                    Raghul
                </div>
            </div>
        </div>

    )

}
export default Dashboard;