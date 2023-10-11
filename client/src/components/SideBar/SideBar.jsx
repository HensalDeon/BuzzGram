import { useEffect } from "react";
import logo from "../../img/logo-side.png";
import HOME from "../../img/icon-flatHome.svg";
import CHAT from "../../img/icon-flatChat.svg";
import SAVED from "../../img/icon-flatSaved.svg";
import PROFILE from "../../img/icon-flatProfile.svg";
import LOGOUT from "../../img/icon-flatLogout.svg";
import EXPLORE from "../../img/icon-flatExplore.svg";
import "./SideBar.scss";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/actions/AuthActions";

export default function SideBar() {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.authReducer.authData);

    const toggleSidebar = () => document.body.classList.toggle("open");
    useEffect(() => {
        const SideBar = document.querySelector(".sidebar");
        SideBar.classList.add("initial");
        setTimeout(() => {
            SideBar.classList.remove("initial");
        }, 100);
    }, []);

    const handleLogOut = () => {
        dispatch(logout());
    };

    return (
        <aside className="sidebar">
            <div className="sidebar-inner">
                <header className="sidebar-header">
                    <button type="button" className="sidebar-burger" onClick={toggleSidebar}></button>
                    <img src={logo} className="sidebar-logo" />
                </header>
                <nav className="sidebar-nav">
                    <button type="button">
                        <Link className="material-symbols-outlined" to={"../home"}>
                            <img style={{ width: "2rem" }} src={HOME} alt="home"></img>
                        </Link>
                        <span>Home</span>
                    </button>
                    <button type="button">
                        <Link className="material-symbols-outlined">
                            <img style={{ width: "2rem" }} src={CHAT} alt="chat" />
                        </Link>
                        <span style={{ animationDelay: "0.1s" }}>Messages</span>
                    </button>
                    <button type="button">
                        <Link className="material-symbols-outlined" to={"/explore"}>
                            <img style={{ width: "2rem" }} src={EXPLORE} alt="explore" />
                        </Link>
                        <span style={{ animationDelay: "0.1s" }}>Explore</span>
                    </button>
                    <button type="button">
                        <Link className="material-symbols-outlined">
                            <img style={{ width: "2rem" }} src={SAVED} alt="saved" />
                        </Link>
                        <span style={{ animationDelay: "0.3s" }}>Saved</span>
                    </button>
                    <button type="button">
                        <Link className="material-symbols-outlined" to={`/profile/${user._id}`}>
                            <img style={{ width: "2rem" }} src={PROFILE} alt="profile" />
                        </Link>
                        <span style={{ animationDelay: "0.5s" }}>Profile</span>
                    </button>
                </nav>
                <footer className="sidebar-footer">
                    <button type="button" onClick={handleLogOut}>
                        <i className="material-symbols-outlined">
                            <img style={{ width: "1.8rem" }} src={LOGOUT} alt="logout" />
                        </i>
                        <span>Logout</span>
                    </button>
                </footer>
            </div>
        </aside>
    );
}
