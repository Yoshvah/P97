import { NavLink } from "react-router-dom";
import Footer from "pages/Footer";
import Navbar from "components/Navbar"
import HomeImg from "../../images/home.png";
import './index.css';
function Home() {
  return (

    <div className="sub_page">
      <Navbar />
      <section className="slider">
      <div className="text-content">
        <h2 className="h3">Welcome to</h2>
        <h1 data-text="HELLO!">MOOK</h1>
        <NavLink to="/Mook/message">
          <button className="submit-btn2">Get Started</button>
        </NavLink>
      </div>
      <div className="image-content">
        <img src={HomeImg} alt="Logo" className="logo1" />
      </div>
    </section>
    <Footer />
  </div>
  )
}

export default Home
