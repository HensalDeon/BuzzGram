import Logo from "../../img/logo.png";
import "./LogoSearch.scss";
import { useState } from "react";
import SerachResults from "./SerachResults";
import { useSelector } from "react-redux";

const LogoSearch = () => {
    const [query, setQuery] = useState("");
    const { userDetails } = useSelector((state) => state.adminReducer);

    const filteredUsers = userDetails?.filter(
        (user) =>
            user.username.toLowerCase().includes(query.toLowerCase()) ||
            user.fullname.toLowerCase().includes(query.toLowerCase())
    );

    const handleInputChange = (e) => {
        const inputValue = e.target.value;
        setQuery(inputValue);
    };
    return (
        <div className="LogoSearch">
            <div className="contents">
                <img src={Logo} alt="" />
                <div className="Search" style={{ width: "14rem" }}>
                    <input type="text" placeholder="#Explore" value={query} onChange={handleInputChange} />
                    {query.trim() !== "" && (
                        <div onClick={() => setQuery("")} className="s-icon">
                            <span className="material-symbols-outlined">cancel</span>
                        </div>
                    )}
                </div>
            </div>
            {query.trim() !== "" && (
                <div className="results">
                    <SerachResults users={filteredUsers} />
                </div>
            )}
        </div>
    );
};

export default LogoSearch;
