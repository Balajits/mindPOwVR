import './App.css';
import { BrowserRouter } from 'react-router-dom';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import SignIn from './pages/signIn';
import SignUp from './pages/signUp';
import ForgotPassword from './pages/forgotPasswword';
import Dashboard from './pages/dashboard';
import { PrivateRoute } from './router/privateRoutes';
import "bootstrap/dist/css/bootstrap.min.css";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';

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
        {/* private routes ends */}

      </Routes>
    </BrowserRouter>
  );
}

export default App;
