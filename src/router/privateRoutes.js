import { Navigate, Outlet } from 'react-router-dom';
import { auth } from '../config/firebaseConfig';

const history = {
    navigate: null,
    location: null
};

function PrivateRoute() {
    const userDetails = localStorage.getItem('users');
    // console.log(userDetails);

    if (!userDetails) {
        // not logged in so redirect to login page with the return url
        return <Navigate to="/login" state={{ from: history.location }} />
    }

    // authorized so return outlet for child routes
    return <Outlet />;
}

export { PrivateRoute };
export default history;


