import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import Navbar from 'components/Navbar';
import Footer from 'components/Footer';
import "../Login/login.css";
import axios from 'axios'; // Import axios if you are not using fetch

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Make an API request to your backend to log in
      const response = await axios.post('http://localhost:8000/api/user/login', {
        username,
        password,
      });

      // Extract token and user information from the response
      const { token, user } = response.data;

      // Store the token and user ID in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('userId', user.id);

      // Optionally, you can dispatch a Redux action to store user info
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: {
          id: user.id,
          username: user.username,
          token: token,
        },
      });

      // Redirect to the home page or dashboard
      navigate('/Mook/message');
    } catch (err) {
      // Handle login errors
      setError(err.response?.data || { message: 'Login failed. Please try again.' });
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <Navbar />
      <div className="form-bg">
        <div className="container">
          <div className="row d-flex justify-content-center">
            <div className="col-md-offset-4 col-md-4 col-sm-offset-3 col-sm-6">
              <div className="form-container">
                <h3 className="title">Login</h3>

                <form onSubmit={handleSubmit}>
                  {/* Username Field */}
                  <div className="form-group">
                    <input
                      type="text"
                      className="form-control"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Enter your username"
                      required
                    />
                  </div>

                  {/* Password Field */}
                  <div className="form-group password-group">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className="form-control"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      required
                    />
                    <span className="password-icons" onClick={togglePasswordVisibility}>
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                  </div>

                  {/* General Error Message */}
                  {error && error.message && <p className="error">{error.message}</p>}

                  {/* Submit Button */}
                  <button type="submit" className="btn submit-btn">
                    Log in
                  </button>
                </form>

                {/* Forgot Password Link */}
                <Link to="/forgot-password" className="forgot-password">
                  Forgot your password?
                </Link>

                {/* Sign-Up Prompt */}
                <p className="login-text">
                  Not a member yet?{' '}
                  <Link to="/signup" className="signup-link">
                    Sign up
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Login;
