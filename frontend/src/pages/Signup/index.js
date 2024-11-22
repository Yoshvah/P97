import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signup } from "actions/auth";
import Navbar from "components/Navbar";
import "../Signup/index.css"; // Import the new CSS file
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Icons for password visibility toggle
import Footer from "components/Footer"; 

const required = (value) => {
  if (!value) {
    return <div className="alert alert-danger">This field is required!</div>;
  }
};

const vusername = (value) => {
  if (value.length < 3 || value.length > 20) {
    return <div className="alert alert-danger">The username must be between 3 and 20 characters.</div>;
  }
};

const vpassword = (value) => {
  if (value.length < 6 || value.length > 40) {
    return <div className="alert alert-danger">The password must be between 6 and 40 characters.</div>;
  }
};

const Signup = () => {
  const navigate = useNavigate(); 
  const dispatch = useDispatch();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { message } = useSelector((state) => state.message);
  const [loading, setLoading] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const [errorMessage, setErrorMessage] = useState("");

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const onChangeUsername = (e) => {
    setUsername(e.target.value);
  };

  const onChangePassword = (e) => {
    setPassword(e.target.value);
  };

  const onChangeConfirmPassword = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handleSignup = (e) => {
    e.preventDefault();
  
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match!");
      return;
    }
  
    dispatch(signup(username, password))
      .then(() => {
        navigate("/login");
      })
      .catch((error) => {
        const errorMessage =
          error.response?.data?.message || // If the server provides a specific error message
          error.message ||                // General error message from Axios
          "An unexpected error occurred"; // Fallback for unknown errors
        setErrorMessage(errorMessage);
      });
      
  };

  return (
    <>
      <Navbar />
      <div className="form-bg">
        <div className="container">
          <div className="row d-flex justify-content-center">
            <div className="col-md-offset-4 col-md-4 col-sm-offset-3 col-sm-6">
              <div className="form-container">
                <h3 className="title">Create Account</h3>
                {errorMessage && <div className="alert alert-danger" >{errorMessage}</div>}
                {/* <ul className="social-links">
                  <li><a href=""><i className="fab fa-google"></i></a></li>
                  <li><a href=""><i className="fab fa-facebook-f"></i></a></li>
                  <li><a href=""><i className="fab fa-twitter"></i></a></li>
                </ul> */}

                {/* <span className="description">or use your email for registration:</span> */}
                  {loading ? (<div className="loader">Signing up</div>):(
                <form className="form-horizontal" onSubmit={handleSignup}>
                  <div className="form-group">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Username"
                      name="username"
                      value={username}
                      onChange={onChangeUsername}
                      required
                    />
                  </div>

                  <div className="form-group password-group">
                    <input
                      type={showPassword ? "text" : "password"}
                      className="form-control"
                      placeholder="Password"
                      name="password"
                      value={password}
                      onChange={onChangePassword}
                      required
                    />
                    <span className="toggle-password" onClick={togglePasswordVisibility}>
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                  </div>

                  <div className="form-group password-group">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      className="form-control"
                      placeholder="Confirm Password"
                      name="confirmPassword"
                      value={confirmPassword}
                      onChange={onChangeConfirmPassword}
                      required
                    />
                    <span className="toggle-password" onClick={toggleConfirmPasswordVisibility}>
                      {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                  </div>

                  {/* <div className="form-group">
                    <input type="checkbox" className="checkbox" />
                    <span className="check-label">
                      I agree to the <a href="">Terms</a> and <a href="">Privacy Policy.</a>
                    </span>
                  </div> */}

                  <button type="submit" className="btn signup">
                    Sign up
                  </button>
                  <button type="button" className="btn signin">
                    <Link to="/login">Sign in</Link>
                  </button>
                </form>)}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Signup;
