import { useEffect } from "react";
import "./BottomBar.scss";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
// import Home from "../../pages/home/Home";

function BottomBar() {
    const navigate = useNavigate();
    const location = useLocation();

    const { user } = useSelector((state) => state.authReducer.authData);

    useEffect(() => {
        const BottomBar = document.querySelector(".bottombar");
        BottomBar.classList.add("initial");
        setTimeout(() => {
            BottomBar.classList.remove("initial");
        }, 100);
    }, []);
    return (
        <aside className="bottombar">
            <div className="tabs">
                <input id="tab-1" type="radio" name="group" defaultChecked={location.pathname.includes("/home")} />
                <input id="tab-2" type="radio" name="group" />
                <input id="tab-3" type="radio" name="group" defaultChecked={location.pathname.includes("/explore")} />
                <input id="tab-4" type="radio" name="group" defaultChecked={location.pathname.includes("/saved")} />
                <input id="tab-5" type="radio" name="group" defaultChecked={location.pathname.includes("/profile")} />

                <div className="buttons">
                    <label onClick={() => navigate("/home")} className="material-symbols-outlined" htmlFor="tab-1">
                        Home
                    </label>
                    <label className="material-symbols-outlined" htmlFor="tab-2">
                        Chat
                    </label>
                    <label onClick={() => navigate("/explore")} className="material-symbols-outlined" htmlFor="tab-3">
                        Explore
                    </label>
                    <label onClick={() => navigate("/saved")} className="material-symbols-outlined" htmlFor="tab-4">
                        Bookmark
                    </label>
                    <label
                        onClick={() => navigate(`/profile/${user._id}`)}
                        className="material-symbols-outlined"
                        htmlFor="tab-5"
                    >
                        Person
                    </label>
                    <div className="underline"></div>
                </div>
            </div>
        </aside>
    );
}

export default BottomBar;
