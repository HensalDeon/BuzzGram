import avatar from "../../img/icon-accounts.svg";
import view from "../../img/icon-flatView.svg";
import resolve from "../../img/icon-flatDone.svg";
import like from "../../img/like.png";

import { useState } from "react";
import Modal from "react-bootstrap/Modal";
import PropTypes from "prop-types";
import { getTargetData } from "../../api/ReportRequests";

function ReportList({ report, setTargetLoading }) {
    const [expanded, setExpanded] = useState(true);
    const [showTarget, setShowTarget] = useState(false);
    const [data, setData] = useState(null);
    const [show, setShow] = useState(false);

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

    const handleDeleteAction = () => {
        console.log("deleted dummy");
        setShow(false);
    };

    const handleView = () => {
        console.log(report);
        setTargetLoading(true);

        getTargetData(report.targetId, report.targetType)
            .then((res) => {
                console.log(res.data == null);
                setData(res.data);
                if (res.data) {
                    setShowTarget(true);
                }
                setTargetLoading(false);
            })
            .catch((err) => {
                console.log(err);
                setTargetLoading(false);
            });
    };

    console.log(data, "2131");

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
                            {report.status === "pending" && <img src={resolve} className="action-img" alt="action" />}
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
        </>
    );
}

ReportList.propTypes = {
    report: PropTypes.shape({
        reporterId: PropTypes.shape({
            profileimage: PropTypes.string,
            username: PropTypes.string,
        }),
        reason: PropTypes.string,
        createdAt: PropTypes.string,
        targetType: PropTypes.string,
        targetId: PropTypes.string,
        status: PropTypes.oneOf(["pending", "resolved"]),
    }).isRequired,
    setTargetLoading: PropTypes.func.isRequired,
};

export default ReportList;
