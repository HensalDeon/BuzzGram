import Logo from "../../img/logo.png";
import { UilSearch } from "@iconscout/react-unicons";
import "./LogoSearch.scss";
import PropTypes from "prop-types";
import { useState } from "react";
const LogoSearch = ({ onSearch, location }) => {
    const [query, setQuery] = useState("");

    const handleSearch = () => {
        onSearch(query);
    };

    const handleInputChange = (e) => {
        const inputValue = e.target.value;
        setQuery(inputValue); 
        onSearch(inputValue); 
    };
    return (
        <div className="LogoSearch">
            <img src={Logo} alt="" />
            {location == "admin" ? (
                <div className="Search">
                    <input type="text" placeholder="#Explore" value={query} onChange={handleInputChange} />
                    <div className="s-icon" onClick={handleSearch}>
                        <UilSearch />
                    </div>
                </div>
            ) : (
                <div className="Search">
                    <input type="text" placeholder="#Explore" />
                    <div className="s-icon">
                        <UilSearch />
                    </div>
                </div>
            )}
        </div>
    );
};

LogoSearch.propTypes = {
    onSearch: PropTypes.func.isRequired,
    location: PropTypes.string.isRequired,
};

export default LogoSearch;
