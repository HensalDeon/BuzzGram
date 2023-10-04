import Auth from "./pages/Auth/Auth";
import Home from "./pages/home/Home";
import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

import "./App.scss";
function App() {
    const user = useSelector((state) => state.authReducer.authData);
    return (
        <div className="App">
            <div className="blur" style={{ top: "-18%", right: "0" }}></div>
            <div className="blur" style={{ top: "36%", left: "-8rem" }}></div>
            <Routes>
                <Route path="/" element={user ? <Navigate to="home" /> : <Navigate to="auth" />} />
                <Route path="/home" element={user ? <Home location="home" /> : <Navigate to="../auth" />} />
                <Route path="/auth" element={user ? <Navigate to="../home" /> : <Auth />} />
                <Route path="/profile/:id" element={user ? <Home location="profile" /> : <Navigate to="../auth" />} />
                <Route path="*" element={<p>just nothing!!</p>} />
            </Routes>
        </div>
    );
}

export default App;
