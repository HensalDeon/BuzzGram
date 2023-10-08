import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../../img/logo-side.png";
import AdminSidebarNav from "../../configs/AdminSidebarNav";
import "./AdminSidebar.scss";
import { adminLogout } from "../../redux/actions/AuthActions";
import { useDispatch } from "react-redux";

const AdminSidebar = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const location = useLocation();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        const curPath = window.location.pathname.split("/admin/")[1];
        const activeItem = AdminSidebarNav.findIndex((item) => item.section === curPath);

        setActiveIndex(activeItem === -1 ? 0 : activeItem);
    }, [location]);

    const closeSidebar = () => {
        document.querySelector(".main__content").style.transform = "scale(1) translateX(0)";
        setTimeout(() => {
            document.body.classList.remove("sidebar-open");
            document.querySelector(".main__content").style = "";
        }, 500);
    };

    const handleLogout = () => {
        dispatch(adminLogout());
        navigate("/admin/auth");
    };

    return (
        <div className="adminsidebar">
            <div className="logo">
                <img src={logo} alt="" />
                <div className="sidebar-close" onClick={closeSidebar}>
                    <i className="bx bx-x"></i>
                </div>
            </div>
            <div className="adminmenu">
                {AdminSidebarNav.map((nav, index) => (
                    <Link
                        to={nav.link}
                        key={`nav-${index}`}
                        className={`adminitem ${activeIndex === index && "active"}`}
                        onClick={closeSidebar}
                    >
                        <div className="adminicon">{nav.icon}</div>
                        <div className="adminsidebar__menu__item__txt">{nav.text}</div>
                    </Link>
                ))}
                <div className="adminitem">
                    <div className="adminicon">
                        <i className="bx bx-log-out"></i>
                    </div>
                    <div className="adminsidebar__menu__item__txt" onClick={handleLogout}>
                        Logout
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminSidebar;
