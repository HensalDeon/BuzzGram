import PropTypes from "prop-types";
import "./DashboardWrapper.scss";

const DashboardWrapper = (props) => {
    return <div className="dashboard-wrapper">{props.children}</div>;
};
DashboardWrapper.propTypes = {
    children: PropTypes.node,
};
export default DashboardWrapper;

export const DashboardWrapperMain = (props) => {
    return <div className="dashboard-wrapper__main">{props.children}</div>;
};

DashboardWrapperMain.propTypes = {
    children: PropTypes.node,
};

export const DashboardWrapperRight = (props) => {
    return <div className="dashboard-wrapper__right">{props.children}</div>;
};

DashboardWrapperRight.propTypes = {
    children: PropTypes.node,
};
