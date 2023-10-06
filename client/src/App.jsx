import './assets/libs/boxicons-2.1.1/css/boxicons.min.css'
import Auth from "./pages/Auth/Auth";
import Home from "./pages/home/Home";
import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import "./scss/Integrate.scss"
import "./App.scss";
import Admin from './pages/Admin/Admin';
import Blank from './components/Blank/Blank';
import Dashboard from './pages/Admin/Dashboard';
import UserList from './components/UserList/UserList';
function App() {
    const user = useSelector((state) => state.authReducer.authData);
    return (
        <div className="App">
            <div className="blur" style={{ top: "-18%", right: "0" }}></div>
            <div className="blur" style={{ top: "36%", left: "-8rem" }}></div>
            <Routes>
                {/* User routes */}
                <Route path="/" element={user ? <Navigate to="home" /> : <Navigate to="auth" />} />
                <Route path="/home" element={user ? <Home location="home" /> : <Navigate to="../auth" />} />
                <Route path="/auth" element={user ? <Navigate to="../home" /> : <Auth />} />
                <Route path="/profile/:id" element={user ? <Home location="profile" /> : <Navigate to="../auth" />} />
                <Route path="*" element={<p>just nothing!!</p>} />

                {/* Admin routes */}
                <Route path="/admin/" element={<Admin />}>
                    <Route index element={<Dashboard />} />
                    <Route path="users" element={<UserList />} />
                    <Route path="posts" element={<Blank />} />
                    <Route path="reports" element={<Blank />} />
                </Route>
            </Routes>
        </div>
    );
}

export default App;
