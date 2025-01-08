import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "../Style/Profile.css"; // Assuming your CSS file is named Profile.css
import { Modal, Form, Button } from 'react-bootstrap';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showProfilePictureModal, setShowProfilePictureModal] = useState(false);
  const [updatedUser, setUpdatedUser] = useState({
    username: '',
    email: '',
    phone: '',
    address: '',
    birthday: '',
    slogan: '',
    interest: [],
    sexe: '', // Added sexe field
    facebook: '',
    twitter: '',
    instagram: '',
    github: '',
    jobs: [],
    isAdmin: false, // Added isAdmin field
    profilePicture: '' // Added profilePicture field
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
        setUser(response.data);
        setUpdatedUser(response.data); // Initialize updatedUser with the current user data
      } catch (error) {
        setError('Failed to fetch user profile. Please try again.');
        console.error('Error fetching user profile:', error);
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

  const handleProfilePictureChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('profilePicture', file);

      try {
        const response = await axios.post('http://localhost:8000/api/upload/profilepicture', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
        });

        setUpdatedUser((prevState) => ({
          ...prevState,
          profilePicture: response.data.imageUrl,
        }));
      } catch (error) {
        setError('Failed to upload profile picture. Please try again.');
        console.error('Error uploading profile picture:', error);
      }
    }
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    try {
      // Update other user details
      const response = await axios.put(
        `http://localhost:8000/api/update/${userId}`,
        updatedUser,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUser(response.data); // Update the profile with the new data
      setShowModal(false); // Close the modal after updating
    } catch (error) {
      setError('Failed to update profile. Please try again.');
      console.error('Error updating profile:', error);
    }
  };

  const handleProfilePictureSubmit = async () => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    try {
      // Update profile picture separately if it has changed
      if (updatedUser.profilePicture) {
        await axios.put(
          `http://localhost:8000/api/updateuser/${userId}`,
          { profilePicture: updatedUser.profilePicture },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      }
      setShowProfilePictureModal(false); // Close the modal after updating
    } catch (error) {
      setError('Failed to update profile picture. Please try again.');
      console.error('Error updating profile picture:', error);
    }
  };

  if (error) return <div className="error-message">{error}</div>;
  if (!user) return <div className="loading">Loading...</div>;

  return (
    <>
      <div className="profile-container">
        <nav aria-label="breadcrumb" className="profile-main-breadcrumb">
          <ol className="profile-breadcrumb">
            <li className="profile-breadcrumb-item"><a href="/">Home</a></li>
            <li className="profile-breadcrumb-item active" aria-current="page">User Profile</li>
          </ol>
        </nav>

        <div className="row profile-gutters-sm">
          <div className="col-md-4 mb-3">
            <div className="profile-card">
              <div className="profile-card-body">
                <div className="d-flex flex-column align-items-center text-center">
                  <img
                    src={updatedUser.profilePicture || "https://bootdey.com/img/Content/avatar/avatar7.png"}
                    alt={user.username}
                    className="profile-picture"
                    onClick={() => setShowProfilePictureModal(true)}
                    style={{ cursor: 'pointer' }}
                  />
                  <div className="mt-3">
                    <h4>{user.username}</h4>
                    <p className="text-secondary mb-1">{user.slogan || "No Slogan"}</p>
                    <p className="text-muted font-size-sm">{user.address || "No Address"}</p>
                    <button className="btn btn-outline-primary profile-btn-outline-primary" onClick={() => setShowModal(true)}>Edit</button>
                  </div>
                </div>
              </div>
            </div>
            <div className="profile-card mt-3">
              <ul className="list-group list-group-flush">
                <li className="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                  <h6 className="mb-0">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="feather feather-globe mr-2 icon-inline"
                    >
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="2" y1="12" x2="22" y2="12"></line>
                    </svg>
                    Website
                  </h6>
                  <span className="text-secondary">https://bootdey.com</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                  <h6 className="mb-0">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="feather feather-github mr-2 icon-inline"
                    >
                      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                    </svg>
                    Github
                  </h6>
                  <span className="text-secondary">{user.github || 'bootdey'}</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                  <h6 className="mb-0">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="feather feather-twitter mr-2 icon-inline text-info"
                    >
                      <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                    </svg>
                    Twitter
                  </h6>
                  <span className="text-secondary">{user.twitter || '@bootdey'}</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                  <h6 className="mb-0">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="feather feather-instagram mr-2 icon-inline text-danger"
                    >
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                    </svg>
                    Instagram
                  </h6>
                  <span className="text-secondary">{user.instagram || 'bootdey'}</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                  <h6 className="mb-0">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="feather feather-facebook mr-2 icon-inline text-primary"
                    >
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                    </svg>
                    Facebook
                  </h6>
                  <span className="text-secondary">{user.facebook || 'bootdey'}</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="col-md-8">
            <div className="profile-card mb-3">
              <div className="profile-card-body">
                <div className="row">
                  <div className="col-sm-3">
                    <h6 className="mb-0">Full Name</h6>
                  </div>
                  <div className="col-sm-9 text-secondary">
                    {user.username}
                  </div>
                </div>
                <hr />
                <div className="row">
                  <div className="col-sm-3">
                    <h6 className="mb-0">Email</h6>
                  </div>
                  <div className="col-sm-9 text-secondary">
                    {user.email || "No Email Provided"}
                  </div>
                </div>
                <hr />
                <div className="row">
                  <div className="col-sm-3">
                    <h6 className="mb-0">Phone</h6>
                  </div>
                  <div className="col-sm-9 text-secondary">
                    {user.phone || "No Phone Provided"}
                  </div>
                </div>
                <hr />
                <div className="row">
                  <div className="col-sm-3">
                    <h6 className="mb-0">Address</h6>
                  </div>
                  <div className="col-sm-9 text-secondary">
                    {user.address || "No Address Provided"}
                  </div>
                </div>
                <hr />
                <div className="row">
                  <div className="col-sm-3">
                    <h6 className="mb-0">Gender</h6>
                  </div>
                  <div className="col-sm-9 text-secondary">
                    {user.sexe || "No gender Provided"}
                  </div>
                </div>
                <hr />
                <div className="row">
                  <div className="col-sm-3">
                    <h6 className="mb-0">Jobs</h6>
                  </div>
                  <div className="col-sm-9 text-secondary">
                    {user.jobs.length ? user.jobs.join(', ') : "No Jobs"}
                  </div>
                </div>
                <hr />
                <div className="row">
                  <div className="col-sm-3">
                    <h6 className="mb-0">Role</h6>
                  </div>
                  <div className="col-sm-9 text-secondary">
                    {user.isAdmin ? "Admin" : "User"}
                  </div>
                </div>
              </div>
            </div>

            <div className="row profile-gutters-sm">
              <div className="col-sm-6 mb-3">
                <div className="profile-card profile-h-100">
                  <div className="profile-card-body">
                    <h6 className="d-flex align-items-center mb-3">
                      <i className="material-icons text-info mr-2">Jobs</i>
                    </h6>
                    <ul className="list-group list-group-flush">
                      {user.jobs.map((job, index) => (
                        <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                          {job}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
              <div className="col-sm-6 mb-3">
                <div className="profile-card profile-h-100">
                  <div className="profile-card-body">
                    <h6 className="d-flex align-items-center mb-3">
                      <i className="material-icons text-info mr-2">Interests</i>
                    </h6>
                    <ul className="list-group list-group-flush">
                      {user.interest.map((interest, index) => (
                        <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                          {interest}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

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
            <Form.Group controlId="formFacebook">
              <Form.Label>Facebook</Form.Label>
              <Form.Control
                type="text"
                name="facebook"
                value={updatedUser.facebook}
                onChange={handleEditChange}
              />
            </Form.Group>
            <Form.Group controlId="formTwitter">
              <Form.Label>Twitter</Form.Label>
              <Form.Control
                type="text"
                name="twitter"
                value={updatedUser.twitter}
                onChange={handleEditChange}
              />
            </Form.Group>
            <Form.Group controlId="formInstagram">
              <Form.Label>Instagram</Form.Label>
              <Form.Control
                type="text"
                name="instagram"
                value={updatedUser.instagram}
                onChange={handleEditChange}
              />
            </Form.Group>
            <Form.Group controlId="formGithub">
              <Form.Label>Github</Form.Label>
              <Form.Control
                type="text"
                name="github"
                value={updatedUser.github}
                onChange={handleEditChange}
              />
            </Form.Group>
            <Form.Group controlId="formJobs">
              <Form.Label>Jobs (comma separated)</Form.Label>
              <Form.Control
                type="text"
                name="jobs"
                value={updatedUser.jobs.join(', ')}
                onChange={(e) => {
                  const jobs = e.target.value.split(',').map((job) => job.trim());
                  setUpdatedUser((prevState) => ({
                    ...prevState,
                    jobs: jobs,
                  }));
                }}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
          <Button variant="primary" onClick={handleSubmit}>Save Changes</Button>
        </Modal.Footer>
      </Modal>

      {/* Modal for updating profile picture */}
      <Modal show={showProfilePictureModal} onHide={() => setShowProfilePictureModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Update Profile Picture</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
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
          <Button variant="secondary" onClick={() => setShowProfilePictureModal(false)}>Close</Button>
          <Button variant="primary" onClick={handleProfilePictureSubmit}>Update Picture</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Profile;
