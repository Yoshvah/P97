import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Card, Col, Row, Spinner } from 'react-bootstrap';
import '../Style/Mook.css';

const MookList = ({ fetchMooks }) => {
  const [mooks, setMooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchMooksData = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:8000/api/mooks', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMooks(response.data.filter(mook => !mook.isPrivate)); // Filter out private mooks
      } catch (error) {
        console.error('Error fetching mooks:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMooksData();
  }, [token]);

  const handleDeleteMook = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:8000/api/mooks/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status === 200) {
        setMooks(mooks.filter(mook => mook.id !== id));
        fetchMooks(); // Refresh the mook list
      }
    } catch (error) {
      console.error('Error deleting mook:', error);
    }
  };

  return (
    <div className="mook-list-container">
      {loading && <Spinner animation="border" role="status"><span className="visually-hidden">Loading...</span></Spinner>}
      {!loading && mooks.length > 0 && (
        <Row className="mt-4 mook-cards">
          {mooks.map((mookItem) => (
            <Col key={mookItem.id} md={4} className="mb-4">
              <Card className="mook-card">
                <Card.Img
                  variant="top"
                  src="https://img.freepik.com/free-photo/nature-design-with-bokeh-effect_1048-1882.jpg"
                  alt="mook"
                />
                <Card.Body>
                  <Card.Title>{mookItem.title}</Card.Title>
                  <Card.Text
                    dangerouslySetInnerHTML={{
                      __html: mookItem.contentData ? mookItem.contentData : 'No description available',
                    }}
                  />
                  <p><strong>Created At:</strong> {mookItem.createdAt}</p>
                  <p><strong>Updated At:</strong> {mookItem.updatedAt || 'N/A'}</p>
                  <p><strong>Creator ID:</strong> {mookItem.creatorId}</p>
                  <Button variant="primary" onClick={() => handleDeleteMook(mookItem.id)}>
                    Delete
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default MookList;
