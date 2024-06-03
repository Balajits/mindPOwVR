import { react, useEffect, useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { auth, db } from '../config/firebaseConfig';
import logo from '../assets/images/logo.png';
import '../dashboard.css';
import ResponsivePagination from 'react-responsive-pagination';
import { collection, addDoc, getDoc, query, getDocs, where, doc, setDoc, documentId } from "firebase/firestore";
import { format } from 'date-fns';
import UserDetailView from './userDetailView';

function AdminDashboard() {
    var [list, setList] = useState([]);
    const [user, setUser] = useState('');
    const [islistView, setIslistView] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [userDetail, setUserDetail] = useState(null);
    const navigate = useNavigate();


    function signOut() {
        localStorage.clear();
    }


    useEffect(() => {
        var user = JSON.parse(localStorage.getItem(("admin")));
        setUser(user);
        getAllUser();
    }, []);

    const getAllUser = async () => {
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

        setTimeout(() => {
            console.log(list);
        }, 3000);
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

    const userDetailView = (e) => {
        navigate('/admin-dashboard/user/'+e);
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

                <div className='desktop'>
                    
                    <div className='p-15'>
                        <table className="table table-striped table-dark table-hover">
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
                                            <td onClick={() => userDetailView(e.user.uid)}>{e.user.name}</td>
                                            <td>{e.user.phoneNumber}</td>
                                            <td>{e.list.length}</td>
                                            <td>{e.list.length} / {e.list.length}</td>
                                            <td>
                                                <div className="form-check form-switch">
                                                    <input className="form-check-input" type="checkbox" id="flexSwitchCheckChecked" checked={false} />
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    )

}

export default AdminDashboard;