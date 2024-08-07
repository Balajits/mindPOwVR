import { react, useEffect, useState } from 'react';
import { useLocation, Link, useNavigate, useParams } from 'react-router-dom';
import { auth, db } from '../config/firebaseConfig';
import logo from '../assets/images/adminlogo.png';
import '../dashboard.css';
import ResponsivePagination from 'react-responsive-pagination';
import { collection, addDoc, getDoc, query, getDocs, where, doc, setDoc, documentId } from "firebase/firestore";
import { format } from 'date-fns';
import Loader from './loader';
import Footer from './footer';
import { toast } from 'react-toastify';

function UserDetailView() {
    const [list, setList] = useState([]);
    const [userData, setUserData] = useState('');
    const [user, setUser] = useState('');
    const uid = useParams();
    const [currentPage, setCurrentPage] = useState(1);
    const [load, setLoad] = useState(false);


    useEffect(() => {
        var user = JSON.parse(localStorage.getItem(("admin")));
        setUser(user);
        getUser(uid.uid);
        getList(uid.uid);

    }, []);

    function handlePageChange(page) {
        setCurrentPage(page);
    }

    async function getUser(user) {
        const q = query(collection(db, "users"), where("uid", "==", user.toString()))
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            setUserData(doc.data());
        });

    }


    function signOut() {
        localStorage.removeItem('admin');
    }

    const getList = async (id) => {
        setLoad(true);
        let uid = 'subscription';
        const q = query(collection(db, uid), where(documentId(), '==', id.toString()))
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            if (Object.keys(doc.data()).length !== 0 || Array.isArray(doc.data().list)) {
                setList(doc.data().list);
            }
        });
        setLoad(false);

    }

    const changeUserStatus = async (e) => {
        setLoad(true);

        let data = {
            name: e.name,
            email: e.email,
            phoneNumber: e.phoneNumber,
            pin: e.pin,
            uid: e.uid,
            accountStatus: e.accountStatus === 'Active' ? 'InActive' : 'Active',
            availableSessions: e.availableSessions,
            disableReason: e.disableReason,
            rating: e.rating,
            sessionLog: e.sessionLog
        }
        await setDoc(doc(db, "users", e.uid), data, { merge: true });

        // var listData = list;
        // listData[i].user = data;
        setUserData(data);
        setLoad(false);


    }

    return (
        <>
            <div className="dashboard">
                <Loader isLoad={load} />

                <nav className="navbar navbar-expand-lg navbar-dark bg-dark bg-black p-0">
                    <div className="container-fluid">
                        <Link className="navbar-brand" to='/admin-dashboard'><img src={logo} alt="" className="nav-logo-img-admin" /></Link>
                        <span className="navbar-text nav-avatar">
                            <div className="dropdown">
                                <button className="btn btn-secondary dropdown-toggle nav-btn user-btn" type="button" id="dropdownMenuButton2" data-bs-toggle="dropdown" aria-expanded="false">
                                    <i className="bi bi-person-circle"></i> {user.name}
                                </button>
                                <ul className="dropdown-menu dropdown-menu-dark ul-li" aria-labelledby="dropdownMenuButton2">
                                    <li><a className="dropdown-item active" onClick={signOut} href="">Signout</a></li>
                                </ul>
                            </div>
                        </span>
                    </div>

                </nav>
                <div className='desktop'>
                    <div className='p-3'>
                        <div className='row m-0'>
                            <div className="col-10">
                                <div className='row'><h2>{userData.name}</h2></div>
                                <div className='row fs-14 fw-100'><h5>{userData.email}</h5></div>
                            </div>
                            <div className="col-2 m-auto">
                                <div className="form-check form-switch">
                                    <input className="form-check-input" onChange={() => changeUserStatus(userData)} checked={userData.accountStatus == 'Active' ? true : false} type="checkbox" id="flexSwitchCheckChecked" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='p-15'>
                        <table className="table table-striped table-dark table-hover non-mobile">
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
                                            <td>{i == 0 ? userData.availableSessions: 0} / {e.noSessions}</td>
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
                                                className="m-0-10 bi bi-copy cursor-pointer"></i></td>
                                            <td>{e.transactionStatus}</td>
                                            <td>{e.amount}</td>
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
                                                <h2 className='fs-32 f-w-b'>{i == 0 ? userData.availableSessions: 0} / {e.noSessions}</h2>
                                            </div>
                                        </div>
                                        <div className="row my-2">
                                            <div className="col-9 fs-14 f-w-r">
                                                {e.transactionId} <i role='button' onClick={() => {
                                                    toast('Copied', {
                                                        theme: 'dark',
                                                        position: "top-right",
                                                        hideProgressBar: true,
                                                        pauseOnHover: false,
                                                        draggable: false,
                                                        autoClose: 1000,
                                                    }); navigator.clipboard.writeText(e.transactionId)
                                                }}
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
            <Footer />
        </>
    )

}

export default UserDetailView;