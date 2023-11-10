import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { adminLogout } from "../../redux/actions/AuthActions";
import { useDispatch } from "react-redux";
import logo from "../../img/logo-side.png";
import AdminSidebarNav from "../../configs/AdminSidebarNav";
import "./AdminSidebar.scss";

const AdminSidebar = () => {
    const location = useLocation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [activeIndex, setActiveIndex] = useState(0);

    // setting the active item of the side part
    useEffect(() => {
        const curPath = window.location.pathname.split("/admin/")[1];
        const activeItem = AdminSidebarNav.findIndex((item) => item.section === curPath);
        setActiveIndex(activeItem === -1 ? 0 : activeItem);
    }, [location]);

    // handling the sidebar removal
    const closeSidebar = () => {
        document.querySelector(".main__content").style.transform = "scale(1) translateX(0)";
        setTimeout(() => {
            document.body.classList.remove("sidebar-open");
            document.querySelector(".main__content").style = "";
        }, 500);
    };

    // handling logout
    const handleLogout = async () => {
        await dispatch(adminLogout());
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
