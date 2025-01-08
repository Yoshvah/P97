import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../Style/Home.css'; // Assuming your CSS file is named Home.css

const Home = () => {
  const [users, setUsers] = useState([]);
  const [mooks, setMooks] = useState([]);
  const [enlargedCard, setEnlargedCard] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/users', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    const fetchMooks = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/mooks', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMooks(response.data);
      } catch (error) {
        console.error('Error fetching mooks:', error);
      }
    };

    fetchUsers();
    fetchMooks();
  }, [token]);

  const handleCardClick = (type, id) => {
    if (type === 'user') {
      navigate(`/Mook/UserProfile/${id}`); // Navigate to the user profile page
    } else if (type === 'mook') {
      navigate(`/Usermook/${id}`);
    }
  };

  const handleCardEnlarge = (id) => {
    setEnlargedCard(id);
  };

  const handleCardShrink = () => {
    setEnlargedCard(null);
  };

  return (
    <div className="home-container">
      <h1 className="home-title">Profiles and Mooks</h1>
      <div className="home-cards-container">
        <div className="home-cards-section">
          <h2 className="home-section-title">User Profiles</h2>
          <div className="home-cards-scroll">
            {users.map((user) => (
              <div
                key={user.id}
                className={`home-card ${enlargedCard === user.id ? 'enlarged' : ''}`}
                onClick={() => handleCardClick('user', user.id)}
                onMouseEnter={() => handleCardEnlarge(user.id)}
                onMouseLeave={handleCardShrink}
              >
                <div className="wrapper">
                  <img
                    src={user.profilePicture || 'https://bootdey.com/img/Content/avatar/avatar7.png'}
                    alt={user.username}
                    className="cover-image"
                  />
                </div>
                <div className="home-card-content">
                  <h3 className="home-card-title">{user.username}</h3>
                  <p className="home-card-text">{user.slogan || 'No Slogan'}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="home-cards-section">
          <h2 className="home-section-title">Mooks</h2>
          <div className="home-cards-scroll">
            {mooks.filter(mook => !mook.isPrivate).map((mook) => (
              <div
                key={mook.id}
                className={`home-card ${enlargedCard === mook.id ? 'enlarged' : ''}`}
                onClick={() => handleCardClick('mook', mook.id)}
                onMouseEnter={() => handleCardEnlarge(mook.id)}
                onMouseLeave={handleCardShrink}
              >
                <div className="wrapper">
                  <img
                    src="https://img.freepik.com/free-photo/nature-design-with-bokeh-effect_1048-1882.jpg"
                    alt={mook.title}
                    className="cover-image"
                  />
                </div>
                <div className="home-card-content">
                  <h3 className="home-card-title">{mook.title}</h3>
                  <p className="home-card-text">{mook.contentData || 'No description available'}</p>
                  <p className="home-card-text">Creator: {mook.creatorId || 'No Creator'}</p>
                  <p className="home-card-text">Private: {mook.isPrivate ? 'Yes' : 'No'}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
