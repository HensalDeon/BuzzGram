import { Toaster } from "react-hot-toast";
import ReportList from "./ReportList";
import "./Report.scss";
import { useEffect, useState } from "react";
import { getReports } from "../../api/ReportRequests";
import PacmanLoader from "react-spinners/PacmanLoader";

function Reports() {
    const [loading, setLoading] = useState(true);
    const [targetLoading, setTargetLoading] = useState(false);
    const [reports, setReports] = useState([]);

    const override = {
        display: "block",
        margin: "auto",
    };
    console.log(reports);
    useEffect(() => {
        getReports()
            .then((res) => {
                setLoading(false);
                setReports(res.data);
            })
            .catch((err) => {
                console.log(err);
                setLoading(false);
            });
    }, []);

    return (
        <>
            <Toaster position="top-center" reverseOrder={false}></Toaster>
            <div>filter by targetType , filter by reported time</div>
            <div className="table-container">
                <table className="table">
                    <thead className="table-head">
                        <tr>
                            <th style={{ display: "flex", justifyContent: "center" }}>User</th>
                            <th>Username</th>
                            <th>Reason</th>
                            <th>Reported on</th>
                            <th>Target</th>
                            <th>Status</th>
                            <th style={{ display: "flex", justifyContent: "center" }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {!loading &&
                            reports.map((report) => (
                                <ReportList report={report} key={report._id} setTargetLoading={setTargetLoading} />
                            ))}
                    </tbody>
                </table>
                <PacmanLoader loading={loading || targetLoading} cssOverride={override} color="orange" speedMultiplier={1} />
            </div>
        </>
    );
}

export default Reports;
