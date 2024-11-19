import React, { useEffect, useState } from 'react';
import "../Style/Profile.css";

const Profile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/user');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUser();
  }, []);                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               

  if (!user) return <div>Loading...</div>;

  return (
    <>
      <div className="container">
        <div className="main-body">
          <nav aria-label="breadcrumb" className="main-breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><a href="index.html">Home</a></li>
              <li className="breadcrumb-item">
                <a onClick={(e) => e.preventDefault()}>User</a>
              </li>
              <li className="breadcrumb-item active" aria-current="page">User Profile</li>
            </ol>
          </nav>
          <div className="row gutters-sm">                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              
            <div className="col-md-4 mb-3">
              <div className="card">
                <div className="card-body">
                  <div className="d-flex flex-column align-items-center text-center">
                    <img 
                      src={user?.profilepic || "https://bootdey.com/img/Content/avatar/avatar7.png"} 
                      alt={`${user?.firstname} ${user?.lastname}`} 
                      className="rounded-circle" 
                      width="150" 
                    />
                    <div className="mt-3">
                      <h4>{`${user?.firstname} ${user?.lastname}`}</h4>
                      <p className="text-secondary mb-1">{user?.slogan || "No Slogan"}</p>
                      <p className="text-muted font-size-sm">{user?.address || "No Address"}</p>
                      <button className="btn btn-outline-primary">Message</button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card mt-3">
                <ul className="list-group list-group-flush">
                  {/* Social Links (Replace these with actual user data if available) */}
                  {[
                    // Placeholder social links
                  ].map(({ icon, label, value }) => (
                    <li className="list-group-item d-flex justify-content-between align-items-center flex-wrap" key={label}>
                      <h6 className="mb-0">
                        <svg xmlns={`http://www.w3.org/2000/svg`} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`feather feather-${icon} mr-2 icon-inline`}>
                          {/* SVG path here */}
                        </svg>
                        {label}
                      </h6>
                      <span className="text-secondary">{value}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="col-md-8">
              <div className="card mb-3">
                <div className="card-body">
                  {[
                    { label: "Full Name", value: `${user?.firstname} ${user?.lastname}` },
                    { label: "Email", value: user?.email },
                    { label: "Phone", value: user?.phone },
                    { label: "Date of Birth", value: user?.datebirth },
                    { label: "Address", value: user?.address },
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
              <div className="row gutters-sm">
                {/* Interests or Projects could be shown here */}
                <div className="col-sm-12 mb-3">
                  <div className="card h-100">
                    <div className="card-body">
                      <h6 className="d-flex align-items-center mb-3"><i className="material-icons text-info mr-2">Interests</i></h6>
                      <ul>
                        {user?.interests.map((interest, index) => (
                          <li key={index}>{interest}</li>
                        ))}
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
