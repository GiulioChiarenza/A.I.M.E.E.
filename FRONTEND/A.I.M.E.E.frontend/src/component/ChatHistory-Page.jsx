
import {  Dropdown, ListGroup, Badge, Button, Spinner, SplitButton} from 'react-bootstrap';
import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { FcDeleteDatabase } from "react-icons/fc";

const ChatHistory= () => {
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    const userId = sessionStorage.getItem('userId');
    const fetchChatHistory = async () => {
      try {
        const token = sessionStorage.getItem('token');
        
        const response = await fetch(`http://localhost:3001/chatHistory/byUser/${userId}?page=0&size=10&sortBy=id`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setChatHistory(data.content);
        } else {
          console.error('Error fetching chatHistory:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching chatHistory:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchChatHistory();
  }, []);
  



  const handleDeleteChatHistory = async (id) => {
    try {
      const token = sessionStorage.getItem('token');
      const response = await fetch(`http://localhost:3001/chatHistory/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.ok) {
        setChatHistory(prevChatHistory => prevChatHistory.filter(chatHistory => chatHistory.id !== id));
        console.log(`ChatHistory with ID ${id} deleted successfully.`);
      } else {
        console.error('Error deleting ChatHistory:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting ChatHistory:', error);
    }
  };



  if (isLoading) {
    return <Spinner animation="border" variant="primary" />;
  }
    
    return (
      <div>
      <ListGroup>
        <div className='space'></div>
      {chatHistory.map((chatHistory, index) => (
      <ListGroup.Item
          key={chatHistory.id}
          className="d-flex justify-content-between align-items-start mt-4"
        >
          <div>{chatHistory.id} <br /><Button variant="link" onClick={() => handleDeleteChatHistory(chatHistory.id)} >
        <FcDeleteDatabase />  
      </Button> </div>
          <div className="ms-5 me-auto fw-bold">
            {chatHistory.text}
          </div>
          <Badge bg="dark" pill>
            {chatHistory.interactionDate}
          </Badge>
        </ListGroup.Item>
      ))}


      
         <div className="mt-4">
        <SplitButton
          key="end"
          id="dropdown-button-drop-end"
          drop="end"
          variant="secondary"
          title="Filter by"
          // onSelect={}
          style={{ color: 'white' }}
        >
          <Dropdown.Item eventKey="">Date</Dropdown.Item>
          <Dropdown.Item eventKey="">ID</Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item eventKey="">All</Dropdown.Item>
        </SplitButton>
      </div>


     
    </ListGroup>
    <Button
        as={Link}
        to="/mainSection"
        variant="outline-warning"
        className="mt-5"
      >
        Back
      </Button>
    </div>
  );
};
export default ChatHistory;