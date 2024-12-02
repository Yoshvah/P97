import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import Usersetting from "../Main/Component/usersetting";
import ChatCard from "../Main/Component/ChatCard";
import Profile from "../Main/Component/Profile";
import Mook from "../Main/Component/Mook";
import Editor from "./Component/Editor";
import '@fortawesome/fontawesome-free/css/all.min.css';
import { Route, Routes } from "react-router-dom";
import "../Main/index.css";
function Main({ selectedMenu, handleSelectMenu }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const navigateTo = (menu) => {
    navigate(`/${menu}`);
  };
  const handlelogout = () =>{
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
    console.log('salut');
  }

  return (
    <>
      <header>
        <div className="container-fluid">
          <div className="row flex-nowrap">
            <div className={`col-auto ${isCollapsed ? "col-2" : "col-md-2"} px-sm-1 px-0 bg-light-blue sidebar`}>
              <div className="d-flex flex-column align-items-center align-items-sm-start px-4 pt-2 min-vh-100 op">
                <div className="dropdown pb-4 w-100">
                  <a href="#" className="d-flex align-items-center text-dark text-decoration-none " onClick={() => navigateTo('Mook/Profile')} aria-expanded="false">
                    <img src="https://github.com/mdo.png" alt="User" width="30" height="30" className="rounded-circle" />
                    <span className={`d-none d-sm-inline mx-1 ${isCollapsed ? "d-none" : ""}`}>User</span>
                  </a>
                </div>

                <div className="flex-grow-1 d-flex flex-column justify-content-center">
                  <ul className="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start" id="menu">
                  <li>
                      <a className="nav-link px-0 align-middle text-dark" onClick={() => navigateTo('Mook/Profile')}>
                        <i className="fs-4 bi-people"></i>
                        <span className={`ms-1 ${isCollapsed ? "d-none" : ""}`}>Profile</span>
                      </a>
                    </li>
                    <li className="nav-item">
                      <a className="nav-link align-middle px-0 text-dark" onClick={() => navigateTo('Mook/message')}>
                        <i className="fs-4 bi-house"></i>
                        <span className={`ms-1 ${isCollapsed ? "d-none" : ""}`}>Message</span>
                      </a>
                    </li>
                    <li>
                      <a className="nav-link px-0 align-middle text-dark" onClick={() => navigateTo('Mook/Usermook')}>
                        <i className="fs-4 bi-people"></i>
                        <span className={`ms-1 ${isCollapsed ? "d-none" : ""}`}>Mook</span>
                      </a>
                    </li>
                    {<li>
                      <a className="nav-link px-0 align-middle text-dark" onClick={() => navigateTo('Mook/userlist')}>
                        <i className="fs-4 bi-people"></i>
                        <span className={`ms-1 ${isCollapsed ? "d-none" : ""}`}>User List</span>
                      </a>
                    </li>}

                  </ul>
                </div>
                

                
                <div className="mb-2 d-block">
                    <button className="btn btn-outline-dark  d-sm-none " onClick={toggleSidebar}>
                      {isCollapsed ? '>' : '<'}
                    </button>
                    <ul className="text-small rounded-3 py-2 px-3">

                    <li>
                      <a className="text-danger text-decoration-none d-block py-1 px-2" onClick={handlelogout}>
                        Sign out
                      </a>
                    </li>
              </ul>
                </div>
              </div>
            </div>

            <div className="col py-3">
              <nav id="main-navbar" className="navbar navbar-expand-lg" style={{ backgroundColor: '#d2e0eb' }}>
                <div className="container-fluid">
                  <a className="navbar-brand" href="/">
                    <h1>Mook.mg</h1>
                  </a>
                  <form className="d-none d-md-flex input-group w-auto my-auto">
                    <input autoComplete="off" type="search" className="form-control rounded" placeholder='Search' style={{ minWidth: "225px" }} />
                    <span className="input-group-text border-0">
                      <i className="fas fa-search"></i>
                    </span>
                  </form>
                </div>
              </nav>
              <div className="containerr">
                <Routes>
                  <Route path="/" element={<ChatCard />} />
                  <Route path="/message" element={<ChatCard />} />
                  <Route path="/userlist" element={<Usersetting/>}/>
                  <Route path="Profile" element={<Profile />} />
                  <Route path="Usermook" element={<Mook />} />
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
