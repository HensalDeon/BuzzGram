import "./Auth.scss";
import Logo from "../../img/logo.png";
import { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import { useFormik } from "formik";
import { logIn, signUp } from "../../redux/actions/AuthActions";
import { sendOtpSignup, verifyOtp } from "../../api/AuthRequests";
import { useDispatch, useSelector } from "react-redux";
import toast, { Toaster } from "react-hot-toast";
import * as Yup from "yup";

const loginValidation = Yup.object().shape({
    username: Yup.string()
        .trim()
        .min(5, "Minimum 5 characters are required for username")
        .max(20, "Cannot exceed 20 characters")
        .required("Username cannot be empty"),
    password: Yup.string()
        .trim()
        .min(8, "Minimum 6 characters required")
        .matches(/^(?=.*[a-zA-Z])(?=.*\d)/, "Password must contain at least one letter", "and one number")
        .required("Password cannot be empty"),
})
const validationSchema = Yup.object().shape({
    fullname: Yup.string()
        .trim()
        .min(5, "Minimum 5 characters required")
        .max(20, "Cannot exceed 20 characters")
        .required("Fullname cannot be empty"),
    username: Yup.string()
        .trim()
        .min(5, "Minimum 5 characters are required for username")
        .max(20, "Cannot exceed 20 characters")
        .required("Username cannot be empty"),
    password: Yup.string()
        .trim()
        .min(8, "Minimum 6 characters required")
        .matches(/^(?=.*[a-zA-Z])(?=.*\d)/, "Password must contain at least one letter", "and one number")
        .required("Password cannot be empty"),
    phone: Yup.string()
        .trim()
        .matches(/^[0-9]{10}$/, "Phone must be a 10-digit number")
        .required("Phone cannot be empty"),
    verifyOtp: Yup.string()
        .trim()
        .matches(/^[0-9]{6}$/, "OTP must be a 8-digit number")
        .required("OTP cannot be empty"),
});

const Auth = () => {
    const [showLogin, setShowLogin] = useState(true);
    const toggleForm = () => {
        setShowLogin(!showLogin);
    };

    return (
        <div className="Auth">
            <div className="a-left">
                <img src={Logo} alt="" />
                <div className="Webname">
                    <h1>BuzzGram</h1>
                    <h6>Explore the ideas throughout the world</h6>
                </div>
            </div>

            {showLogin ? <LogIn toggleForm={toggleForm} /> : <SignUp toggleForm={toggleForm} />}
        </div>
    );
};
function LogIn({ toggleForm }) {
    const loading = useSelector((state) => state.authReducer.loading);
    const dispatch = useDispatch();
    const formik = useFormik({
        initialValues: {
            username: "",
            password: "",
        },
        validationSchema: loginValidation,
        validateOnBlur: true,
        validateOnChange: true,
        onSubmit: async (values) => {
            values = await Object.assign(values);
            try {
                const result = await dispatch(logIn(values));
                if (result.success) {
                    toast.success(<b>Login Successfull..!</b>);
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

                <div style={{display:"flow"}}>
                    <input
                        {...formik.getFieldProps("username")}
                        type="text"
                        placeholder="Username"
                        className="infoInput"
                        name="username"
                    />
                    {formik.touched.username && formik.errors.username && (
                        <div style={{ color: "red" }}>{formik.errors.username}</div>
                    )}
                </div>

                <div style={{display:"flow"}}>
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
                    <span style={{ fontSize: "12px" }}>
                        Don&#39;t have an account?{" "}
                        <button onClick={toggleForm}>
                            <b>Signup</b>
                        </button>
                    </span>
                    <button type="submit" className="button infoButton" disabled={loading}>
                        {loading? "login...": "Login"}
                    </button>
                </div>
            </form>
        </div>
    );
}

LogIn.propTypes = {
    toggleForm: PropTypes.func.isRequired,
};

function SignUp({ toggleForm }) {
    const loading = useSelector((state) => state.authReducer.loading);
    const error = useSelector((state) => state.authReducer.error);
    const dispatch = useDispatch();
    const phoneInputRef = useRef(null);
    const otpInputRef = useRef(null);
    const [otpSent, setOtpSent] = useState(false);
    const [isOtpVerified, setIsOtpVerified] = useState(false);
    const [resendTimer, setResendTimer] = useState(false);
    const [secondsLeft, setSecondsLeft] = useState(10);

    useEffect(() => {
        let timer;
        if (otpSent && secondsLeft > 0 && resendTimer) {
            timer = setInterval(() => {
                setSecondsLeft((prevSeconds) => prevSeconds - 1);
            }, 1000);
        } else if (secondsLeft === 0) {
            setResendTimer(false);
        }

        return () => {
            clearInterval(timer);
        };
    }, [otpSent, secondsLeft, resendTimer]);

    const handleOtpSent = async (e) => {
        e.preventDefault();
        const phoneValue = phoneInputRef.current.value;
        if (phoneValue.length !== 10) {
            return;
        }
        try {
            const res = await sendOtpSignup({ phone: phoneInputRef.current.value });
            console.log(res.data);
            if (res.status == 200) {
                toast.success(<b>{res.data.message}</b>)
                setOtpSent(true);
                setSecondsLeft(10);
                setResendTimer(true);
            }else{
                toast.error(<b>{res.data.error}</b>)
            }
        } catch (error) {
            toast.error(<b>Something went wrong!</b>)
            console.log(error);
        }
    };

    const handleOtpVerify = async (e) => {
        e.preventDefault();
        //otp verification logic
        try {
            const res = await verifyOtp(phoneInputRef.current.value, otpInputRef.current.value);
            if(res.status == 200){
                setIsOtpVerified(true);
                toast.success(<b>{res.data.message}</b>)
            }else{
                toast.error(<b>{res.data.error}</b>)
            }
        } catch (error) {
            toast.error(<b>Something went wrong!</b>)
            console.log(error)
        }
    };

    const formik = useFormik({
        initialValues: {
            fullname: "",
            username: "",
            password: "",
            phone: "",
            verifyOtp: "",
        },
        validationSchema: validationSchema,
        validateOnBlur: true,
        validateOnChange: true,
        onSubmit: async (values) => {
            values = await Object.assign(values);
            if(!isOtpVerified) return toast.error(<b>Verify Otp first</b>)
            try {
                const result = await dispatch(signUp(values));
                if (result.success) {
                    setSecondsLeft(0);
                    toast.success(<b>Registered Successfully...!</b>);
                } else {
                    toast.error(error);
                }
            } catch (error) {
                console.error("An error occurred:", error);
            }
        },
    });
    return (
        <div className="a-right signup">
            <Toaster position="top-center" reverseOrder={false}></Toaster>
            <form className="infoForm authForm" onSubmit={formik.handleSubmit}>
                <h3>Sign Up</h3>

                <div style={{ display: "flow" }}>
                    <input
                        {...formik.getFieldProps("fullname")}
                        type="text"
                        placeholder="FullName"
                        className="infoInput"
                        name="fullname"
                    />
                    {formik.touched.fullname && formik.errors.fullname && (
                        <div style={{ color: "red" }}>{formik.errors.fullname}</div>
                    )}
                </div>
                <div style={{ display: "flow" }}>
                    <input
                        {...formik.getFieldProps("username")}
                        type="text"
                        placeholder="Username"
                        className="infoInput"
                        name="username"
                    />
                    {formik.touched.username && formik.errors.username && (
                        <div style={{ color: "red" }}>{formik.errors.username}</div>
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
                <div style={{ display: "flow" }}>
                    <div className="otp-setup">
                        <input
                            {...formik.getFieldProps("phone")}
                            ref={phoneInputRef}
                            type="text"
                            className="infoInput"
                            placeholder="Phone"
                            name="phone"
                        />
                        {!resendTimer && (
                            <button className="button otp" onClick={(e) => handleOtpSent(e)}>
                                <span>OTP</span>
                            </button>
                        )}
                    </div>
                    {formik.touched.phone && formik.errors.phone && (
                        <div style={{ color: "red" }}>{formik.errors.phone}</div>
                    )}
                    {resendTimer && <span style={{ fontSize: "0.8rem" }}>Resend OTP in {secondsLeft}s</span>}
                </div>

                {otpSent && (
                    <div style={{ display: "flow" }}>
                        <div className="otp-setup">
                            <input
                                {...formik.getFieldProps("verifyOtp")}
                                ref={otpInputRef}
                                type="text"
                                className="infoInput"
                                placeholder="Verify OTP"
                                name="verifyOtp"
                            />
                            <button className="button otp" onClick={(e) => handleOtpVerify(e)}>
                                <span className="material-symbols-outlined">task_alt</span>
                            </button>
                        </div>
                        {formik.touched.verifyOtp && formik.errors.verifyOtp && (
                            <div style={{ color: "red" }}>{formik.errors.verifyOtp}</div>
                        )}
                    </div>
                )}

                <div>
                    <span style={{ fontSize: "12px" }}>
                        Already have an account?{" "}
                        <button onClick={toggleForm}>
                            <b>Login</b>
                        </button>
                    </span>
                    <button type="submit" className="button infoButton" disabled={loading}>
                        {loading ? "Signing..." : "SignUp"}
                    </button>
                </div>
            </form>
        </div>
    );
}

SignUp.propTypes = {
    toggleForm: PropTypes.func.isRequired,
};

export default Auth;
