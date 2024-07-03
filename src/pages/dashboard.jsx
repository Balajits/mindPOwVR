import { react, useEffect, useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { auth, db } from '../config/firebaseConfig';
import logo from '../assets/images/logo2.png';
import '../dashboard.css';
import ResponsivePagination from 'react-responsive-pagination';
import { collection, query, getDocs, where, doc, setDoc, documentId } from "firebase/firestore";
import { format } from 'date-fns';
import Loader from './loader';
import Footer from './footer';
import { toast } from 'react-toastify';

function Dashboard() {
    const navigate = useNavigate();
    const [user, setUser] = useState('')
    const [list, setList] = useState([]);
    const [isSubscribe, setIsSubscribe] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    var totalPages = 0;
    var [count, setCount] = useState(0);
    const [submitted, setSubmitted] = useState(false);
    const [load, setLoad] = useState(false);

    useEffect(() => {
        var user = JSON.parse(localStorage.getItem(("users")));
        getUser(user);
        getList(user.uid);
    }, []);

    async function getUser(user) {
        const q = query(collection(db, "users"), where("uid", "==", user.uid))
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            setUser(doc.data());
            if (doc.data().availableSessions == 0) {
                setIsSubscribe(false);
            }

        });

    }

    const getList = async (id) => {
        setLoad(true);
        let uid = 'subscription';
        const q = query(collection(db, uid), where(documentId(), '==', id.toString()))
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            if (Object.keys(doc.data()).length !== 0 || Array.isArray(doc.data().list)) {
                // console.log(doc.data().list);
                setList(doc.data().list.reverse());
            }
        });
        setLoad(false);
    }



    function signOut() {
        localStorage.removeItem('users');
    }

    const changeCount = (event) => {
        var value = count;
        if (event == 'add') {
            value += 1;
        } else {
            if (value != 0) {
                value -= 1;

            }
        }

        setCount(value);
    }

    const clear = () => {
        setCount(0);
        setSubmitted(false);
    }

    const subscribe = async () => {
        if (count != 0) {
            setLoad(true);

            setSubmitted(true);
            var data = list;
            data.unshift({
                amount: count * 100,
                date: format(new Date(), 'yyyy-MM-dd'),
                noSessions: count,
                remainingSessions: '',
                subscriptionName: "VR Session",
                transactionId: '123',
                transactionStatus: 'Complete',
                uid: user.uid
            })

            await setDoc(doc(db, "subscription", user.uid), {
                list: data
            });


            var newData = user;
            newData.availableSessions = +newData.availableSessions + count;
            setUser(newData);
            await setDoc(doc(db, "users", user.uid), newData);
            setIsSubscribe(true);

            setList(data);
            setLoad(false);

        }
    }

    function handlePageChange(page) {
        setLoad(true);
        setCurrentPage(page);
        setLoad(false);
    }

    return (
        <>
            <Loader isLoad={load} />
            <div className="dashboard">
                <nav className="navbar navbar-expand-lg navbar-dark bg-dark bg-black p-0">
                    <div className="container-fluid">
                        <Link className="navbar-brand" to='/'><img src={logo} alt="" className="nav-logo-img" /></Link>
                        <span className="navbar-text nav-avatar">
                            <div className="dropdown">
                                <button className="btn btn-secondary dropdown-toggle nav-btn user-btn" type="button" id="dropdownMenuButton2" data-bs-toggle="dropdown" aria-expanded="false">
                                    <i className="bi bi-person-circle"></i> {user.name}
                                </button>
                                <ul className="dropdown-menu dropdown-menu-dark ul-li" aria-labelledby="dropdownMenuButton2">
                                    <li>{user.email}</li>
                                    <li><a className="dropdown-item active" onClick={signOut} href=""><i className=" bi bi-person-check"></i>Signout</a></li>
                                </ul>
                            </div>
                        </span>
                    </div>

                </nav>
                <div className="bannerCont">
                    <div>
                        <div>
                            Subscribe for new sessions
                        </div>
                        <div>
                            <button disabled={isSubscribe} id="newSubscribe"  onClick={() => clear()} data-bs-toggle="modal" data-bs-target="#exampleModal" className="subscribeBtn">Subscribe</button>
                        </div>
                    </div>
                </div>
                <div className="desktop">
                    <div className='p-3'>
                        <h5>Transcation History</h5>
                    </div>
                    <div className='p-15'>
                        <table className="table table-dark table-hover non-mobile">
                            <thead>
                                <tr className='thead'>
                                    <th scope="col">Subscription</th>
                                    <th scope="col">Date</th>
                                    <th scope="col">No. sessions</th>
                                    <th scope="col">Transcation ID</th>
                                    <th scope="col">Transcation Status</th>
                                    <th scope="col">Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* (currentPage - 1) * 5, currentPage * 5 */}
                                {list.length == 0 && <tr className='text-center'> <th colSpan={6}> No records found</th></tr>}
                                {list.length != 0 && list.slice((currentPage - 1) * 5, currentPage * 5).map((e, i) => {
                                    return (
                                        <tr key={i}>
                                            <td>{e.subscriptionName}</td>
                                            <td>{format(e.date, 'yyyy-MM-dd')}</td>
                                            <td>{i == 0 ? user.availableSessions : 0} / {e.noSessions}</td>
                                            <td>{e.transactionId} <i role='button' onClick={() => {
                                                toast('Copied', {
                                                    theme: 'dark',
                                                    position: "top-right",
                                                    hideProgressBar: true,
                                                    pauseOnHover: false,
                                                    draggable: false,
                                                    autoClose: 1000,
                                                }); navigator.clipboard.writeText(e.transactionId)
                                            }}
                                                className="m-0-10 bi bi-copy cursor-pointer"></i> </td>
                                            <td>{e.transactionStatus}</td>
                                            <td>₹&nbsp;{e.amount}</td>
                                        </tr>
                                    )
                                })}
                            </tbody>

                        </table>
                        <div className='mobile mb-5'>
                            {list.length == 0 && <div className='col text-center'> No records found</div>}
                            {list.length != 0 && list.slice((currentPage - 1) * 5, currentPage * 5).map((e, i) => {
                                return (
                                    <div className='mobile-border' key={i}>
                                        <div className='row'>
                                            <div className="col-9">
                                                <div>
                                                    <h3 className='d-inline f-w-r fs-20'>{e.subscriptionName} &nbsp;|&nbsp;</h3>
                                                    <span className='fs-12 fw-100'>{format(e.date, 'yyyy-MM-dd')}</span>
                                                </div>
                                            </div>
                                            <div className="col-3">
                                                <h2 className='fs-32 f-w-b'>{i == 0 ? user.availableSessions : 0} / {e.noSessions}</h2>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-9 fs-14 f-w-r">
                                                {e.transactionId} <i role='button' onClick={() => { toast('Copied', {
                                                    theme: 'dark',
                                                    position: "top-right",
                                                    hideProgressBar: true,
                                                    pauseOnHover: false,
                                                    draggable: false,
                                                    autoClose: 1000,
                                                }); navigator.clipboard.writeText(e.transactionId) }}
                                                    className="m-0-10 bi bi-copy cursor-pointer"></i>
                                            </div>
                                            <div className="col-3  fs-14 fw-300">₹&nbsp;{e.amount}</div>
                                        </div>
                                        <div className="row">
                                            <div className="col fs-14 fw-300">
                                                {e.transactionStatus}
                                            </div>

                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                        {list.length != 0 && <div>
                            <ResponsivePagination
                                current={currentPage}
                                total={Math.ceil(list.length / 5)}
                                onPageChange={page => handlePageChange(page)}
                            />

                        </div>}
                    </div>
                </div>


            </div>


            {/* modal */}
            <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog m-top">
                    <div className="modal-content modal-bg">
                        <div className="modal-header modal-head">
                            {/* <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button> */}
                            <h1 className="modal-title fs-5" id="exampleModalLabel">{!submitted ? 'Subscribe your Mind Power Session' : 'Transcation Completed'}</h1>

                        </div>
                        <div className="modal-body b-0">
                            {!submitted && <div id="sesCountCont">
                                <button type="button" id="decrement" onClick={() => changeCount('sub')}>
                                    <i className="bi bi-dash-circle-fill"></i>
                                </button>
                                <h1 id="sescount" className='fs-80'>{count}</h1>
                                <button type="button" id="increment" onClick={() => changeCount('add')}>
                                    <i className="bi bi-plus-circle-fill"></i>
                                </button>
                            </div>}
                            <div className='text-center'>
                                <p className='m-0'>Total Amount : <i className="bi bi-currency-rupee"></i> <span id="tamt"> {count * 100}</span></p>
                                {!submitted && <button className="subscribeBtn" id="subscribeBtn" onClick={() => subscribe()}>Subscribe</button>}
                                {submitted && <button className="subscribeBtn" id="subscribeBtn" data-bs-dismiss="modal" aria-label="Close" onClick={() => clear()}>Continue</button>}
                            </div>
                        </div>
                        {/* <div className="modal-botton-bg">
                        &nbsp; &nbsp; &nbsp; &nbsp;
                        </div> */}
                    </div>
                </div>
            </div>


            <Footer />


        </>
    )

}
export default Dashboard;