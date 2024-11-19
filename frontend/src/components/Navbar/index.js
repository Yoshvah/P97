import React, { useState } from "react"
import "react-dropdown/style.css"
import './index.css';
import { NavLink } from 'react-router-dom';
function Navbar() {


  return (
    <div>
      <header className="header">
        <NavLink to="/" className="logo">
          <h1 className="lo">MOOK.MG</h1>
        </NavLink>
        
        {/* Add the opening <nav> tag */}
        <nav className="nav">
          <NavLink
            to="/login"
            className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
          >
            LOGIN
          </NavLink>
          
          <NavLink
            to="/register"
            className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
          >
            REGISTER
          </NavLink>
        </nav>
      </header>
    </div>
  )
}

export default Navbar
