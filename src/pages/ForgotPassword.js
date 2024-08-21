import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CircleLoader } from 'react-spinners';
import {  toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import Base from "../components/Base";
import './forgetpassword.css';
import { FaEnvelope } from 'react-icons/fa';
let timer;
const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const validateFields = () => {
    const newErrors = {};

    if (!email) newErrors.email = "Email is required!";
    // if (email && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)) newErrors.email = "Invalid email address.";

    setErrors(newErrors);

    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      setErrors({});
      setServerError("");
    }, 4000);

    return Object.keys(newErrors).length === 0;
  }; const [serverError, setServerError] = useState("");

  const navigate = useNavigate();
  const ChangePasswordBtn = () => {
    if (!validateFields()) return;

    let data = JSON.stringify({
      "email": email
    });

    let config = {
      method: 'put',
      maxBodyLength: Infinity,
      url: 'http://3.109.191.193:1972/api/v1/auth/forgot-password',
      headers: {
        'Content-Type': 'application/json'
      },
      data: data
    };
    setLoading(true);
    axios.request(config)
      .then((response) => {
        const notify = () => {
          toast.success("Successfully sent email to", {
            position: toast.POSITION.TOP_LEFT,
            closeButton: false
         
          });
        };
        notify()
        navigate("/login");
      })
      .catch((error) => {
        console.log(error);
        if (error.response && error.response.status === 400) {
          setServerError("Email not found in the database!");
        } else {
          setServerError("An unknown error occurred!");
        }
      }).finally(() => {
        setLoading(false);
      });;

  }
  return (
    <Base>
      <div className="right-side3">
        {loading ? (
          <div className="loader-container">
            <CircleLoader color={"#123abc"} size={50} />
          </div>
        ) : (
          <div className="main-forgot-password">
            <h3>Forgot Password</h3>
             <div className="login-form2">
              <div className="form-outer2">
                     <div className="container2">
                            <form className="form2">
                             <div className="form-input2">
                            <span className="icon2"><FaEnvelope /></span>
                         <input
                            type="email"
                            placeholder="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="icontext2"
                        />
                        </div>
                        {errors.email && <div className="error-message">{errors.email}</div>}
                            </form>
                        </div>
                    </div>
              <div className="server-error-message error-message">
                {serverError}
              </div>

              <button className="sign3" onClick={ChangePasswordBtn}>
                Submit
              </button>
            </div>
          </div>
        )}
      </div>
    </Base>
  );
}

export default ForgotPassword;