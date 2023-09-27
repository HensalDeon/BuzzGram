import blockLoard from "../../img/blocklord-logo.png";
import logout from "../../img/icon-lock.svg";
import Profile from "../../img/icon-accounts.svg";
import "./SideBar.scss";
export default function SideBar() {
    const toggleSidebar = () => document.body.classList.toggle("open");

    return (
        <aside className="sidebar">
            <div className="sidebar-inner">
                <header className="sidebar-header">
                    <button type="button" className="sidebar-burger" onClick={toggleSidebar}>
                    </button>
                    <img src={blockLoard} className="sidebar-logo" />
                </header>
                <nav className="sidebar-nav">
                    <button type="button">
                        {/* <img src={Home} /> */}
                        <i className="material-symbols-outlined"> home </i>
                        <span>Home</span>
                    </button>
                    <button type="button">
                        <i className="material-symbols-outlined"> email </i>
                        <span style={{ animationDelay: "0.1s" }}>Messages</span>
                    </button>
                    <button type="button">
                        <i className="material-symbols-outlined"> bookmark </i>
                        <span style={{ animationDelay: "0.3s" }}>Saved</span>
                    </button>
                    <button type="button">
                    <i className="material-symbols-outlined"> person </i>
                        <span style={{ animationDelay: "0.5s" }}>Profile</span>
                    </button>
                </nav>
                <footer className="sidebar-footer">
                    <button type="button">
                        {/* <img src={logout} /> */}
                        <i className="material-symbols-outlined">logout</i>
                        <span>Logout</span>
                    </button>
                </footer>
            </div>
        </aside>
    );
}
