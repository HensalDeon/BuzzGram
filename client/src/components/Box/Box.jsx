import PropTypes from "prop-types";
import "./Box.scss";

const Box = (props) => {
    const className = {
        box: "box",
        purple: props.purple && "box-purple",
        fullheight: props.fullheight && "box-fullheight",
    };

    return <div className={Object.values(className).join(" ")}>{props.children}</div>;
};
Box.propTypes = {
    purple: PropTypes.bool,
    fullheight: PropTypes.bool,
    children: PropTypes.node,
};
export default Box;
