import React, { useState, useEffect } from 'react';
import { Table, Form, Button, InputGroup, Modal, Pagination, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

const Usersetting = () => {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [sortColumn, setSortColumn] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [newUser, setNewUser] = useState({
    username: '',
    email: '',
    phone: '',
    address: '',
    birthday: '',
    slogan: '',
    interest: '',
    profilePicture: ''
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

  const handleAddUser = async () => {
    if (!newUser.username || !newUser.email || !newUser.phone || !newUser.address || !newUser.birthday || !newUser.slogan || !newUser.interest) {
      alert('Please fill all fields');
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:8000/api/admin/adduser',
        newUser,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUsers([...users, response.data]);
      setShowModal(false);
      setNewUser({
        username: '',
        email: '',
        phone: '',
        address: '',
        birthday: '',
        slogan: '',
        interest: '',
        profilePicture: ''
      });
    } catch (error) {
      console.error('Error adding user:', error);
    }
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

  const handleEdit = (userId) => {
    const userToEdit = users.find(user => user.id === userId);
    setNewUser(userToEdit);  // Set the selected user data to the modal form
    setShowModal(true);
  };

  const handleUpdateUser = async () => {
    try {
      const response = await axios.put(
        `http://localhost:8000/api/admin/updateuser/${newUser.id}`,
        newUser,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUsers(users.map(user => user.id === newUser.id ? response.data : user));
      setShowModal(false);
      setNewUser({
        username: '',
        email: '',
        phone: '',
        address: '',
        birthday: '',
        slogan: '',
        interest: '',
        profilePicture: ''
      });
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">User Management</h2>

      {/* Filter Input */}
      <Row className="mb-4">
        <Col md={8}>
          <InputGroup>
            <Form.Control
              type="text"
              placeholder="Filter by username or email"
              value={filter}
              onChange={handleFilterChange}
            />
            <Button
              variant="primary"
              onClick={() => setShowModal(true)}
              className="ms-2"
            >
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
            <th onClick={() => handleSort('phone')}>Phone</th>
            <th onClick={() => handleSort('address')}>Address</th>
            <th onClick={() => handleSort('birthday')}>Birthday</th>
            <th onClick={() => handleSort('slogan')}>Slogan</th>
            <th onClick={() => handleSort('interest')}>Interest</th>
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
              <td>{user.phone}</td>
              <td>{user.address}</td>
              <td>{user.birthday}</td>
              <td>{user.slogan}</td>
              <td>{user.interest}</td>
              <td>
                {user.profilePicture ? (
                  <img
                    src={user.profilePicture}
                    alt={user.username}
                    style={{ width: '50px', height: '50px', borderRadius: '50%' }}
                  />
                ) : (
                  <img
                    src="https://img.freepik.com/free-photo/nature-design-with-bokeh-effect_1048-1882.jpg"
                    alt="default"
                    style={{ width: '50px', height: '50px', borderRadius: '50%' }}
                  />
                )}
              </td>
              <td>
                <Button
                  variant="primary"
                  onClick={() => handleEdit(user.id)}
                  className="me-2"
                >
                  <i className="fas fa-pencil-alt"></i>
                </Button>
                <Button
                  variant="danger"
                  onClick={() => handleDelete(user.id)}
                >
                  <i className="fas fa-trash-alt"></i>
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Pagination */}
      <div className="d-flex justify-content-center mt-3">
        <Pagination>
          <Pagination.Prev
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
          />
          <Pagination.Item>{currentPage}</Pagination.Item>
          <Pagination.Next
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === Math.ceil(filteredData.length / itemsPerPage)}
          />
        </Pagination>
      </div>

      {/* Modal for adding or editing a user */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{newUser.id ? 'Edit User' : 'Add New User'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {['username', 'email', 'phone', 'address', 'birthday', 'slogan', 'interest'].map((field) => (
              <Form.Group key={field} controlId={`form${field.charAt(0).toUpperCase() + field.slice(1)}`} className="mb-3">
                <Form.Label>{field.charAt(0).toUpperCase() + field.slice(1)}</Form.Label>
                <Form.Control
                  type="text"
                  value={newUser[field]}
                  onChange={(e) => setNewUser({ ...newUser, [field]: e.target.value })}
                />
              </Form.Group>
            ))}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={newUser.id ? handleUpdateUser : handleAddUser}
          >
            {newUser.id ? 'Update User' : 'Add User'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Usersetting;

































// import React, { useState, useEffect } from 'react';
// import { Table, Form, Button, InputGroup, Modal, Pagination, Row, Col } from 'react-bootstrap';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import axios from 'axios';

// const Usersetting = () => {
//   const [users, setUsers] = useState([]);
//   const [filter, setFilter] = useState('');
//   const [sortOrder, setSortOrder] = useState('asc');
//   const [sortColumn, setSortColumn] = useState('');
//   const [currentPage, setCurrentPage] = useState(1);
//   const [newUser, setNewUser] = useState({
//     username: '',
//     email: '',
//     phone: '',
//     address: '',
//     birthday: '',
//     slogan: '',
//     interest: '',
//   });
//   const [error, setError] = useState(null);
//   const [showModal, setShowModal] = useState(false);
//   const itemsPerPage = 5;

//   const token = localStorage.getItem('token');

//   useEffect(() => {
//     if (!token) {
//       setError('You must be logged in to view and manage users.');
//       return;
//     }

//     const fetchUsers = async () => {
//       try {
//         const response = await axios.get('http://localhost:8000/api/admin/getuser', {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setUsers(response.data);
//       } catch (error) {
//         setError('Error fetching users.');
//         console.error('Error fetching users:', error);
//       }
//     };

//     fetchUsers();
//   }, [token]);

//   const handleSort = (column) => {
//     if (sortColumn === column) {
//       setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
//     } else {
//       setSortColumn(column);
//       setSortOrder('asc');
//     }
//   };

//   const handleFilterChange = (e) => {
//     setFilter(e.target.value);
//     setCurrentPage(1); 
//   };

//   const filteredData = users.filter(
//     (user) =>
//       user.username.toLowerCase().includes(filter.toLowerCase()) ||
//       user.email.toLowerCase().includes(filter.toLowerCase())
//   );

//   const sortedData = [...filteredData].sort((a, b) => {
//     if (!sortColumn) return 0;
//     if (sortOrder === 'asc') {
//       return a[sortColumn] > b[sortColumn] ? 1 : -1;
//     } else {
//       return a[sortColumn] < b[sortColumn] ? 1 : -1;
//     }
//   });

//   const paginatedData = sortedData.slice(
//     (currentPage - 1) * itemsPerPage,
//     currentPage * itemsPerPage
//   );

//   const handleAddUser = async () => {
//     try {
//       const response = await axios.post(
//         'http://localhost:8000/api/admin/adduser',
//         newUser,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       setUsers([...users, response.data]);
//       setShowModal(false);
//       setNewUser({
//         username: '',
//         email: '',
//         phone: '',
//         address: '',
//         birthday: '',
//         slogan: '',
//         interest: '',
//       });
//     } catch (error) {
//       console.error('Error adding user:', error);
//     }
//   };

//   const handleDelete = async (userId) => {
//     try {
//       await axios.delete(`http://localhost:8000/api/admin/deleteuser/${userId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setUsers(users.filter((user) => user.id !== userId));
//     } catch (error) {
//       console.error('Error deleting user:', error);
//     }
//   };

//   const handleEdit = async (userId, field, value) => {
//     try {
//       const updatedUser = { ...users.find((user) => user.id === userId), [field]: value };
//       await axios.put(`http://localhost:8000/api/admin/updateuser/${userId}`, updatedUser, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setUsers(users.map((user) => (user.id === userId ? updatedUser : user)));
//     } catch (error) {
//       console.error('Error updating user:', error);
//     }
//   };

//   return (
//     <div className="container mt-5">
//       <h2 className="text-center mb-4">User Management</h2>

//       {/* Filter Input */}
//       <Row className="mb-4">
//         <Col md={8}>
//           <InputGroup>
//             <Form.Control
//               type="text"
//               placeholder="Filter by username or email"
//               value={filter}
//               onChange={handleFilterChange}
//             />
//             <Button
//               variant="primary"
//               onClick={() => setShowModal(true)}
//               className="ms-2"
//             >
//               Add New User
//             </Button>
//           </InputGroup>
//         </Col>
//       </Row>

//       {error && <p className="text-danger">{error}</p>}

//       <Table striped bordered hover responsive>
//         <thead>
//           <tr>
//             <th>#</th>
//             <th onClick={() => handleSort('username')}>Username</th>
//             <th onClick={() => handleSort('email')}>Email</th>
//             <th onClick={() => handleSort('phone')}>Phone</th>
//             <th onClick={() => handleSort('address')}>Address</th>
//             <th onClick={() => handleSort('birthday')}>Birthday</th>
//             <th onClick={() => handleSort('slogan')}>Slogan</th>
//             <th onClick={() => handleSort('interest')}>Interest</th>
//             <th>Profile Picture</th>
//             <th>Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {paginatedData.map((user, index) => (
//             <tr key={user.id}>
//               <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
//               <td>{user.username}</td>
//               <td>{user.email}</td>
//               <td>{user.phone}</td>
//               <td>{user.address}</td>
//               <td>{user.birthday}</td>
//               <td>{user.slogan}</td>
//               <td>{user.interest}</td>
//               <td>
//                 {user.profilePicture ? (
//                   <img
//                     src={user.profilePicture}
//                     alt={user.username}
//                     style={{ width: '50px', height: '50px', borderRadius: '50%' }}
//                   />
//                 ) : (
//                   <img
//                     src="https://img.freepik.com/free-photo/nature-design-with-bokeh-effect_1048-1882.jpg"
//                     alt="default"
//                     style={{ width: '50px', height: '50px', borderRadius: '50%' }}
//                   />
//                 )}
//               </td>
//               <td>
//                 <Button
//                   variant="primary"
//                   onClick={() => handleEdit(user.id)}
//                   className="me-2"
//                 >
//                   <i className="fas fa-pencil-alt"></i>
//                 </Button>
//                 <Button
//                   variant="danger"
//                   onClick={() => handleDelete(user.id)}
//                 >
//                   <i className="fas fa-trash-alt"></i>
//                 </Button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </Table>

//       {/* Pagination */}
//       <div className="d-flex justify-content-center mt-3">
//         <Pagination>
//           <Pagination.Prev
//             onClick={() => setCurrentPage(currentPage - 1)}
//             disabled={currentPage === 1}
//           />
//           <Pagination.Item>{currentPage}</Pagination.Item>
//           <Pagination.Next
//             onClick={() => setCurrentPage(currentPage + 1)}
//             disabled={currentPage === Math.ceil(filteredData.length / itemsPerPage)}
//           />
//         </Pagination>
//       </div>

//       {/* Modal for adding a new user */}
//       <Modal show={showModal} onHide={() => setShowModal(false)}>
//         <Modal.Header closeButton>
//           <Modal.Title>Add New User</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <Form>
//             {/* Form Fields for New User */}
//             {['username', 'email', 'phone', 'address', 'birthday', 'slogan', 'interest'].map((field) => (
//               <Form.Group key={field} controlId={`form${field.charAt(0).toUpperCase() + field.slice(1)}`}>
//                 <Form.Label>{field.charAt(0).toUpperCase() + field.slice(1)}</Form.Label>
//                 <Form.Control
//                   type={field === 'email' ? 'email' : 'text'}
//                   placeholder={`Enter ${field}`}
//                   value={newUser[field]}
//                   onChange={(e) => setNewUser({ ...newUser, [field]: e.target.value })}
//                 />
//               </Form.Group>
//             ))}
//           </Form>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setShowModal(false)}>
//             Close
//           </Button>
//           <Button variant="primary" onClick={handleAddUser}>
//             Save
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </div>
//   );
// };

// export default Usersetting;
