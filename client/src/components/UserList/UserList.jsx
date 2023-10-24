import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserDetails } from "../../redux/actions/AdminActions";
import { Toaster } from "react-hot-toast";
import { motion } from "framer-motion";
import PacmanLoader from "react-spinners/PacmanLoader";
import AdminSearch from "../LogoSearch/AdminSearch";
import List from "./List";

import "./UserList.scss";

function UserList() {
    const dispatch = useDispatch();
    const { userDetails, loading } = useSelector((state) => state.adminReducer);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        dispatch(getUserDetails());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const filteredUsers = userDetails?.filter((user) => user.username.toLowerCase().includes(searchQuery.toLowerCase()));

    const override = {
        display: "block",
        margin: "0 auto",
    };

    return (
        <>
            <Toaster position="top-center" reverseOrder={false}></Toaster>
            <AdminSearch onSearch={(query) => setSearchQuery(query)} location="admin" />
            <div className="table-container">
                <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }}>
                    <table className="table">
                        <thead className="table-head">
                            <tr>
                                <th style={{ display: "flex", justifyContent: "center" }}>User</th>
                                <th>Username</th>
                                <th>Email</th>
                                <th>Joined on</th>
                                <th>Phone</th>
                                <th>Status</th>
                                <th style={{ display: "flex", justifyContent: "center" }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {userDetails && !loading && filteredUsers.map((user) => <List user={user} key={user._id} />)}
                        </tbody>
                    </table>
                </motion.div>
                <PacmanLoader loading={loading} cssOverride={override} color="orange" speedMultiplier={1} />
            </div>
        </>
    );
}

export default UserList;
