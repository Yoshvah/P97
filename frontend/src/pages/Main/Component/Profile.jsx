import React, { useEffect, useState } from 'react';
import "../Style/Profile.css";
import axios from 'axios';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');

  // Fetch user profile data
  useEffect(() => {
    if (!token) {
      setError('You must be logged in to view your profile.');
      return;
    }else{
      console.log('Token',token)
    }

    const fetchUser = async () => {
      try {
          const response = await axios.post('http://localhost:8000/api/profile', {
              token: token, // Send the token in the request body
          });
          setUser(response.data);
      } catch (error) {
          console.error('Error fetching user profile:', error);
          setError('Failed to fetch user profile. Please try again.');
      }
  };
  

    fetchUser();
  }, [token]);

  if (error) return <div className="error">{error}</div>;
  if (!user) return <div>Loading...</div>;

  return (
    <>
      <div className="container">
        <div className="main-body">
          {/* Breadcrumb */}
          <nav aria-label="breadcrumb" className="main-breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><a href="/">Home</a></li>
              <li className="breadcrumb-item"><a href="#" onClick={(e) => e.preventDefault()}>User</a></li>
              <li className="breadcrumb-item active" aria-current="page">User Profile</li>
            </ol>
          </nav>

          {/* Profile Details */}
          <div className="row gutters-sm">
            {/* Left Sidebar */}
            <div className="col-md-4 mb-3">
              <div className="card">
                <div className="card-body">
                  <div className="d-flex flex-column align-items-center text-center">
                    <img 
                      src={user?.profilepic || "https://bootdey.com/img/Content/avatar/avatar7.png"} 
                      alt={`${user?.firstname || "User"} ${user?.lastname || ""}`} 
                      className="rounded-circle" 
                      width="150" 
                    />
                    <div className="mt-3">
                      <h4>{`${user?.firstname || "Firstname"} ${user?.lastname || "Lastname"}`}</h4>
                      <p className="text-secondary mb-1">{user?.slogan || "No Slogan"}</p>
                      <p className="text-muted font-size-sm">{user?.address || "No Address"}</p>
                      <button className="btn btn-outline-primary">Message</button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="card mt-3">
                <ul className="list-group list-group-flush">
                  {[
                    { icon: "facebook", label: "Facebook", value: "facebook.com/username" },
                    { icon: "twitter", label: "Twitter", value: "twitter.com/username" },
                    { icon: "linkedin", label: "LinkedIn", value: "linkedin.com/in/username" },
                  ].map(({ icon, label, value }) => (
                    <li className="list-group-item d-flex justify-content-between align-items-center flex-wrap" key={label}>
                      <h6 className="mb-0">
                        <svg xmlns={`http://www.w3.org/2000/svg`} width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`feather feather-${icon} mr-2 icon-inline`}>
                          {/* Add appropriate SVG paths */}
                        </svg>
                        {label}
                      </h6>
                      <span className="text-secondary">{value}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right Content */}
            <div className="col-md-8">
              {/* Basic Information */}
              <div className="card mb-3">
                <div className="card-body">
                  {[
                    { label: "Full Name", value: `${user?.firstname || ""} ${user?.lastname || ""}` },
                    { label: "Email", value: user?.email || "No Email" },
                    { label: "Phone", value: user?.phone || "No Phone" },
                    { label: "Date of Birth", value: user?.datebirth || "No Birthdate" },
                    { label: "Address", value: user?.address || "No Address" },
                  ].map(({ label, value }) => (
                    <div className="row" key={label}>
                      <div className="col-sm-3">
                        <h6 className="mb-0">{label}</h6>
                      </div>
                      <div className="col-sm-9 text-secondary">{value}</div>
                      <hr />
                    </div>
                  ))}
                </div>
              </div>

              {/* Interests Section */}
              <div className="row gutters-sm">
                <div className="col-sm-12 mb-3">
                  <div className="card h-100">
                    <div className="card-body">
                      <h6 className="d-flex align-items-center mb-3"><i className="material-icons text-info mr-2">Interests</i></h6>
                      <ul>
                        {user?.interests && user.interests.length > 0 ? (
                          user.interests.map((interest, index) => <li key={index}>{interest}</li>)
                        ) : (
                          <li>No Interests</li>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
