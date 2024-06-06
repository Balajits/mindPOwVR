import { react, useEffect, useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { auth, db } from '../config/firebaseConfig';
import logo from '../assets/images/logo.png';
import '../dashboard.css';
import ResponsivePagination from 'react-responsive-pagination';
import { collection, addDoc, getDoc, query, getDocs, where, doc, setDoc, documentId } from "firebase/firestore";
import { format } from 'date-fns';
import Loader from './loader';

function AdminDashboard() {
    var [list, setList] = useState([]);
    const [user, setUser] = useState('');
    const [islistView, setIslistView] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [userDetail, setUserDetail] = useState(null);
    const navigate = useNavigate();
    const [load, setLoad] = useState(false);


    function signOut() {
        localStorage.clear();
    }


    useEffect(() => {
        var user = JSON.parse(localStorage.getItem(("admin")));
        setUser(user);
        getAllUser();
    }, []);

    const getAllUser = async () => {
        setLoad(true);
        const q = query(collection(db, "users"));
        const querySnapshot = await getDocs(q);
        var data = [];
        await querySnapshot.forEach(async (doc, i) => {
            await new Promise(async (next) => {
                await getList(doc.id).then((res) => {
                    setList(list => [...list, { user: doc.data(), list: res }]);
                    next();
                }).catch((err) => {
                    setList(list => [...list, { user: doc.data(), list: [] }]);
                    next();
                });
            });
        });
        setLoad(false);
    }

    const getList = async (id) => {
        // console.log(id);

        return new Promise(async (resolve, reject) => {
            let uid = 'subscription';
            const q = query(collection(db, uid), where(documentId(), '==', id.toString()))
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                if (Object.keys(doc.data()).length !== 0 || Array.isArray(doc.data().list)) {
                    resolve(doc.data().list);
                } else {
                    resolve(null);
                }
            });
        })

    }

    const changeUserStatus = async (e, i) => {
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

        var listData = list;
        listData[i].user = data;
        setList([...listData]);
        setLoad(false);
    }

    const userDetailView = (e) => {
        console.log('asdadas')
        navigate('/admin-dashboard/user/' + e);
    }

    return (
        <>
         <Loader isLoad={load} />
            <div className="dashboard">
                <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                    <div className="container-fluid">
                        <Link className="navbar-brand" to='/admin-dashboard'><img src={logo} alt="" className="nav-logo-img" /></Link>
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
                    </div>
                </nav>

                <div className='desktop'>

                    <div className='p-15'>
                        <table className="table table-striped table-dark table-hover non-mobile">
                            <thead>
                                <tr className='thead'>
                                    <th scope="col">User Name</th>
                                    <th scope="col">Phone number</th>
                                    <th scope="col">No. Subscriptions</th>
                                    <th scope="col">No. Sessions</th>
                                    <th scope="col">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {list.length == 0 && <tr className='text-center'> <th colSpan={6}> No records found</th></tr>}
                                {list.length != 0 && list.slice((currentPage - 1) * 5, currentPage * 5).map((e, i) => {
                                    return (
                                        <tr key={i}>
                                            <td role='button' className='cursor-pointer text-decoration-underline' onClick={() => userDetailView(e.user.uid)}>{e.user.name}</td>
                                            <td>{e.user.phoneNumber}</td>
                                            <td>{e.list.length}</td>
                                            <td>{e.list.length} / {e.list.length}</td>
                                            <td>
                                                <div className="form-check form-switch">
                                                    <input className="form-check-input" type="checkbox" id="flexSwitchCheckChecked" onChange={() => changeUserStatus(e.user, i)} checked={e.user.accountStatus == 'Active' ? true : false} />
                                                </div>
                                            </td>
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
                                                    <h3 className='d-inline f-w-r fs-20 cursor-pointer' onClick={() => userDetailView(e.user.uid)}>{e.user.name} &nbsp;|&nbsp;</h3>
                                                    <span className='fs-12 fw-100'>{e.user.phoneNumber}</span>
                                                </div>
                                            </div>
                                            <div className="col-3">
                                                <div className="form-check form-switch">
                                                    <input className="form-check-input" type="checkbox" id="flexSwitchCheckChecked" onChange={() => changeUserStatus(e.user, i)} checked={e.user.accountStatus == 'Active' ? true : false} />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row my-2">
                                            <div className="col-12 fs-14 f-w-r">
                                                No. Subscriptions: {e.list.length}
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col fs-14 fw-300">
                                                No. Sessions: {e.list.length} / {e.list.length}
                                            </div>

                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )

}

export default AdminDashboard;