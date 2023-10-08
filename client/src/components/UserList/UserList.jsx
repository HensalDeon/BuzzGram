import "./UserList.scss";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserDetails } from "../../redux/actions/AdminActions";
import PacmanLoader from "react-spinners/PacmanLoader";
import List from "./List";
import { Toaster } from "react-hot-toast";

function UserList() {
    const dispatch = useDispatch();
    const { userDetails, loading } = useSelector((state) => state.adminReducer);


    useEffect(() => {
        // if (!userDetails) {
        //     dispatch(getUserDetails());
        // }
        dispatch(getUserDetails());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    const override = {
        display: "block",
        margin: "0 auto",
    };


    return (
        <div className="table-container">
            <Toaster position="top-center" reverseOrder={false}></Toaster>
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
                    {userDetails && !loading && userDetails.map((user) => <List user={user} key={user._id} />)}
                </tbody>
            </table>
            <PacmanLoader loading={loading} cssOverride={override} color="orange" speedMultiplier={1} />
        </div>
    );
}

export default UserList;
