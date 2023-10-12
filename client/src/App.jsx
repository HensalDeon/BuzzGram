import "./assets/libs/boxicons-2.1.1/css/boxicons.min.css";
import Auth from "./pages/Auth/Auth";
import AdminAuth from "./pages/Auth/AdminAuth";
import Home from "./pages/home/Home";
import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import "./scss/Integrate.scss";
import "./App.scss";
import Admin from "./pages/Admin/Admin";
import Blank from "./components/Blank/Blank";
import Dashboard from "./pages/Admin/Dashboard";
import UserList from "./components/UserList/UserList";
function App() {
    const user = useSelector((state) => state.authReducer.authData);
    const admin = useSelector((state) => state.authReducer.adminAuthData);
    const Authorized = user && user.user.isblocked !== true;
    return (
        <div className="App">
            <div className="blur" style={{ top: "-18%", right: "0" }}></div>
            <div className="blur" style={{ top: "36%", left: "-8rem" }}></div>
            <Routes>
                {/* User routes */}
                <Route path="/" element={Authorized ? <Navigate to="home" /> : <Navigate to="auth" />} />
                <Route path="/home" element={Authorized ? <Home location="home" /> : <Navigate to="../auth" />} />
                <Route path="/explore" element={Authorized ? <Home location="explore" /> : <Navigate to="../auth" />} />
                <Route path="/saved" element={Authorized ? <Home location="saved" /> : <Navigate to="../auth" />} />
                <Route path="/auth" element={Authorized ? <Navigate to="../home" /> : <Auth />} />
                <Route path="/profile/:id" element={Authorized ? <Home location="profile" /> : <Navigate to="../auth" />} />
                <Route path="*" element={<p>just nothing!!</p>} />

                {/* Admin routes */}
                <Route path="/admin/" element={admin ? <Admin /> : <Navigate to="auth" />}>
                    <Route index element={<Dashboard />} />
                    <Route path="users" element={admin ? <UserList /> : <Navigate to="../auth" />} />
                    <Route path="posts" element={admin ? <Blank /> : <Navigate to="../auth" />} />
                    <Route path="reports" element={admin ? <Blank /> : <Navigate to="../auth" />} />
                </Route>
                <Route path="/admin/auth" element={admin ? <Navigate to="../admin" /> : <AdminAuth />} />
            </Routes>
        </div>
    );
}

export default App;
