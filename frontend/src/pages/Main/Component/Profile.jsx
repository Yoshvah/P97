import React, { useEffect, useState } from 'react';
import "../Style/Profile.css";
import axios from 'axios';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');

    if (!token || !userId) {
      setError('You must be logged in to view your profile.');
      return;
    }

    const fetchUser = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/profile?userId=${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data);
      } catch (error) {
        setError('Failed to fetch user profile. Please try again.');
      }
    };

    fetchUser();
  }, []);

  if (error) return <div className="error-message">{error}</div>;
  if (!user) return <div className="loading">Loading...</div>;

  return (
    <div className="profile-container">
      <nav className="breadcrumb-container">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><a href="/">Home</a></li>
          <li className="breadcrumb-item active">User Profile</li>
        </ol>
      </nav>

      <div className="profile-card">
        <div className="profile-header">
          <img 
            src={user.profilePicture || "https://bootdey.com/img/Content/avatar/avatar7.png"} 
            alt={user.username} 
            className="profile-picture"
          />
          <h2>{user.username}</h2>
          <p className="profile-slogan">{user.slogan || "No Slogan"}</p>
        </div>

        <div className="profile-details">
          <div className="detail-row">
            <span className="label">Full Name:</span>
            <span className="value">{user.username}</span>
          </div>
          <div className="detail-row">
            <span className="label">Email:</span>
            <span className="value">{user.email}</span>
          </div>
          <div className="detail-row">
            <span className="label">Phone:</span>
            <span className="value">{user.phone}</span>
          </div>
          <div className="detail-row">
            <span className="label">Date of Birth:</span>
            <span className="value">{user.birthday}</span>
          </div>
          <div className="detail-row">
            <span className="label">Address:</span>
            <span className="value">{user.address}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

















// import React, { useEffect, useState } from 'react';
// import "../Style/Profile.css";
// import axios from 'axios';

// const Profile = () => {
//   const [user, setUser] = useState(null);
//   const [error, setError] = useState(null);

//   // Fetch user profile data
//   useEffect(() => {
//     const token = localStorage.getItem('token'); // Retrieve token from localStorage
//     const userId = localStorage.getItem('userId'); // Retrieve userId from localStorage

//     if (!token || !userId) {
//       setError('You must be logged in to view your profile.');
//       return;
//     }

//     const fetchUser = async () => {
//       try {
//         const response = await axios.get(`http://localhost:8000/api/profile?userId=${userId}`, {
//           headers: {
//             Authorization: `Bearer ${token}`, // Send token as Bearer in Authorization header
//           },
//         });

//         setUser(response.data); // Set the user data
//       } catch (error) {
//         console.error('Error fetching user profile:', error);
//         setError('Failed to fetch user profile. Please try again.');
//       }
//     };

//     fetchUser();
//   }, []);

//   if (error) return <div className="error">{error}</div>;
//   if (!user) return <div>Loading...</div>;

//   return (
//     <>
//       <div className="container">
//         <div className="main-body">
//           {/* Breadcrumb */}
//           <nav aria-label="breadcrumb" className="main-breadcrumb">
//             <ol className="breadcrumb">
//               <li className="breadcrumb-item"><a href="/">Home</a></li>
//               <li className="breadcrumb-item active" aria-current="page">User Profile</li>
//             </ol>
//           </nav>

//           {/* Profile Details */}
//           <div className="row gutters-sm">
//             <div className="col-md-4 mb-3">
//               <div className="card">
//                 <div className="card-body">
//                   <div className="d-flex flex-column align-items-center text-center">
//                     <img 
//                       src={user?.profilePicture || "https://bootdey.com/img/Content/avatar/avatar7.png"} 
//                       alt={`${user?.username || "Username"}`} 
//                       className="rounded-circle" 
//                       width="150" 
//                     />
//                     <div className="mt-3">
//                       <h4>{`${user?.username || "username"}`}</h4>
//                       <p className="text-secondary mb-1">{user?.slogan || "No Slogan"}</p>
//                       <p className="text-muted font-size-sm">{user?.address || "No Address"}</p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div className="col-md-8">
//               <div className="card mb-3">
//                 <div className="card-body">
//                   <div className="row">
//                     <div className="col-sm-3"><h6 className="mb-0">Full Name</h6></div>
//                     <div className="col-sm-9 text-secondary">{`${user.username}`}</div>
//                   </div>
//                   <hr />
//                   <div className="row">
//                     <div className="col-sm-3"><h6 className="mb-0">Email</h6></div>
//                     <div className="col-sm-9 text-secondary">{user.email}</div>
//                   </div>
//                   <hr />
//                   <div className="row">
//                     <div className="col-sm-3"><h6 className="mb-0">Phone</h6></div>
//                     <div className="col-sm-9 text-secondary">{user.phone}</div>
//                   </div>
//                   <hr />
//                   <div className="row">
//                     <div className="col-sm-3"><h6 className="mb-0">Date of Birth</h6></div>
//                     <div className="col-sm-9 text-secondary">{user.birthday}</div>
//                   </div>
//                   <hr />
//                   <div className="row">
//                     <div className="col-sm-3"><h6 className="mb-0">Address</h6></div>
//                     <div className="col-sm-9 text-secondary">{user.address}</div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Profile;
