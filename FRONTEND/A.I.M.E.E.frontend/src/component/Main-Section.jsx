import React, { useState, useEffect } from 'react';
import { Form, Button, Dropdown } from 'react-bootstrap';
import { IoSend } from "react-icons/io5";

const MainSection = () => {
  const [chatMessages, setChatMessages] = useState([]);
  const [selectedOption, setSelectedOption] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    
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
      { text: option, sender: 'user', timestamp: new Date().toISOString() } 
    ]);
  
    setChatMessages(prevMessages => [
      ...prevMessages,
      { text: 'Certainly!', sender: 'bot', timestamp: new Date().toISOString() }
    ]);
    
    setTimeout(() => setShowForm(true), 1000);
  };





  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    
    try {
      let response;
      if (selectedOption === 'Add an appointment') {
        const token = sessionStorage.getItem('token');
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
        const token = sessionStorage.getItem('token');
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
        <div className="chat-container" >
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
                    <Form.Label style={{  color: 'white'}}>Description</Form.Label>
                    <Form.Control type="text" name="description" onChange={handleFormChange} required />
                  </Form.Group>
                  <Form.Group controlId="formExpirationDate">
                    <Form.Label style={{  color: 'white'}}>Expiration Date</Form.Label>
                    <Form.Control type="date" name="expirationDate" onChange={handleFormChange} required />
                  </Form.Group>
                </div>
              )}



              {selectedOption === 'Add an appointment' && (
                <div>
                  <Form.Group controlId="formTitle">
                    <Form.Label>Title</Form.Label>
                    <Form.Control type="text" name="title" onChange={handleFormChange} required />
                  </Form.Group>
                  <Form.Group controlId="formDescription">
                    <Form.Label>Description</Form.Label>
                    <Form.Control type="text" name="description" onChange={handleFormChange} required />
                  </Form.Group>
                  <Form.Group controlId="formDate">
                    <Form.Label>Date</Form.Label>
                    <Form.Control type="date" name="date" onChange={handleFormChange} required />
                  </Form.Group>
                  <Form.Group controlId="formPlace">
                    <Form.Label>Place</Form.Label>
                    <Form.Control type="text" name="place" onChange={handleFormChange} required />
                  </Form.Group>
                </div>
              )}


              <Button variant="primary" type="submit" className='mt-5' style={{backgroundColor: " #2a2a2afd", border: "#2a2a2afd", borderRadius:"15px"}}>
              <IoSend />
              </Button>
            </Form>
          )}



          {!showForm && (
            <Dropdown>
              <Dropdown.Toggle variant="dark" id="dropdown-basic" className='mt-5'>
                Select an option
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => handleOptionSelect('Add a to-do')}>Add a to-do</Dropdown.Item>
                <Dropdown.Item onClick={() => handleOptionSelect('Add an appointment')}>Add an appointment</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          )}


          
        </div>
      </main>
    </div>
  );
};

export default MainSection;




