import React, { useState } from "react"
import "react-dropdown/style.css"
import './index.css';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function Footer() {


  return (

    <footer className="footer-container">
    <p>
      &copy; All Rights Reserved By {"Yo"}
      <a href="/">Made By <FontAwesomeIcon icon="fa-sharp fa-solid fa-circle-heart" /><i class="fa-sharp fa-solid fa-circle-heart"></i></a>
    </p>
  </footer>
  )
}

export default Footer
