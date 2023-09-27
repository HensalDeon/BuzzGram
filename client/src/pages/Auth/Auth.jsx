import "./Auth.scss";
import Logo from "../../img/logo.png";
import { useState } from "react";
import PropTypes from "prop-types";
import {useFormik} from "formik";
// import toast, { Toaster } from "react-hot-toast";

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
        initialValues:{
            username: "",
            password: ""
        },
        validateOnBlur: false,
        validateOnChange: false,
        onSubmit: async (values) => {
            values = await Object.assign(values);
            console.log(values,'💥💥💥')
            // let registerPromise = registerUser(values);
            // toast.promise(registerPromise, {
            //     loading: 'Creating...',
            //     success: <b>Registered Successfully...!</b>,
            //     error: <b>Could not register</b>
            // })

            // registerPromise.then(function(){ navigate('/') })
        }
    }) 
    return (
        <div className="a-right">
            <form className="infoForm authForm" onSubmit={formik.handleSubmit}>
                <h3>Log In</h3>

                <div>
                    <input {...formik.getFieldProps("username")} type="text" placeholder="Username" className="infoInput" name="username" />
                </div>

                <div>
                    <input {...formik.getFieldProps("password")} type="password" className="infoInput" placeholder="Password" name="password" />
                </div>

                <div>
                    <span style={{ fontSize: "12px" }}>
                        Don&#39;t have an account?{" "}
                        <button onClick={toggleForm}>
                            <b>Signup</b>
                        </button>
                    </span>
                    <button type="submit" className="button infoButton">Login</button>
                </div>
            </form>
        </div>
    );
}

LogIn.propTypes = {
    toggleForm: PropTypes.func.isRequired,
};

function SignUp({ toggleForm }) {
    const formik = useFormik({
        initialValues:{
            fullname: "",
            username: "",
            password: "",
            phone: "",
            verifyOtp : "",
        },
        validateOnBlur: false,
        validateOnChange: false,
        onSubmit: async (values) => {
            values = await Object.assign(values);
            console.log(values,'💥💥💥')
            // let registerPromise = registerUser(values);
            // toast.promise(registerPromise, {
            //     loading: 'Creating...',
            //     success: <b>Registered Successfully...!</b>,
            //     error: <b>Could not register</b>
            // })

            // registerPromise.then(function(){ navigate('/') })
        }
    })
    return (
        <div className="a-right signup">
            <form className="infoForm authForm" onSubmit={formik.handleSubmit}>
                <h3>Sign Up</h3>

                <div>
                    <input {...formik.getFieldProps("fullname")} type="text" placeholder="FullName" className="infoInput" name="fullname" />
                </div>
                <div>
                    <input {...formik.getFieldProps("username")} type="text" placeholder="Username" className="infoInput" name="username" />
                </div>

                <div>
                    <input {...formik.getFieldProps("password")} type="password" className="infoInput" placeholder="Password" name="password" />
                </div>
                <div>
                    <div className="otp-setup">
                        <input {...formik.getFieldProps("phone")} type="text" className="infoInput" placeholder="Phone" name="phone" />
                        <button className="button otp">
                            <span>OTP</span>
                        </button>
                    </div>
                </div>
                <div>
                    <input {...formik.getFieldProps("verifyOtp")} type="text" className="infoInput" placeholder="Verify OTP" name="verifyOtp" />
                </div>

                <div>
                    <span style={{ fontSize: "12px" }}>
                        Already have an account?{" "}
                        <button onClick={toggleForm}>
                            <b>Login</b>
                        </button>
                    </span>
                    <button type="submit" className="button infoButton">Sign Up</button>
                </div>
            </form>
        </div>
    );
}

SignUp.propTypes = {
  toggleForm: PropTypes.func.isRequired,
};

export default Auth;
