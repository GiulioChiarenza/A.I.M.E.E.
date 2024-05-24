import { Table, Button, Spinner, SplitButton, Dropdown, Modal, Form } from 'react-bootstrap';
import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { FcDeleteDatabase } from "react-icons/fc";

const DonePage = () => {
  const [done, setDone] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showDateModal, setShowDateModal] = useState(false);
  const [showStateModal, setShowStateModal] = useState(false);
  const [showIdModal, setShowIdModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedId, setSelectedId] = useState('');

  useEffect(() => {
    const fetchDone = async () => {
      try {
        const token = sessionStorage.getItem('token');
        const response = await fetch('http://localhost:3001/done?page=0&size=500&sortBy=state', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setDone(data.content);
        } else {
          console.error('Error fetching done:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching done:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDone();
  }, []);




  const handleFilter = async (filterKey) => {
    try {
      switch (filterKey) {
        case "Date":
          setShowDateModal(true);
          break;
        case "State":
          setShowStateModal(true);
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
    } catch (error) {
      console.error(`Error fetching filtered done for ${filterKey}:`, error);
    }
  };




  const handleCloseDateModal = () => setShowDateModal(false);
  const handleCloseStateModal = () => setShowStateModal(false);
  const handleCloseIdModal = () => setShowIdModal(false);

  const handleDateSelection = async (date) => {
    setSelectedDate(date);
    handleCloseDateModal();
    try {
      const token = sessionStorage.getItem('token');
      const response = await fetch(`http://localhost:3001/done/byDate?date=${date}&page=0&size=5&sortBy=id`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setDone(data.content);
      } else {
        console.error('Error fetching done by date:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching done by date:', error);
    }
  };




  const handleStateSelection = async (state) => {
    setSelectedState(state);
    handleCloseStateModal();
    try {
      const token = sessionStorage.getItem('token');
      const response = await fetch(`http://localhost:3001/done/byState?state=${state}&page=0&size=10&sortBy=completionDate`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setDone(data.content);
      } else {
        console.error('Error fetching done by state:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching done by state:', error);
    }
  };




  const handleIdInput = async () => {
    handleCloseIdModal();
    try {
      const token = sessionStorage.getItem('token');
      const response = await fetch(`http://localhost:3001/done/${selectedId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setDone([data]);
      } else {
        console.error('Error fetching done by ID:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching done by ID:', error);
    }
  };




  const handleDeleteDone = async (id) => {
    try {
      const token = sessionStorage.getItem('token');
      const response = await fetch(`http://localhost:3001/done/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.ok) {
        setDone(prevDone => prevDone.filter(done => done.id !== id));
        console.log(`Done with ID ${id} deleted successfully.`);
      } else {
        console.error('Error deleting done:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting done:', error);
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
            <th>Completed/Expired Date</th>
            <th>Description</th>
            <th>State</th>
          </tr>
        </thead>
        <tbody>
          {done.map((done) => (
            <tr key={done.id}>
              <td>{done.id}
                <br />
                <Button variant="link" onClick={() => handleDeleteDone(done.id)}>
                  <FcDeleteDatabase />
                </Button>
              </td>
              <td>{done.completionDate}</td>
              <td>{done.description}</td>
              <td>{done.state}</td>
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



      <Modal show={showStateModal} onHide={handleCloseStateModal}>
        <Modal.Header closeButton>
          <Modal.Title>Select State</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="formState">
            <Form.Label>Select a state:</Form.Label>
            <Form.Select value={selectedState} onChange={(e) => setSelectedState(e.target.value)}>
              <option>Select a state</option>
              <option value="COMPLETED">COMPLETED</option>
              <option value="EXPIRED">EXPIRED</option>
            </Form.Select>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseStateModal}>
            Close
          </Button>
          <Button 
      variant="primary" 
      onClick={() => {
        if(selectedState && selectedState !== "Select a state") {
          handleStateSelection(selectedState);
        } else {
          console.log("Please select a state");
        }
      }}
    >
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




      <div className="mt-4">
        <SplitButton
          key="end"
          id="dropdown-button-drop-end"
          drop="end"
          variant="secondary"
          title="Filter by"
          style={{ color: 'white' }}
        >
          <Dropdown.Item eventKey="Date" onClick={() => handleFilter('Date')}>Date</Dropdown.Item>
          <Dropdown.Item eventKey="State" onClick={() => handleFilter('State')}>State</Dropdown.Item>
          <Dropdown.Item eventKey="ID" onClick={() => handleFilter('ID')}>ID</Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item eventKey="All" onClick={() => handleFilter('All')}>All</Dropdown.Item>
        </SplitButton>
      </div>




      <Button
        as={Link}
        to="/mainSection"
        variant="outline-warning"
        className="mt-4"
        style={{ color: 'white' }}
      >
        Back
      </Button>
    </div>
  );
};

export default DonePage;