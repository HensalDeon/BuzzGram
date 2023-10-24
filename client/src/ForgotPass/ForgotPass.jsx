import Logo from "../img/logo.png";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useEffect, useRef, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { forgotPassword, sendOtpRecovery, verifyOtp } from "../api/AuthRequests";
import { useNavigate } from "react-router-dom";
function ForgotPass() {
    const navigate = useNavigate();
    const phoneInputRef = useRef(null);
    const otpInputRef = useRef(null);
    const [otpSent, setOtpSent] = useState(false);
    const [isOtpVerified, setIsOtpVerified] = useState(false);
    const [resendTimer, setResendTimer] = useState(false);
    const [secondsLeft, setSecondsLeft] = useState(30);
    const [loading, setLoading] = useState(false);

    const validationSchema = Yup.object({
        phone: Yup.string()
            .trim()
            .matches(/^[0-9]{10}$/, "Phone must be a 10-digit number")
            .required("Phone cannot be empty"),
        verifyOtp: Yup.string()
            .trim()
            .matches(/^[0-9]{6}$/, "OTP must be a 6-digit number")
            .required("OTP cannot be empty"),
        password: Yup.string()
            .trim()
            .min(8, "Minimum 6 characters required")
            .matches(/^(?=.*[a-zA-Z])(?=.*\d)/, "Password must contain at least one letter", "and one number")
            .required("Password cannot be empty"),
        confPassword: Yup.string()
            .oneOf([Yup.ref("password"), null], "Confirm password is not same")
            .required("Confirm password is required"),
    });

    const handleOtpSent = async (e) => {
        e.preventDefault();
        const phoneValue = phoneInputRef.current.value;
        if (phoneValue.length !== 10) {
            return;
        }
        try {
            const res = await sendOtpRecovery({ phone: phoneInputRef.current.value });
            console.log(res.data);
            if (res.status == 200) {
                toast.success(<b>{res.data.message}</b>);
                setOtpSent(true);
                setSecondsLeft(30);
                setResendTimer(true);
            } else {
                toast.error(<b>{res.data.error}</b>);
            }
        } catch (error) {
            toast.error(<b>{error.response?.data.error ? error.response?.data.error : "Something went wrong!"}</b>);
            console.log(error);
        }
    };

    const handleOtpVerify = async (e) => {
        e.preventDefault();
        const otpValue = otpInputRef.current.value;
        if (otpValue.length !== 6) {
            return;
        }
        try {
            const res = await verifyOtp(phoneInputRef.current.value, otpInputRef.current.value);
            if (res.status == 200) {
                setIsOtpVerified(true);
                toast.success(<b>{res.data.message}</b>);
            } else {
                toast.error(<b>{res.data.error}</b>);
            }
        } catch (error) {
            toast.error(<b>{error.response?.data.error ? error.response?.data.error : "Something went wrong!"}</b>);
            console.log(error);
        }
    };

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

    const formik = useFormik({
        initialValues: {
            password: "",
            confPassword: "",
            phone: "",
            verifyOtp: "",
        },
        validationSchema: validationSchema,
        validateOnBlur: true,
        validateOnChange: true,
        onSubmit: async (values) => {
            values = await Object.assign(values);
            if (!isOtpVerified) return toast.error(<b>Verify Otp first</b>);

            const loadingToast = toast.loading(<b>Updating...!</b>);
            setLoading(true);
            forgotPassword(values)
                .then(() => {
                    toast.dismiss(loadingToast);
                    setSecondsLeft(0);
                    setLoading(false);
                    navigate("/auth");
                })
                .catch((error) => {
                    setLoading(false);
                    toast.error(<b>Failed to update password!</b>);
                    console.error("An error occurred:", error);
                });
        },
    });

    return (
        <div className="Auth">
            <Toaster position="top-center" reverseOrder={false}></Toaster>
            <div className="a-left">
                <img src={Logo} alt="" />
                <div className="Webname">
                    <h1>BuzzGram</h1>
                    <h6>Explore the ideas throughout the world</h6>
                </div>
            </div>
            <div className="a-right signup">
                <form className="infoForm authForm" onSubmit={formik.handleSubmit}>
                    {!isOtpVerified && (
                        <>
                            <h4>Reset password with OTP</h4>
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
                        </>
                    )}
                    {isOtpVerified && (
                        <>
                            <h4>Update password</h4>
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
                                <input
                                    {...formik.getFieldProps("confPassword")}
                                    type="password"
                                    className="infoInput"
                                    placeholder="Confirm password"
                                    name="confPassword"
                                />
                                {formik.touched.confPassword && formik.errors.confPassword && (
                                    <div style={{ color: "red" }}>{formik.errors.confPassword}</div>
                                )}
                            </div>
                            <div>
                                <button type="submit" className="button infoButton" disabled={loading}>
                                    {loading ? "Updating..." : "Update"}
                                </button>
                            </div>
                        </>
                    )}
                </form>
            </div>
        </div>
    );
}

export default ForgotPass;
