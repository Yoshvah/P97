import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; // Assuming Font Awesome is set up
import { faHeart } from "@fortawesome/free-solid-svg-icons"; // Example icon
import "./Style/Footer.css"; // Ensure this path matches your folder structure

const Footer = () => {
  return (
    <footer className="footer-container">
      <p>
        &copy; {new Date().getFullYear()} All Rights Reserved by <strong>Yo</strong>. Built with{" "}
        <FontAwesomeIcon icon={faHeart} style={{ color: "red" }} /> by{" "}
        <a href="https://yourwebsite.com" target="_blank" rel="noopener noreferrer">
          YourName
        </a>.
      </p>
    </footer>
  );
};

export default Footer;
