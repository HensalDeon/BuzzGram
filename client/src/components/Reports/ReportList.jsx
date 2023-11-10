import { useState } from "react";
import { useDispatch } from "react-redux";
import { deleteReport, getTargetData, updateReport } from "../../api/ReportRequests";
import { deletePost } from "../../redux/actions/PostAction";
import { adminDeleteComment } from "../../api/CommentRequests";
import { deleteCmt } from "../../redux/actions/CommentActions";
import avatar from "../../img/icon-accounts.svg";
import view from "../../img/icon-flatView.svg";
import resolve from "../../img/icon-flatDone.svg";
import deleteIco from "../../img/icon-flatDelete.svg";
import like from "../../img/like.png";
import Modal from "react-bootstrap/Modal";
import PropTypes from "prop-types";
import toast from "react-hot-toast";

function ReportList({ report, setTargetLoading, setReports, incPage }) {
    const [expanded, setExpanded] = useState(true);
    const [showTarget, setShowTarget] = useState(false);
    const [data, setData] = useState(null);
    const [show, setShow] = useState(false);
    const [nullResult, setNullResult] = useState(false);

    const dispatch = useDispatch();

    const handleExpansion = () => {
        setExpanded(!expanded);
    };

    const handleDeleteShow = () => {
        setShow(true);
        setShowTarget(false);
    };

    const handleDeleteClose = () => {
        setShow(false);
    };

    const handleReportDelete = () => {
        const loadingToastId = toast.loading("Deleting...");
        deleteReport(report._id)
            .then((res) => {
                toast.dismiss(loadingToastId);
                setReports((prevReports) => {
                    const updatedReports = prevReports.filter((r) => r._id !== report._id);
                    if (updatedReports.length < 8) incPage();
                    return updatedReports;
                });
                toast.success(<b>{res.data.message}</b>);
            })
            .catch((err) => {
                toast.dismiss(loadingToastId);
                toast.error(<b>{err.response.data.err}</b>);
            });
    };

    const handleDelete = async () => {
        const loadingToastId = toast.loading("Deleting...");
        try {
            const deletePromise = await dispatch(deletePost(report.targetId, "HensalDeon", "admin"));
            toast.dismiss(loadingToastId);
            if (deletePromise.success) {
                setShow(false);
                toast.success(<b>Post Deleted...!</b>);
            } else {
                setShow(false);
                toast.error(<b>Failed to delete...!</b>);
            }
        } catch (error) {
            setShow(false);
            toast.error(<b>Something went wrong!</b>);
            console.error("Error:", error);
        }
    };

    const handleCmtDelete = () => {
        const loadingToastId = toast.loading("Deleting...");
        adminDeleteComment(report.targetId)
            .then((res) => {
                dispatch(deleteCmt(report.targetId, data.postId._id));
                setShow(false);
                toast.dismiss(loadingToastId);
                toast.success(<b>{res.data.message}</b>);
            })
            .catch((error) => {
                setShow(false);
                toast.dismiss(loadingToastId);
                console.error("Error deleting comment:", error);
                toast.error(<b>Error deleting comment</b>);
            });
    };

    const handleDeleteAction = async () => {
        if (report.targetType === "post") {
            handleDelete();
        } else if (report.targetType === "comment") {
            handleCmtDelete();
        }
    };

    const handleResolve = () => {
        const loadingToast = toast.loading(<b>Changing...</b>);
        updateReport("HensalDeon", report._id)
            .then((res) => {
                toast.dismiss(loadingToast);
                const updatedReport = res.data.report;
                setReports((prevReports) => {
                    return prevReports.map((r) => {
                        if (r._id === updatedReport._id) {
                            return { ...updatedReport, reporterId: r.reporterId };
                        }
                        return r;
                    });
                });
                toast.success(<b>Status changed!</b>);
            })
            .catch((err) => {
                toast.dismiss(loadingToast);
                console.log(err);
                toast.error(<b>Error updating status</b>);
            });
    };

    const handleView = () => {
        setTargetLoading(true);
        getTargetData(report.targetId, report.targetType)
            .then((res) => {
                if (res.data && res.data !== "deleted") {
                    setData(res.data);
                    setShowTarget(true);
                } else if (res.data && res.data === "deleted") {
                    setNullResult(true);
                }
                setTargetLoading(false);
            })
            .catch((err) => {
                console.log(err);
                setTargetLoading(false);
            });
    };

    const handleTargetClose = () => {
        setShowTarget(false);
    };

    const formatDate = (dateString) => {
        const options = { year: "numeric", month: "short", day: "numeric" };
        const formattedDate = new Date(dateString).toLocaleDateString(undefined, options);
        return formattedDate;
    };
    return (
        <>
            <tr className="table-row">
                <td className="table-cell">
                    <div className="image-container">
                        <img src={report.reporterId.profileimage || avatar} alt="" className="avatar" />
                    </div>
                </td>
                <td className="table-cell">{report.reporterId.username}</td>
                <td className="table-cell w-25">
                    <span onClick={handleExpansion} className={expanded ? "content" : "expand"}>
                        {report.reason}
                    </span>
                </td>
                <td className="table-cell">{formatDate(report.createdAt)}</td>
                <td className="table-cell">{report.targetType}</td>
                <td className="table-cell">
                    <span className={report.status === "pending" ? "red" : "green"}>
                        {report.status === "pending" ? "pending" : "resolved"}
                    </span>
                </td>
                <td className="table-cell">
                    <div className="image-container">
                        <div className="d-flex gap-2">
                            <img onClick={handleView} src={view} className="action-img" alt="action" />
                            {report.status === "pending" && (
                                <img src={resolve} onClick={handleResolve} className="action-img" alt="action" />
                            )}
                            {report.status === "resolved" && (
                                <img src={deleteIco} onClick={handleReportDelete} className="action-img" alt="action" />
                            )}
                        </div>
                    </div>
                </td>
            </tr>
            <Modal show={showTarget} onHide={handleTargetClose}>
                <Modal.Body>
                    {report.targetType === "comment" ? (
                        <div>
                            <div className="cmt-containers">
                                <img src={data?.user?.profileimage || avatar} style={{ maxWidth: "2rem" }} alt="avatar" />
                                <div className="user-details">
                                    <b className="lg-text">{data?.user?.username}</b>
                                    <span className="text">{data?.text}&nbsp;&nbsp;&nbsp;&nbsp;</span>
                                </div>
                                <div className="like-count">
                                    <img src={like} alt="like" />
                                    <span className="lg-text" style={{ fontSize: "13px" }}>
                                        {data?.likes?.length}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="post-size">
                            <img className="post-size py-2" src={data?.image} alt="avatar" />
                        </div>
                    )}

                    <button onClick={handleDeleteShow} className="button my-1 py-1 w-25 align-self-end">
                        Delete
                    </button>
                </Modal.Body>
            </Modal>
            <Modal show={show} onHide={handleDeleteClose} style={{ marginTop: "14%" }}>
                <Modal.Body style={{ width: "13rem" }}>
                    <span className="lg-text pb-2">
                        Do you wish to delete this {report.targetType === "post" ? "post" : "comment"}?
                    </span>
                    <div className="cover px-4">
                        <button className="button modalButton" onClick={handleDeleteClose}>
                            No!
                        </button>
                        <button className="button modalButton" onClick={handleDeleteAction}>
                            Yes!
                        </button>
                    </div>
                </Modal.Body>
            </Modal>

            <Modal show={nullResult} onHide={() => setNullResult(false)} style={{ marginTop: "14%" }}>
                <Modal.Body>
                    <span className="lg-text">
                        {report.targetType === "post" ? "Post" : "Comment"} has already been deleted!
                    </span>
                    <button onClick={() => setNullResult(false)} className="button mx-5 mt-2 py-1">
                        OK
                    </button>
                </Modal.Body>
            </Modal>
        </>
    );
}

ReportList.propTypes = {
    report: PropTypes.shape({
        reporterId: PropTypes.shape({
            profileimage: PropTypes.string,
            username: PropTypes.string,
        }),
        _id: PropTypes.string,
        reason: PropTypes.string,
        createdAt: PropTypes.string,
        targetType: PropTypes.string,
        targetId: PropTypes.string,
        status: PropTypes.oneOf(["pending", "resolved"]),
    }).isRequired,
    setTargetLoading: PropTypes.func.isRequired,
    setReports: PropTypes.func.isRequired,
    incPage: PropTypes.func.isRequired,
};

export default ReportList;
