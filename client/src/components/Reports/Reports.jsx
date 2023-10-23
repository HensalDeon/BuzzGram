import { Toaster } from "react-hot-toast";
import ReportList from "./ReportList";
import "./Report.scss";
import { useEffect, useState } from "react";
import { getReports } from "../../api/ReportRequests";
import PacmanLoader from "react-spinners/PacmanLoader";
import PropagateLoader from "react-spinners/PropagateLoader";
import { useDispatch } from "react-redux";
import { adminLogout } from "../../redux/actions/AuthActions";
import debounce from "lodash/debounce";
function Reports() {
    const [loading, setLoading] = useState(true);
    const [hasMoreReports, setHasMoreReports] = useState(true);
    const [targetLoading, setTargetLoading] = useState(false);
    const [reports, setReports] = useState([]);
    const [scrolling, setScrolling] = useState(false);
    const [page, setPage] = useState(1);
    const dispatch = useDispatch();

    const override = {
        display: "block",
        position: "absolute",
        top: "15%",
        margin: " 0 50%",
        zIndex: "1070",
    };

    const overrideCss = {
        display: "block",
        margin: " 0 50%",
        marginBottom: "5rem",
    };

    const handelInfiniteScroll = async () => {
        if (!scrolling && hasMoreReports) {
            setScrolling(true);
            try {
                if (window.innerHeight + document.documentElement.scrollTop + 1 >= document.documentElement.scrollHeight) {
                    setPage((prev) => prev + 1);
                }
            } catch (error) {
                console.log(error);
            }
        }
    };

    const debouncedInfiniteScroll = debounce(handelInfiniteScroll, 1000);

    useEffect(() => {
        getReports(page)
            .then((res) => {
                console.log("skhdhvbkshv");
                setLoading(false);
                const newReports = res.data;
                if (newReports.length === 0 || newReports.length < 8) {
                    setHasMoreReports(false);
                }
                setReports((prevReports) => [...prevReports, ...newReports]);
            })
            .catch((err) => {
                if (err.response.data.error === "Token has expired") {
                    dispatch(adminLogout());
                }
                console.log(err);
                setLoading(false);
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page]);

    useEffect(() => {
        window.addEventListener("scroll", debouncedInfiniteScroll);
        return () => {
            window.removeEventListener("scroll", debouncedInfiniteScroll);
            setScrolling(false);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [scrolling]);

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
                                <ReportList
                                    report={report}
                                    key={report._id}
                                    setTargetLoading={setTargetLoading}
                                    setReports={setReports}
                                />
                            ))}
                    </tbody>
                </table>
                <PropagateLoader loading={loading} cssOverride={overrideCss} color="orange" />
                <PacmanLoader loading={targetLoading} cssOverride={override} color="orange" speedMultiplier={1} />
            </div>
        </>
    );
}

export default Reports;
