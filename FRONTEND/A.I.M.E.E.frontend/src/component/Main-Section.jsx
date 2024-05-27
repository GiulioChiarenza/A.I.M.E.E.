import React, { useState, useEffect } from 'react';
import { Form, Button, Dropdown, DropdownButton, ButtonGroup } from 'react-bootstrap';
import { IoSend } from "react-icons/io5";

const MainSection = () => {
  const [profile, setProfile] = useState({ id: "", email: "", username: "", name: "", surname: "", avatar: "" });
  const [chatMessages, setChatMessages] = useState([]);
  const [selectedOption, setSelectedOption] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = sessionStorage.getItem('token');
        const response = await fetch('http://localhost:3001/users/me', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setProfile({
            id: data.id,
            email: data.email,
            username: data.username,
            name: data.name,
            surname: data.surname,
            avatar: data.avatar
          });
          sessionStorage.setItem('userId', data.id);
        } else {
          console.error('Error fetching profile:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };
    fetchProfile();



    const initialBotMessage = {
      text: 'Hello, I am Aimee! How can I assist you?',
      sender: 'bot',
      timestamp: new Date().toISOString()
    };
    setChatMessages([initialBotMessage]);
  }, []);

  const handleOptionSelect = (option) => {
    console.log('Option selected:', option);
    setSelectedOption(option);

    setChatMessages(prevMessages => [
      ...prevMessages,
      { text: option, sender: 'user', timestamp: new Date().toISOString() },
      { text: 'Certainly!', sender: 'bot', timestamp: new Date().toISOString() }
    ]);

    setTimeout(() => setShowForm(true), 400);
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    
    try {
      let response;
      const token = sessionStorage.getItem('token');
      if (selectedOption === 'Add an appointment') {
        response = await fetch('http://localhost:3001/appointment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(formData)
        });
        setChatMessages(prevMessages => [...prevMessages, { text: 'Appointment added to list successfully!', sender: 'bot', timestamp: new Date().toISOString() }]);
      } else if (selectedOption === 'Add a to-do') {
        response = await fetch('http://localhost:3001/toDo', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(formData)
        });
        setChatMessages(prevMessages => [...prevMessages, { text: 'ToDo added to list successfully!', sender: 'bot', timestamp: new Date().toISOString() }]);
      }

      setChatMessages(prevMessages => [...prevMessages, { text: 'How can I assist you now?', sender: 'bot', timestamp: new Date().toISOString() }]);
      setShowForm(false);
    } catch (error) {
      console.error('Error while sending data:', error.message);
    }
  };

  return (
    <div>
      <div className='space'></div>
      <main className="container mt-4">
        <div className="chat-container">
          {chatMessages.map((chatMessage, index) => (
            <div key={index} className={`chat-message ${chatMessage.sender}`}>
              <div className="message-content">
                <p>{chatMessage.text}</p>
              </div>
              <div className="message-timestamp mx-2">{new Date(chatMessage.timestamp).toLocaleTimeString()}</div>
            </div>
          ))}

          {showForm && (
            <Form onSubmit={handleFormSubmit}>
              {selectedOption === 'Add a to-do' && (
                <div>
                  <Form.Group controlId="formDescription">
                    <Form.Label style={{ color: 'white' }}>Description</Form.Label>
                    <Form.Control style={{ backgroundColor: '#2a2a2afd', color: 'white' }} type="text" name="description" onChange={handleFormChange} required />
                  </Form.Group>
                  <Form.Group controlId="formExpirationDate">
                    <Form.Label style={{ color: 'white' }}>Expiration Date</Form.Label>
                    <Form.Control style={{ backgroundColor: '#2a2a2afd', color: 'white' }} type="date" name="expirationDate" onChange={handleFormChange} required />
                  </Form.Group>
                </div>
              )}

              {selectedOption === 'Add an appointment' && (
                <div>
                  <Form.Group controlId="formTitle">
                    <Form.Label style={{ color: 'white' }}>Title</Form.Label>
                    <Form.Control style={{ backgroundColor: '#2a2a2afd', color: 'white' }} type="text" name="title" onChange={handleFormChange} required />
                  </Form.Group>
                  <Form.Group controlId="formDescription">
                    <Form.Label style={{ color: 'white' }}>Description</Form.Label>
                    <Form.Control style={{ backgroundColor: '#2a2a2afd', color: 'white' }} type="text" name="description" onChange={handleFormChange} required />
                  </Form.Group>
                  <Form.Group controlId="formDate">
                    <Form.Label style={{ color: 'white' }}>Date</Form.Label>
                    <Form.Control style={{ backgroundColor: '#2a2a2afd', color: 'white' }} type="date" name="date" onChange={handleFormChange} required />
                  </Form.Group>
                  <Form.Group controlId="formPlace">
                    <Form.Label style={{ color: 'white' }}>Place</Form.Label>
                    <Form.Control style={{ backgroundColor: '#2a2a2afd', color: 'white' }} type="text" name="place" onChange={handleFormChange} required />
                  </Form.Group>
                </div>
              )}

              <Button variant="primary" type="submit" className='mt-5' style={{ backgroundColor: "#2a2a2afd", border: "#2a2a2afd", borderRadius: "15px" }}>
                <IoSend />
              </Button>
            </Form>
          )}

       
        </div>
        {!showForm && (
            <Dropdown drop="down">
              <Dropdown.Toggle style={{ color: 'white', background: 'transparent' }}   variant="dark" id="dropdown-basic" className='mt-5 '>
                Select an option
              </Dropdown.Toggle>
              <Dropdown.Menu className='myDropDown'>
                <Dropdown.Item className="no-hover"  onClick={() => handleOptionSelect('Add a to-do')}>Add a to-do</Dropdown.Item>
                <Dropdown.Item className="no-hover" onClick={() => handleOptionSelect('Add an appointment')}>Add an appointment</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          )}
      </main>
    </div>
  );
};

export default MainSection;
