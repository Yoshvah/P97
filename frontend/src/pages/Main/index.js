import { useNavigate } from "react-router-dom";
import Usersetting from "../Main/Component/usersetting";
import ChatCard from "../Main/Component/ChatCard";
import Profile from "../Main/Component/Profile";
import UserProfile from "./Component/UserProfile";
import Mook from "../Main/Component/Mook";
import Home from "../Main/Component/Home";
import '@fortawesome/fontawesome-free/css/all.min.css';
import { Route, Routes } from "react-router-dom";
import "../Main/index.css";
import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Main() {
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');
  const [img, setImg] = useState(null);
  const [error, setError] = useState(null);
  const [user1, setUpdatedUser1] = useState({
    username: '',
    email: '',
    phone: '',
    address: '',
    birthday: '',
    slogan: '',
    interest: [],
    profilePicture: '',
    isAdmin: false, // Added `isAdmin` field
  });
  const profilePicture = localStorage.getItem('profilePicture');

  useEffect(() => {
    if (!token || !userId) {
      setError('You must be logged in to view your profile.');
      return;
    }

    const fetchUser = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/profile/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUpdatedUser1(response.data);
        localStorage.setItem('username', response.data.username);
        localStorage.setItem('profilePicture', response.data.profilePicture);
        // Decode the base64 image
        const decodedImage = `data:image/png;base64,${response.data.profilePicture}`;
        setImg(decodedImage);
      } catch (error) {
        setError('Failed to fetch user profile. Please try again.');
      }
    };

    fetchUser();
  }, [token, userId]);

  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
    console.log("Logged out successfully");
  };

  const navigateTo = (menu) => {
    navigate(`/${menu}`);
  };

  return (
    <>
      <header>
        <div className="">
          <div className="row flex-nowrap display-absolute">
            {/* Sidebar */}
            <div id="nav-bar" className={`col-auto ${isCollapsed ? "collapsed px-sm-1 px-0 bg-light sidebar" : "px-sm-1 px-0 bg-light sidebar"}`}>
              {/* <input id="nav-toggle" type="checkbox" /> */}
              <div id="nav-header">
                
                <hr />
              </div>
              <div id="nav-content">
                <div className="nav-button" onClick={() => navigateTo("Mook/Home")}>
                  <i className="fas fa-home"></i><span className={`${isCollapsed ? "d-none" : ""}`}>Home</span>
                </div>
                <div className="nav-button" onClick={() => navigateTo("Mook/Profile")}>
                  <i className="fas fa-palette"></i><span className={`${isCollapsed ? "d-none" : ""}`}>Profile</span>
                </div>
                <div className="nav-button" onClick={() => navigateTo("Mook/message")}>
                  <i className="fas fa-envelope"></i><span className={`${isCollapsed ? "d-none" : ""}`}>Message</span>
                </div>
                  <div className="nav-button" onClick={() => navigateTo("Mook/usermook")}>
                    <i className="fas fa-thumbtack"></i><span className={`${isCollapsed ? "d-none" : ""}`}>Mook</span>
                  </div>
                {user1.isAdmin && (
                  <div className="nav-button" onClick={() => navigateTo("Mook/userlist")}>
                    <i className="fas fa-list"></i><span className={`${isCollapsed ? "d-none" : ""}`}>User List</span>
                  </div>
                )}
                <hr />
                <div className="nav-button" onClick={handleLogout}>
                  <i className="fas fa-sign-out-alt"></i><span className={`${isCollapsed ? "d-none" : ""}`}>Sign Out</span>
                </div>
              </div>
              <input id="nav-footer-toggle" type="checkbox" />
              <div id="nav-footer">
                <div id="nav-footer-heading">
                  <div id="nav-footer-avatar">
                    <img src={profilePicture || "https://bootdey.com/img/Content/avatar/avatar7.png"} alt={user1.username} />
                  </div>
                  <div id="nav-footer-titlebox">
                    <a id="nav-footer-title" href="https://codepen.io/uahnbu/pens/public" target="_blank" rel="noopener noreferrer">
                      {user1.username}
                    </a>
                    <span id="nav-footer-subtitle">{user1.isAdmin ? "Admin" : "User"}</span>
                  </div>
                  <label htmlFor="nav-footer-toggle">
                    <i className="fas fa-caret-up"></i>
                  </label>
                </div>
                <div id="nav-footer-content">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className={`col py-3 main-content ${isCollapsed ? "collapsed" : ""}`}>
              <nav
                id="main-navbar"
                className="navbar navbar-expand-lg"
              >
                <div className="container-fluid">
                  <a className="navbar-brand" href="/">
                    <h1>Mook</h1>
                  </a>
                  <form className="d-none d-md-flex input-group w-auto my-auto">
                    <input
                      autoComplete="off"
                      type="search"
                      className="form-control rounded"
                      placeholder="Search"
                      style={{ minWidth: "225px" }}
                    />
                    <span className="input-group-text border-0">
                      <i className="fas fa-search"></i>
                    </span>
                  </form>
                </div>
              </nav>
              <div className={`${isCollapsed ? "containerr" : "containerrr"}`}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/home" element={<Home />} />
                  <Route path="/message" element={<ChatCard />} />
                  {user1.isAdmin && <Route path="/userlist" element={<Usersetting />} />}
                  <Route path="/Profile" element={<Profile />} />
                  <Route path="/UserProfile/:id" element={<UserProfile />} />
                  <Route path="/Usermook" element={<Mook />} />
                </Routes>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}

export default Main;
