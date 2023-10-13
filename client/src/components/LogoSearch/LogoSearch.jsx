// import Logo from "../../img/logo.png";
// import "./LogoSearch.scss";
// import { useState } from "react";
// import SerachResults from "./SerachResults";
// import { useSelector } from "react-redux";

// const LogoSearch = () => {
//     const [query, setQuery] = useState("");
//     const { userDetails } = useSelector((state) => state.adminReducer);

//     const filteredUsers = userDetails?.filter(
//         (user) =>
//             user.username.toLowerCase().includes(query.toLowerCase()) ||
//             user.fullname.toLowerCase().includes(query.toLowerCase())
//     );

//     const handleInputChange = (e) => {
//         const inputValue = e.target.value;
//         setQuery(inputValue);
//     };
//     return (
//         <div className="LogoSearch">
//             <div className="contents">
//                 <img src={Logo} alt="" />
//                 <div className="Search" style={{ width: "14rem" }}>
//                     <input type="text" placeholder="#Explore" value={query} onChange={handleInputChange} />
//                     {query.trim() !== "" && (
//                         <div onClick={() => setQuery("")} className="s-icon">
//                             <span className="material-symbols-outlined">cancel</span>
//                         </div>
//                     )}
//                 </div>
//             </div>
//             {query.trim() !== "" && (
//                 <div className="results">
//                     <SerachResults users={filteredUsers} />
//                 </div>
//             )}
//         </div>
//     );
// };

// export default LogoSearch;
import Logo from "../../img/logo.png";
import "./LogoSearch.scss";
import { useState } from "react";
import SerachResults from "./SerachResults";
import { debounce } from "lodash";
import { searchUser } from "../../api/UserRequests";
import BeatLoader from "react-spinners/BeatLoader";
const LogoSearch = () => {
    const [query, setQuery] = useState("");
    const [filteredUsers, setFilteredUsers] = useState([]);
    let [loading, setLoading] = useState(true);
    const override = {
        margin: "0 40%",
    };

    const debouncedSearch = debounce(async (inputValue) => {
        searchUser(inputValue)
            .then((response) => {
                setLoading(false);
                setFilteredUsers(response.data);
            })
            .catch(() => {
                setLoading(false);
            });
    }, 400);

    const handleInputChange = (e) => {
        const inputValue = e.target.value;
        setQuery(inputValue);
        debouncedSearch(inputValue);
    };
    return (
        <div className="LogoSearch">
            <div className="contents">
                <img src={Logo} alt="" />
                <div className="Search" style={{ width: "14rem" }}>
                    <input type="text" placeholder="#Find users" value={query} onChange={handleInputChange} />
                    {query.trim() !== "" && (
                        <div onClick={() => setQuery("")} className="s-icon">
                            <span className="material-symbols-outlined">cancel</span>
                        </div>
                    )}
                </div>
            </div>
            {query.trim() !== "" && (
                <div className="results">
                    <BeatLoader loading={loading} cssOverride={override} color="#d67b36" />
                    {!loading && !filteredUsers.length > 0 && (
                        <div className="noResult">
                            <span className="lg-text">No Users Found!</span>
                        </div>
                    )}
                    <SerachResults users={filteredUsers} />
                </div>
            )}
        </div>
    );
};

export default LogoSearch;
