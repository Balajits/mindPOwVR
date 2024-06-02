import { react, useEffect, useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { auth, db } from '../config/firebaseConfig';
import logo from '../assets/images/logo.png';
import '../dashboard.css';
import ResponsivePagination from 'react-responsive-pagination';
import { collection, addDoc, getDoc, query, getDocs, where, doc, setDoc, documentId } from "firebase/firestore";

function Dashboard() {
    const navigate = useNavigate();
    const [user, setUser] = useState('')
    const [list, setList] = useState([]);
    const [currentPage, setCurrentPage] = useState(8);
    const totalPages = 20;
    var [count, setCount] = useState(0);
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        var user = JSON.parse(localStorage.getItem(("users")));
        getUser(user);
        getList(user.uid);
    }, []);

    async function getUser(user) {
        const q = query(collection(db, "users"), where("uid", "==", user.uid))
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            setUser(doc.data());
            // console.log(doc.id, " => ", doc.data());
            // getList(doc.id);
           
        });

    }

    const getList = async (id) => {
        console.log(id);
        let uid = 'subscription';
        const q = query(collection(db, uid), where(documentId(), '==', id.toString()))
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            console.log(doc.id, " => ", doc.data());
            // setList(doc.data().list);
        });

        setTimeout(() => {
            console.log(list)
        });
    }

    function signOut() {
        localStorage.clear();
    }

    const changeCount = (event) => {
        console.log(event);
        var value = count;
        if (event == 'add') {
            console.log(value);
            value += 1;
        } else {
            if (value != 0) {
                value -= 1;
                console.log(value);

            }
        }
        console.log(value);

        setCount(value);
        console.log(count)
    }

    function clear() {
        // setCount(0);
        // setSubmitted(false);
    }

    const subscribe = async () => {
        if (count != 0) {
            setSubmitted(true);

            await setDoc(doc(db, "subscription", user.uid), {
                list: [
                    {
                        amount: count * 100,
                        date: new Date(),
                        noSessions: count,
                        remainingSessions: '',
                        subscriptionName: "VR Session",
                        transactionId: '123',
                        transactionStatus: 'Complete',
                        uid: user.uid
                    }
                ]
            });

        }
    }

    return (
        <>
            <div className="dashboard">
                <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                    <div className="container-fluid">
                        <Link className="navbar-brand" to='/'><img src={logo} alt="" className="nav-logo-img" /></Link>
                        <div className="collapse navbar-collapse" id="navbarText">
                        </div>
                    </div>
                    <span className="navbar-text nav-avatar">
                        <div className="dropdown">
                            <button className="btn btn-secondary dropdown-toggle nav-btn" type="button" id="dropdownMenuButton2" data-bs-toggle="dropdown" aria-expanded="false">
                                <i className="bi bi-person-circle"></i> {user.name}
                            </button>
                            <ul className="dropdown-menu dropdown-menu-dark" aria-labelledby="dropdownMenuButton2">
                                <li><a className="dropdown-item active" onClick={signOut} href="">Signout</a></li>
                            </ul>
                        </div>
                    </span>
                </nav>
                <div className="bannerCont">
                    <div>
                        <div>
                            Subscribe for new sessions
                        </div>
                        <div>
                            <button id="newSubscribe" data-bs-toggle="modal" data-bs-target="#exampleModal" className="subscribeBtn">Subscribe</button>
                        </div>
                    </div>
                </div>
                <div className="desktop">
                    <div className='p-3'>
                        <h5>Transcation History</h5>
                    </div>
                    <div className='p-15'>
                        <table className="table table-striped table-dark table-hover">
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
                                {list.length == 0 && <tr className='text-center'> <th colSpan={6}> No records found</th></tr>}
                            </tbody>

                        </table>
                        <div>
                            <ResponsivePagination
                                current={currentPage}
                                total={totalPages}
                                onPageChange={setCurrentPage}
                            />

                        </div>
                    </div>
                </div>


            </div>


            {/* modal */}
            <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content modal-bg">
                        <div className="modal-header modal-head">
                            {/* <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button> */}
                            <h1 className="modal-title fs-5" id="exampleModalLabel">{!submitted ? 'Subscribe your Mind Power Session' : 'Transcation Completed'}</h1>

                        </div>
                        <div className="modal-body b-0">
                            {!submitted && <div id="sesCountCont">
                                <button type="button" id="decrement" onClick={() => changeCount('sub')}>
                                    <i className="bi bi-dash-circle-fill"></i>
                                </button>
                                <h1 id="sescount">{count}</h1>
                                <button type="button" id="increment" onClick={() => changeCount('add')}>
                                    <i className="bi bi-plus-circle-fill"></i>
                                </button>
                            </div>}
                            <div className='text-center'>
                                <p className='m-0'>Total Amount : <i class="bi bi-currency-rupee"></i> <span id="tamt"> {count * 100}</span></p>
                                {!submitted && <button class="subscribeBtn" id="subscribeBtn" onClick={() => subscribe()}>Subscribe</button>}
                                {submitted && <button class="subscribeBtn" id="subscribeBtn" data-bs-dismiss="modal" aria-label="Close" onClick={clear()}>Continue</button>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>


        </>
    )

}
export default Dashboard;