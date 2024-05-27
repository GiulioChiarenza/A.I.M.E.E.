import {  Table, Button, Spinner, SplitButton, Dropdown, Modal, Form } from 'react-bootstrap';
import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { FcDeleteDatabase } from "react-icons/fc";
import { BsPencilSquare } from "react-icons/bs";



const AppointmentPage = () => {
  const [appointment, setAppointment] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showDateModal, setShowDateModal] = useState(false);
  const [showTitleModal, setShowTitleModal] = useState(false);
  const [showPlaceModal, setShowPlaceModal] = useState(false);
  const [showIdModal, setShowIdModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTitle, setSelectedTitle] = useState('');
  const [selectedPlace, setSelectedPlace] = useState('');
  const [selectedId, setSelectedId] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
  const [newDescription, setNewDescription] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newPlace, setNewPlace] = useState('');
  const [newTitle, setNewTitle] = useState('');




  useEffect(() => {
    const userId = sessionStorage.getItem('userId');
    const fetchAppointment = async () => {
      try {
        const token = sessionStorage.getItem('token');
        const response = await fetch(`http://localhost:3001/appointment/byUser/${userId}?page=0&size=10&sortBy=id`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setAppointment(data.content);
        } else {
          console.error('Error fetching appointment:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching appointment:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAppointment();
  }, []);





  const handleFilter = (filterKey) => {
    switch (filterKey) {
      case "Date":
        setShowDateModal(true);
        break;
      case "Title":
        setShowTitleModal(true);
        break;
      case "Place":
        setShowPlaceModal(true);
        break;
      case "ID":
        setShowIdModal(true);
        break;
      case "All":
        window.location.reload();
        break;
      default:
        return;
    }
  };
  const handleCloseTitleModal = () => setShowTitleModal(false);
  const handleCloseDateModal = () => setShowDateModal(false);
  const handleClosePlaceModal = () => setShowPlaceModal(false);
  const handleCloseIdModal = () => setShowIdModal(false);



  const handleDateSelection = async (date) => {
    setSelectedDate(date);
    handleCloseDateModal();
    try {
      const token = sessionStorage.getItem('token');
      const response = await fetch(`http://localhost:3001/appointment/byDate?date=${date}&page=0&size=10&sortBy=title`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setAppointment(data.content);
      } else {
        console.error('Error fetching Appointment by date:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching Appointment by date:', error);
    }
  };




  const handleTitleSelection = async (title) => {
    setSelectedTitle(title);
    handleCloseTitleModal();
    try {
      const token = sessionStorage.getItem('token');
      const response = await fetch(`http://localhost:3001/appointment/byTitle?title=${title}&page=0&size=10&sortBy=date`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setAppointment(data.content);
      } else {
        console.error('Error fetching Appointment by title:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching Appointment by title:', error);
    }
  };




  const handlePlaceSelection = async (place) => {
    setSelectedPlace(place);
    handleClosePlaceModal();
    try {
      const token = sessionStorage.getItem('token');
      const response = await fetch(`http://localhost:3001/appointment/byPlace?place=${place}&page=0&size=10&sortBy=date`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setAppointment(data.content);
      } else {
        console.error('Error fetching Appointment by place:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching Appointment by place:', error);
    }
  };




  const handleIdInput = async () => {
    handleCloseIdModal();
    try {
      const token = sessionStorage.getItem('token');
      const response = await fetch(`http://localhost:3001/appointment/${selectedId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setAppointment([data]);
      } else {
        console.error('Error fetching appointment by ID:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching appointment by ID:', error);
    }
  };




  const handleModAppointment = (id) => {
    const selectedAppointment = appointment.find(appointment => appointment.id === id);
    setSelectedAppointmentId(id);
    setNewPlace(selectedAppointment.place);
    setNewTitle(selectedAppointment.title);
    setNewDescription(selectedAppointment.description);
    setNewDate(selectedAppointment.date);
    setShowEditModal(true);
  };




  const handleSaveChanges = async () => {
    try {
      const token = sessionStorage.getItem('token');
      const response = await fetch(`http://localhost:3001/appointment/${selectedAppointmentId}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title: newTitle, date: newDate, place: newPlace, description: newDescription })
      });
      if (response.ok) {
        setAppointment(prevAppointment =>
          prevAppointment.map(appointment =>
            appointment.id === selectedAppointmentId ? { ...appointment, title: newTitle, date: newDate, place: newPlace, description: newDescription } : appointment
          )
        );
        setShowEditModal(false);
      } else {
        console.error('Error updating appointment:', response.statusText);
      }
    } catch (error) {
      console.error('Error updating appointment:', error);
    }
  };




  const handleDeleteAppointment = async (id) => {
    try {
      const token = sessionStorage.getItem('token');
      const response = await fetch(`http://localhost:3001/appointment/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.ok) {
        setAppointment(prevAppointment => prevAppointment.filter(appointment => appointment.id !== id));
        console.log(`Appointment with ID ${id} deleted successfully.`);
      } else {
        console.error('Error deleting Appointment:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting Appointment:', error);
    }
  };

  if (isLoading) {
    return <Spinner animation="border" variant="primary" />;
  }




  return (
    <div>
      <div className='space'></div>
      <Table striped bordered hover variant="dark" className='mt-4'>
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Date</th>
            <th>Place</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {appointment.map((appointment) => (
            <tr key={appointment.id} onClick={() => handleModAppointment(appointment.id)} style={{ cursor: 'pointer' }}>
              <td>{appointment.id}
              <br />
              <Button className='deleteIcon' variant="link" onClick={() => handleDeleteAppointment(appointment.id)}>
        <FcDeleteDatabase />  
      </Button>
              </td>
              <td>{appointment.title}
              <br />
              <Button variant="link " onClick={() => handleModAppointment(appointment.id)}>
              <BsPencilSquare style={{ color: 'gray' }} /> 
      </Button>
              </td>
              <td>{appointment.date}
              <br />
              <Button variant="link " onClick={() => handleModAppointment(appointment.id)}>
              <BsPencilSquare style={{ color: 'gray' }} /> 
      </Button>
              </td>
              <td>{appointment.place}
              <br />
              <Button variant="link " onClick={() => handleModAppointment(appointment.id)}>
              <BsPencilSquare style={{ color: 'gray' }} /> 
      </Button>
              </td>
              <td>{appointment.description}
              <br />
              <Button variant="link " onClick={() => handleModAppointment(appointment.id)}>
              <BsPencilSquare style={{ color: 'gray' }} /> 
      </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showDateModal} onHide={handleCloseDateModal}>
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
          <Button variant="secondary" onClick={handleCloseDateModal}>
            Close
          </Button>
          <Button variant="primary" onClick={() => handleDateSelection(selectedDate)}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showTitleModal} onHide={handleCloseTitleModal}>
        <Modal.Header closeButton>
          <Modal.Title>Select Title</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="formTitle">
            <Form.Label>Select a title:</Form.Label>
            <Form.Control type="text" value={selectedTitle} onChange={(e) => setSelectedTitle(e.target.value)} />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseTitleModal}>
            Close
          </Button>
          <Button variant="primary" onClick={() => handleTitleSelection(selectedTitle)}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showPlaceModal} onHide={handleClosePlaceModal}>
        <Modal.Header closeButton>
          <Modal.Title>Select Place</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="formPlace">
            <Form.Label>Select a place:</Form.Label>
            <Form.Control type="text" value={selectedPlace} onChange={(e) => setSelectedPlace(e.target.value)} />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClosePlaceModal}>
            Close
          </Button>
          <Button variant="primary" onClick={() => handlePlaceSelection(selectedPlace)}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showIdModal} onHide={handleCloseIdModal}>
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
          <Button variant="secondary" onClick={handleCloseIdModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleIdInput}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Appointment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="formTitle">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="formDate">
            <Form.Label>Date</Form.Label>
            <Form.Control
              type="text"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="formPlace">
            <Form.Label>Place</Form.Label>
            <Form.Control
              type="text"
              value={newPlace}
              onChange={(e) => setNewPlace(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="formDescription">
            <Form.Label>Description</Form.Label>
            <Form.Control
              type="text"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSaveChanges}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      <div className='space2'></div>
      <div className="mt-4">
        <SplitButton
          key="end"
          id="dropdown-button-drop-end"
          drop="end"
          variant="secondary"
          title="Filter by"
          onSelect={handleFilter}
          style={{ color: 'white' }}
        >
          <Dropdown.Item eventKey="Date">Date</Dropdown.Item>
          <Dropdown.Item eventKey="Title">Title</Dropdown.Item>
          <Dropdown.Item eventKey="Place">Place</Dropdown.Item>
          <Dropdown.Item eventKey="ID">ID</Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item eventKey="All">All</Dropdown.Item>
        </SplitButton>
      </div>

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

export default AppointmentPage;
