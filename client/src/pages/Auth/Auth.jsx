import "./Auth.scss";
import Logo from "../../img/logo.png";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useFormik } from "formik";
import { registerUser, otpSignup } from "../../helper/userAxios";
import toast, { Toaster } from "react-hot-toast";

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
    const formik = useFormik({
        initialValues: {
            username: "",
            password: "",
        },
        validateOnBlur: false,
        validateOnChange: false,
        onSubmit: async (values) => {
            values = await Object.assign(values);
            console.log(values, "💥💥💥");
            // let registerPromise = registerUser(values);
            // toast.promise(registerPromise, {
            //     loading: 'Creating...',
            //     success: <b>Registered Successfully...!</b>,
            //     error: <b>Could not register</b>
            // })

            // registerPromise.then(function(){ navigate('/') })
        },
    });
    return (
        <div className="a-right">
            <form className="infoForm authForm" onSubmit={formik.handleSubmit}>
                <h3>Log In</h3>

                <div>
                    <input
                        {...formik.getFieldProps("username")}
                        type="text"
                        placeholder="Username"
                        className="infoInput"
                        name="username"
                    />
                </div>

                <div>
                    <input
                        {...formik.getFieldProps("password")}
                        type="password"
                        className="infoInput"
                        placeholder="Password"
                        name="password"
                    />
                </div>

                <div>
                    <span style={{ fontSize: "12px" }}>
                        Don&#39;t have an account?{" "}
                        <button onClick={toggleForm}>
                            <b>Signup</b>
                        </button>
                    </span>
                    <button type="submit" className="button infoButton">
                        Login
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
    const [otpSent, setOtpSent] = useState(false);
    const [otpVerified, setOtpVerified] = useState(false);
    const [resendTimer, setResendTimer] = useState(false);
    const [secondsLeft, setSecondsLeft] = useState(10);
    const [isLoading, setIsLoading] = useState(false);

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

    const handleOtpSent = (e) => {
        e.preventDefault();
        
        console.log("heloooo");
        setOtpSent(true);
        setSecondsLeft(10);
        setResendTimer(true);
    };

    const handleOtpVerify = (e) => {
        e.preventDefault();
        //otp verification logic
        console.log("verified");
        setOtpVerified(true);
    };

    const formik = useFormik({
        initialValues: {
            fullname: "",
            username: "",
            password: "",
            phone: "",
            verifyOtp: "",
        },
        validateOnBlur: false,
        validateOnChange: false,
        onSubmit: async (values) => {
            values = await Object.assign(values);
            console.log(values, "💥💥💥");
            try {
                setIsLoading(true)
                let registerPromise = registerUser(values);
                registerPromise
                    .then(() => {
                        secondsLeft(false)
                        toast.success(<b>Registered Successfully...!</b>);
                    })
                    .catch((error) => {
                        setIsLoading(false)
                        toast.error(<b>Couldnt register at the moment</b>);
                        console.error("An error occurred:", error);
                    });
            } catch (error) {
                setIsLoading(false)
                console.error("An error occurred:", error);
            }
        },
    });
    return (
        <div className="a-right signup">
            <Toaster position="top-center" reverseOrder={false}></Toaster>
            <form className="infoForm authForm" onSubmit={formik.handleSubmit}>
                <h3>Sign Up</h3>

                <div>
                    <input
                        {...formik.getFieldProps("fullname")}
                        type="text"
                        placeholder="FullName"
                        className="infoInput"
                        name="fullname"
                    />
                </div>
                <div>
                    <input
                        {...formik.getFieldProps("username")}
                        type="text"
                        placeholder="Username"
                        className="infoInput"
                        name="username"
                    />
                </div>

                <div>
                    <input
                        {...formik.getFieldProps("password")}
                        type="password"
                        className="infoInput"
                        placeholder="Password"
                        name="password"
                    />
                </div>
                <div style={{ display: "flow" }}>
                    <div className="otp-setup" onClick={(e) => handleOtpSent(e)}>
                        <input
                            {...formik.getFieldProps("phone")}
                            type="text"
                            className="infoInput"
                            placeholder="Phone"
                            name="phone"
                        />
                        {!resendTimer && (
                            <button className="button otp">
                                <span>OTP</span>
                            </button>
                        )}
                    </div>
                    {resendTimer && <span style={{ fontSize: "0.8rem" }}>Resend OTP in {secondsLeft}s</span>}
                </div>

                {otpSent && (
                    <div className="otp-setup">
                        <input
                            {...formik.getFieldProps("verifyOtp")}
                            type="text"
                            className="infoInput"
                            placeholder="Verify OTP"
                            name="verifyOtp"
                        />
                        <button className="button otp" onClick={(e) => handleOtpVerify(e)}>
                            <span className="material-symbols-outlined">task_alt</span>
                        </button>
                    </div>
                )}

                <div>
                    <span style={{ fontSize: "12px" }}>
                        Already have an account?{" "}
                        <button onClick={toggleForm}>
                            <b>Login</b>
                        </button>
                    </span>
                    <button
                        type="submit"
                        className={`button infoButton ${!otpVerified || isLoading ? "disabled-button" : ""}`}
                        disabled={!otpVerified || isLoading}
                    >
                        {isLoading? "Signing..." : "SignUp"}
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
