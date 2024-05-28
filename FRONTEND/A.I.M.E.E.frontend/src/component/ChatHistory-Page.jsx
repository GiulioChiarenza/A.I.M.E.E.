import React, { useEffect, useState } from 'react';
import { Dropdown, ListGroup, Badge, Button, Spinner, SplitButton, Modal, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FcDeleteDatabase } from 'react-icons/fc';

const ChatHistory = () => {
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showDateModal, setShowDateModal] = useState(false);
  const [showIdModal, setShowIdModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedId, setSelectedId] = useState('');

  useEffect(() => {
    fetchChatHistory();
  }, []);

  const fetchChatHistory = async () => {
    try {
      const userId = sessionStorage.getItem('userId');
      const token = sessionStorage.getItem('token');
      const url = `http://localhost:3001/chatHistory/byUser/${userId}?page=0&size=10&sortBy=id`;

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setChatHistory(data.content);
      } else {
        console.error('Error fetching chat history:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching chat history:', error);
    } finally {
      setIsLoading(false);
    }
  };



  const handleDeleteChatHistory = async (id) => {
    try {
      const token = sessionStorage.getItem('token');
      const response = await fetch(`http://localhost:3001/chatHistory/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        setChatHistory((prevChatHistory) => prevChatHistory.filter((chat) => chat.id !== id));
        console.log(`Chat history with ID ${id} deleted successfully.`);
      } else {
        console.error('Error deleting chat history:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting chat history:', error);
    }
  };



  const handleFilterSelect = (type) => {
    if (type === 'Date') {
      setShowDateModal(true);
    } else if (type === 'ID') {
      setShowIdModal(true);
    } else {
      fetchChatHistory();
    }
  };



  const handleDateSelection = async () => {
    setShowDateModal(false);
    try {
      const token = sessionStorage.getItem('token');
      const response = await fetch(`http://localhost:3001/chatHistory/byDate?interactionDate=${selectedDate}&page=0&size=10&sortBy=interactionDate`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setChatHistory(data.content);
      } else {
        console.error('Error fetching chat history by date:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching chat history by date:', error);
    }
  };



  const handleIdInput = async () => {
    setShowIdModal(false);
    try {
      const token = sessionStorage.getItem('token');
      const response = await fetch(`http://localhost:3001/chatHistory/${selectedId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setChatHistory([data]);
      } else {
        console.error('Error fetching chat history by ID:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching chat history by ID:', error);
    }
  };



  if (isLoading) {
    return <Spinner animation="border" variant="primary" />;
  }


  return (
    <div>
      <ListGroup>
        <div className="space"></div>
        {chatHistory.map((chat, index) => (
          <ListGroup.Item key={chat.id} className="d-flex justify-content-between align-items-start mt-4 chatItem">
            <div>
              {chat.id} <br />
              <Button className="deleteIcon" variant="link" onClick={() => handleDeleteChatHistory(chat.id)}>
                <FcDeleteDatabase />
              </Button>{' '}
            </div>
            <div className="ms-5 me-auto fw-bold">{chat.text}</div>
            <Badge bg="dark" pill>
              {chat.interactionDate}
            </Badge>
          </ListGroup.Item>
        ))}
      </ListGroup>
      <div className="space2"></div>
      <div className="mt-4">
        <SplitButton
          key="end"
          id="dropdown-button-drop-end"
          drop="end"
          variant="secondary"
          title="Filter by"
          style={{ color: 'white' }}
          onSelect={handleFilterSelect}
        >
          <Dropdown.Item eventKey="Date">Date</Dropdown.Item>
          <Dropdown.Item eventKey="ID">ID</Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item eventKey="">All</Dropdown.Item>
        </SplitButton>
       
      </div>

      <Modal show={showDateModal} onHide={() => setShowDateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Select Date</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="formDate">
            <Form.Label>Select a date:</Form.Label>
            <Form.Control type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleDateSelection}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showIdModal} onHide={() => setShowIdModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Enter ID</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="formId">
            <Form.Label>Enter ID:</Form.Label>
            <Form.Control
              type="number"
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
              placeholder="Enter ID"
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleIdInput}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      <Button as={Link} to="/mainSection" variant="outline-warning" className="mt-5">
        Back
      </Button>
    </div>
  );
};

export default ChatHistory;

