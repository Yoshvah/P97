import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "../Style/Profile.css";
import { Modal, Form, Button } from 'react-bootstrap';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [updatedUser, setUpdatedUser] = useState({
    username: '',
    email: '',
    phone: '',
    address: '',
    birthday: '',
    slogan: '',
    interest: [],
    profilePicture: '',
    sexe: '', // Added `sexe` field
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');

    if (!token || !userId) {
      setError('You must be logged in to view your profile.');
      return;
    }

    const fetchUser = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/profile/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log(response.data); // Check data here
        setUser(response.data);
        setUpdatedUser(response.data); // Initialize updatedUser with the current user data
      } catch (error) {
        setError('Failed to fetch user profile. Please try again.');
      }
    };

    fetchUser();
  }, []);
  

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setUpdatedUser((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleInterestChange = (e) => {
    const interests = e.target.value.split(',').map((interest) => interest.trim());
    setUpdatedUser((prevState) => ({
      ...prevState,
      interest: interests,
    }));
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUpdatedUser((prevState) => ({
        ...prevState,
        profilePicture: URL.createObjectURL(file),
      }));
    }
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    try {
      const response = await axios.put(
        `http://localhost:8000/api/admin/updateuser/${userId}`,
        updatedUser,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUser(response.data); // Update the profile with the new data
      setShowModal(false); // Close the modal after updating
    } catch (error) {
      setError('Failed to update profile. Please try again.');
    }
  };

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

      <div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>Edit Profile</button>
      </div>

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
            <span className="value">{user.email || "No Email Provided"}</span>
          </div>
          <div className="detail-row">
            <span className="label">Phone:</span>
            <span className="value">{user.phone || "No Phone Provided"}</span>
          </div>
          <div className="detail-row">
            <span className="label">Sexe:</span>
            <span className="value">{user.sexe || "No sexe Provided"}</span>
          </div>
          <div className="detail-row">
            <span className="label">Date of Birth:</span>
            <span className="value">
              {user.birthday ? new Date(user.birthday).toLocaleDateString() : "No Birthday Provided"}
            </span>
          </div>
          <div className="detail-row">
            <span className="label">Address:</span>
            <span className="value">{user.address || "No Address Provided"}</span>
          </div>
          <div className="detail-row">
            <span className="label">Interests:</span>
            <span className="value">{user.interest.length ? user.interest.join(", ") : "No Interests"}</span>
          </div>
          <div className="detail-row">
            <span className="label">Gender:</span>
            <span className="value">{user.sexe || "Not Specified"}</span> {/* Display gender */}
          </div>
        </div>
      </div>

      {/* Modal for editing the profile */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formUsername">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                name="username"
                value={updatedUser.username}
                onChange={handleEditChange}
              />
            </Form.Group>
            <Form.Group controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={updatedUser.email}
                onChange={handleEditChange}
              />
            </Form.Group>
            <Form.Group controlId="formPhone">
              <Form.Label>Phone</Form.Label>
              <Form.Control
                type="text"
                name="phone"
                value={updatedUser.phone}
                onChange={handleEditChange}
              />
            </Form.Group>
            <Form.Group controlId="formAddress">
              <Form.Label>Address</Form.Label>
              <Form.Control
                type="text"
                name="address"
                value={updatedUser.address}
                onChange={handleEditChange}
              />
            </Form.Group>
            <Form.Group controlId="formBirthday">
              <Form.Label>Birthday</Form.Label>
              <Form.Control
                type="date"
                name="birthday"
                value={updatedUser.birthday}
                onChange={handleEditChange}
              />
            </Form.Group>
            <Form.Group controlId="formSlogan">
              <Form.Label>Slogan</Form.Label>
              <Form.Control
                type="text"
                name="slogan"
                value={updatedUser.slogan}
                onChange={handleEditChange}
              />
            </Form.Group>
            <Form.Group controlId="formInterest">
              <Form.Label>Interests (comma separated)</Form.Label>
              <Form.Control
                type="text"
                name="interest"
                value={updatedUser.interest.join(', ')}
                onChange={handleInterestChange}
              />
            </Form.Group>
            <Form.Group controlId="formSexe">
              <Form.Label>Gender</Form.Label>
              <Form.Control
                as="select"
                name="sexe"
                value={updatedUser.sexe}
                onChange={handleEditChange}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formProfilePicture">
              <Form.Label>Profile Picture</Form.Label>
              <Form.Control
                type="file"
                onChange={handleProfilePictureChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
          <Button variant="primary" onClick={handleSubmit}>Save Changes</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Profile;
