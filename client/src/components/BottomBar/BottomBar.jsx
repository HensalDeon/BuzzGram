import { useEffect} from "react";
import "./BottomBar.scss";
import { useSelector } from "react-redux";
import {useNavigate } from "react-router-dom";
// import Home from "../../pages/home/Home";

function BottomBar() {
    const navigate = useNavigate();

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
                <input
                    id="tab-1"
                    type="radio"
                    name="group"
                    defaultChecked={true}
                />
                <input id="tab-2" type="radio" name="group" />
                <input id="tab-3" type="radio" name="group" />
                <input id="tab-4" type="radio" name="group" />
                <input id="tab-5" type="radio" name="group" />

                <div className="buttons">
                    <label onClick={() => navigate("../home")} className="material-symbols-outlined" htmlFor="tab-1">
                        Home
                    </label>
                    <label className="material-symbols-outlined" htmlFor="tab-2">
                        Chat
                    </label>
                    <label className="material-symbols-outlined" htmlFor="tab-3">
                        Explore
                    </label>
                    <label className="material-symbols-outlined" htmlFor="tab-4">
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
