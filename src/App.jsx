import { BrowserRouter } from 'react-router-dom';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import SignIn from './pages/signIn';
import SignUp from './pages/signUp';
import ForgotPassword from './pages/forgotPasswword';
import Dashboard from './pages/dashboard';
import { PrivateRoute, PrivateRouteAdmin } from './router/privateRoutes';
import "bootstrap/dist/css/bootstrap.min.css";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import AdminDashboard from './pages/adminDashboard';
import UserDetailView from './pages/userDetailView';

function App() {
  return (
    <BrowserRouter>
      <ToastContainer />
      <Routes>
        {/* public routes starts */}
        <Route path="/login" element={<SignIn />} />
        <Route path="/register" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/forgot-password/:token" element={<ForgotPassword />} />

        {/* public routes ends */}

        {/* private routes starts */}

        <Route element={<PrivateRoute />}>
          <Route path="/" element={<Dashboard />} />
        </Route>
        <Route element={<PrivateRouteAdmin />}>
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/admin-dashboard/user/:uid" element={<UserDetailView />} />
        </Route>
        {/* private routes ends */}

      </Routes>
    </BrowserRouter>
  );
}

export default App;
