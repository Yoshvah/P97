import React, { useState, useEffect } from 'react';
import { Table, Form, Button, InputGroup, Modal, Pagination, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { FaEdit, FaTrash } from 'react-icons/fa'; // Import the icons

const Usersetting = () => {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [sortColumn, setSortColumn] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [newUser, setNewUser] = useState({
    id: null,
    username: '',
    email: '',
    roles: [],
    password: '',
    birthday: '',
    slogan: '',
    interest: '',
    phone: '',
    address: '',
    profilePicture: null,
  });
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const itemsPerPage = 5;

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      setError('You must be logged in to view and manage users.');
      return;
    }

    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/admin/getuser', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(response.data);
        console.log(users.roles );

      } catch (error) {
        setError('Error fetching users.');
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, [token]);

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortOrder('asc');
    }
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
    setCurrentPage(1);
  };

  const filteredData = users.filter(
    (user) =>
      user.username.toLowerCase().includes(filter.toLowerCase()) ||
      user.email.toLowerCase().includes(filter.toLowerCase())
  );

  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortColumn) return 0;
    if (sortOrder === 'asc') {
      return a[sortColumn] > b[sortColumn] ? 1 : -1;
    } else {
      return a[sortColumn] < b[sortColumn] ? 1 : -1;
    }
  });

  const paginatedData = sortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append('username', newUser.username);
      formData.append('email', newUser.email);
      formData.append('roles', newUser.roles);
      formData.append('password', newUser.password);
      formData.append('birthday', newUser.birthday);
      formData.append('slogan', newUser.slogan);
      formData.append('interest', JSON.stringify(newUser.interest.split(',').map(i => i.trim())));
      formData.append('phone', newUser.phone);
      formData.append('address', newUser.address);
      if (newUser.profilePicture) {
        formData.append('profilePicture', newUser.profilePicture);
      }

      const response = newUser.id
        ? await axios.put(`http://localhost:8000/api/update/${newUser.id}`, formData, {
            headers: { Authorization: `Bearer ${token}` },
          })
        : await axios.post('http://localhost:8000/api/admin/adduser', formData, {
            headers: { Authorization: `Bearer ${token}` },
          });

      if (newUser.id) {
        setUsers(users.map((user) => (user.id === newUser.id ? response.data : user)));
      } else {
        setUsers([...users, response.data]);
      }

      setShowModal(false);
      resetUserForm();
    } catch (error) {
      console.error('Error saving user:', error);
    }
  };

  const handleEdit = (user) => {
    setNewUser({
      ...user,
      interest: user.interest.join(', '),
    });
    setShowModal(true);
  };

  const handleDelete = async (userId) => {
    try {
      await axios.delete(`http://localhost:8000/api/admin/deleteuser/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(users.filter((user) => user.id !== userId));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setNewUser({ ...newUser, [name]: value });
  };

  const handleInterestChange = (e) => {
    setNewUser({ ...newUser, interest: e.target.value.split(',').map((i) => i.trim()) });
  };

  const handleProfilePictureChange = (e) => {
    setNewUser({ ...newUser, profilePicture: e.target.files[0] });
  };

  const resetUserForm = () => {
    setNewUser({
      id: null,
      username: '',
      email: '',
      roles: [],
      password: '',
      birthday: '',
      slogan: '',
      interest: [],
      phone: '',
      address: '',
      profilePicture: null,
    });
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">User Management</h2>
      <Row className="mb-4">
        <Col md={8}>
          <InputGroup>
            <Form.Control
              type="text"
              placeholder="Filter by username or email"
              value={filter}
              onChange={handleFilterChange}
            />
            <Button variant="primary" onClick={() => setShowModal(true)} className="ms-2">
              Add New User
            </Button>
          </InputGroup>
        </Col>
      </Row>

      {error && <p className="text-danger">{error}</p>}

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>#</th>
            <th onClick={() => handleSort('username')}>Username</th>
            <th onClick={() => handleSort('email')}>Email</th>
            <th>Phone</th>
            <th>Birthday</th>
            <th>Slogan</th>
            <th>Interests</th>
            <th>Address</th>
            <th>Roles</th>
            <th>Profile Picture</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((user, index) => (
            <tr key={user.id}>
              <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.phone || 'N/A'}</td>
              <td>{user.birthday && typeof user.birthday === 'object' ? user.birthday.date : user.birthday || 'N/A'}</td>
              <td>{user.slogan || 'N/A'}</td>
              <td>{user.interest ? user.interest.join(', ') : 'N/A'}</td>
              <td>{user.address || 'N/A'}</td>
              <td>{user.roles || 'Adm'}</td>
              <td>
                {user.profilePicture ? (
                  <img
                    src={`http://localhost:8000/uploads/${user.profilePicture}`}
                    alt="Profile"
                    style={{ width: '50px', height: '50px', borderRadius: '50%' }}
                  />
                ) : (
                  'N/A'
                )}
              </td>
              <td>
                <Button variant="primary" onClick={() => handleEdit(user)} className="me-2">
                  <FaEdit />
                </Button>
                <Button variant="danger" onClick={() => handleDelete(user.id)}>
                  <FaTrash />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Pagination>
        <Pagination.Prev disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)} />
        <Pagination.Item>{currentPage}</Pagination.Item>
        <Pagination.Next
          disabled={currentPage === Math.ceil(filteredData.length / itemsPerPage)}
          onClick={() => setCurrentPage(currentPage + 1)}
        />
      </Pagination>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{newUser.id ? 'Edit User' : 'Add New User'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {/* Username */}
            <Form.Group controlId="formUsername">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                name="username"
                value={newUser.username}
                onChange={handleEditChange}
              />
            </Form.Group>

            {/* Email */}
            <Form.Group controlId="formEmail" className="mt-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={newUser.email}
                onChange={handleEditChange}
              />
            </Form.Group>

            {/* Phone */}
            <Form.Group controlId="formPhone" className="mt-3">
              <Form.Label>Phone</Form.Label>
              <Form.Control
                type="text"
                name="phone"
                value={newUser.phone}
                onChange={handleEditChange}
              />
            </Form.Group>

            {/* Birthday */}
            <Form.Group controlId="formBirthday" className="mt-3">
              <Form.Label>Birthday</Form.Label>
              <Form.Control
                type="date"
                name="birthday"
                value={newUser.birthday}
                onChange={handleEditChange}
              />
            </Form.Group>

            {/* Slogan */}
            <Form.Group controlId="formSlogan" className="mt-3">
              <Form.Label>Slogan</Form.Label>
              <Form.Control
                type="text"
                name="slogan"
                value={newUser.slogan}
                onChange={handleEditChange}
              />
            </Form.Group>

            {/* Interest */}
            <Form.Group controlId="formInterest" className="mt-3">
              <Form.Label>Interest</Form.Label>
              <Form.Control
                type="text"
                name="interest"
                value={newUser.interest}
                onChange={handleEditChange}
                placeholder="Enter interests separated by commas"
              />
            </Form.Group>

            {/* Address */}
            <Form.Group controlId="formAddress" className="mt-3">
              <Form.Label>Address</Form.Label>
              <Form.Control
                type="text"
                name="address"
                value={newUser.address}
                onChange={handleEditChange}
              />
            </Form.Group>

            {/* Roles */}
            <Form.Group controlId="formRoles" className="mt-3">
              <Form.Label>Roles</Form.Label>
              <Form.Select
                multiple
                name="roles"
                value={newUser.roles}  // Ensure it's an array
                onChange={(e) => {
                  const selectedOptions = Array.from(e.target.selectedOptions).map(option => option.value);
                  setNewUser({ ...newUser, roles: selectedOptions });
                }}
              >
                <option value="ROLE_USER">ROLE_USER</option>
                <option value="ROLE_ADMIN">ROLE_ADMIN</option>
              </Form.Select>
            </Form.Group>

            {/* Profile Picture */}
            <Form.Group controlId="formProfilePicture" className="mt-3">
              <Form.Label>Profile Picture</Form.Label>
              <Form.Control
                type="file"
                name="profilePicture"
                onChange={handleProfilePictureChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

    </div>
  );
};

export default Usersetting;
