import { UilSearch } from "@iconscout/react-unicons";
import { useState } from "react";
import PropTypes from "prop-types";
import "./LogoSearch.scss";

const AdminSearch = ({ onSearch }) => {
    const [query, setQuery] = useState("");
    const handleInputChange = (e) => {
        const inputValue = e.target.value;
        setQuery(inputValue);
        onSearch(inputValue);
    };
    return (
        <div className="LogoSearch">
            <div className="contents">
                <div className="Search">
                    <input type="text" placeholder="#Explore" value={query} onChange={handleInputChange} />
                    <div className="s-icon">
                        <UilSearch />
                    </div>
                </div>
            </div>
        </div>
    );
};

AdminSearch.propTypes = {
    onSearch: PropTypes.func.isRequired,
    location: PropTypes.string.isRequired,
};

export default AdminSearch;
