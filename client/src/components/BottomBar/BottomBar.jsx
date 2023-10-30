import { useEffect } from "react";
import "./BottomBar.scss";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

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
        <motion.aside
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="bottombar"
        >
            <div className="tabs">
                <input id="tab-1" type="radio" name="group" defaultChecked={location.pathname.includes("/home")} />
                <input id="tab-2" type="radio" name="group" defaultChecked={location.pathname.includes("/chat")} />
                <input id="tab-3" type="radio" name="group" defaultChecked={location.pathname.includes("/explore")} />
                <input id="tab-4" type="radio" name="group" defaultChecked={location.pathname.includes("/saved")} />
                <input id="tab-5" type="radio" name="group" defaultChecked={location.pathname.includes("/profile")} />

                <div className="buttons">
                    <motion.label
                        whileHover={{ scale: 1.3 }}
                        transition={{ duration: 0.3 }}
                        onClick={() => navigate("/home")}
                        className="material-symbols-outlined"
                        htmlFor="tab-1"
                    >
                        Home
                    </motion.label>
                    <label className="material-symbols-outlined" htmlFor="tab-2">
                        Chat
                    </label>
                    <motion.label
                        whileHover={{ scale: 1.3 }}
                        transition={{ duration: 0.3 }}
                        onClick={() => navigate("/explore")}
                        className="material-symbols-outlined"
                        htmlFor="tab-3"
                    >
                        Explore
                    </motion.label>
                    <motion.label
                        whileHover={{ scale: 1.3 }}
                        transition={{ duration: 0.3 }}
                        onClick={() => navigate("/saved")}
                        className="material-symbols-outlined"
                        htmlFor="tab-4"
                    >
                        Bookmark
                    </motion.label>
                    <motion.label
                        whileHover={{ scale: 1.3 }}
                        transition={{ duration: 0.3 }}
                        onClick={() => navigate(`/profile/${user._id}`)}
                        className="material-symbols-outlined"
                        htmlFor="tab-5"
                    >
                        Person
                    </motion.label>
                    <div className="underline"></div>
                </div>
            </div>
        </motion.aside>
    );
}

export default BottomBar;
