import "./Auth.scss";
import Logo from "../../img/logo.png";
import { useFormik } from "formik";
import { adminLogin } from "../../redux/actions/AuthActions";
import { useDispatch, useSelector } from "react-redux";
import toast, { Toaster } from "react-hot-toast";
import * as Yup from "yup";

const loginValidation = Yup.object().shape({
    adminName: Yup.string()
        .trim()
        .min(5, "Minimum 5 characters are required for username")
        .max(20, "Cannot exceed 20 characters")
        .required("Admin name cannot be empty"),
    password: Yup.string()
        .trim()
        .required("Password cannot be empty"),
});

const AdminAuth = () => {
    return (
        <div className="Auth">
            <div className="a-left">
                <img src={Logo} alt="" />
                <div className="Webname">
                    <h1>BuzzGram</h1>
                    <h6>Explore the ideas throughout the world</h6>
                </div>
            </div>
            <LogIn />
        </div>
    );
};
function LogIn() {
    const loading = useSelector((state) => state.authReducer.adminLoading);
    const dispatch = useDispatch();
    const formik = useFormik({
        initialValues: {
            adminName: "",
            password: "",
        },
        validationSchema: loginValidation,
        validateOnBlur: true,
        validateOnChange: true,
        onSubmit: async (values) => {
            values = await Object.assign(values);
            try {
                const result = await dispatch(adminLogin(values));
                if (result.success) {
                    toast.success(<b>Login Successfull..!</b>);
                    // navigate("/admin/");
                } else {
                    toast.error(<b>Login failed. Please check your credentials.</b>);
                }
            } catch (error) {
                toast.error("Somethig went wrong!");
                console.error("An error occurred:", error);
            }
        },
    });
    return (
        <div className="a-right">
            <Toaster position="top-center" reverseOrder={false}></Toaster>
            <form className="infoForm authForm" onSubmit={formik.handleSubmit}>
                <h3>Log In</h3>

                <div style={{ display: "flow" }}>
                    <input
                        {...formik.getFieldProps("adminName")}
                        type="text"
                        placeholder="Admin Name"
                        className="infoInput"
                        name="adminName"
                    />
                    {formik.touched.adminName && formik.errors.adminName && (
                        <div style={{ color: "red" }}>{formik.errors.adminName}</div>
                    )}
                </div>

                <div style={{ display: "flow" }}>
                    <input
                        {...formik.getFieldProps("password")}
                        type="password"
                        className="infoInput"
                        placeholder="Password"
                        name="password"
                    />
                    {formik.touched.password && formik.errors.password && (
                        <div style={{ color: "red" }}>{formik.errors.password}</div>
                    )}
                </div>

                <div>
                    <button type="submit" className="button infoButton" disabled={loading}>
                        {loading ? "login..." : "Login"}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default AdminAuth;
