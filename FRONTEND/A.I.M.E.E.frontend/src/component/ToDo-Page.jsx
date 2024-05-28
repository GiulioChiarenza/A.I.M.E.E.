
import { Table, Dropdown, Button, Spinner, SplitButton, Modal, Form} from 'react-bootstrap';
import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { FcDeleteDatabase } from "react-icons/fc";
import { BsPencilSquare } from "react-icons/bs";



const ToDoPage = () => {
    
  const [toDo, setToDo] = useState([])
  const [isLoading, setIsLoading] = useState(true);
  const [showDateModal, setShowDateModal] = useState(false);
  const [showStateModal, setShowStateModal] = useState(false);
  const [showIdModal, setShowIdModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedId, setSelectedId] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
const [selectedToDoId, setSelectedToDoId] = useState(null);
const [newDescription, setNewDescription] = useState('');
const [newExpireDate, setNewExpireDate] = useState('')
 


  useEffect(() => {
    const userId = sessionStorage.getItem('userId');
        const fetchToDo = async () => {
          try {
              const token = sessionStorage.getItem('token'); 
              const response = await fetch(`http://localhost:3001/toDo/byUser/${userId}?page=0&size=10&sortBy=id`, {
                  headers: {
                      Authorization: `Bearer ${token}`
                  }
              });
              if (response.ok) {
                  const data = await response.json();
                  setToDo(data.content);
              } else {
                  console.error('Error fetching toDo:', response.statusText);
              }
          } catch (error) {
              console.error('Error fetching toDo:', error);
          } finally {
              setIsLoading(false); 
          }
      };
      fetchToDo();
  }, []);




  const handleStateChange = async (id, newState) => {
    try {
      const token = sessionStorage.getItem('token');
      const response = await fetch(`http://localhost:3001/toDo/${id}/state?newState=${newState}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        setToDo(prevToDo =>
          prevToDo.map(todo =>
            todo.id === id ? { ...todo, state: newState } : todo
          )
        );
        if (newState === 'COMPLETED') {
          window.location.reload();
        }
      } else {
        console.error('Error updating state:', response.statusText);
      }
    } catch (error) {
      console.error('Error updating state:', error);
    }
  };




  const handleFilter = async (filterKey) => {
    try {
      const token = sessionStorage.getItem('token');
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
      console.error(`Error fetching filtered toDo for ${filterKey}:`, error);
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
      const response = await fetch(`http://localhost:3001/toDo/byDate?date=${date}&page=0&size=10&sortBy=expirationDate`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setToDo(data.content);
      } else {
        console.error('Error fetching toDo by date:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching toDo by date:', error);
    }
  };
  



  const handleStateSelection = async (state) => {
    setSelectedState(state); 
    handleCloseStateModal();
    try {
      const token = sessionStorage.getItem('token');
      const response = await fetch(`http://localhost:3001/toDo/byState?state=${state}&page=0&size=10&sortBy=expirationDate`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setToDo(data.content);
      } else {
        console.error('Error fetching toDo by state:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching toDo by state:', error);
    }
  };




  const handleIdInput = async () => {
    handleCloseIdModal();
    try {
      const token = sessionStorage.getItem('token');
      const response = await fetch(`http://localhost:3001/toDo/${selectedId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setToDo([data]); 
      } else {
        console.error('Error fetching toDo by ID:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching toDo by ID:', error);
    }
  };




  const handleDeleteToDo = async (id) => {
    try {
      const token = sessionStorage.getItem('token');
      const response = await fetch(`http://localhost:3001/toDo/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.ok) {
        setToDo(prevToDo => prevToDo.filter(todo => todo.id !== id));
        console.log(`ToDo with ID ${id} deleted successfully.`);
      } else {
        console.error('Error deleting ToDo:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting ToDo:', error);
    }
  };




  const handleModToDo = (id) => {
    const selectedToDo = toDo.find(todo => todo.id === id);
    setSelectedToDoId(id);
    setNewDescription(selectedToDo.description);
    setNewExpireDate(selectedToDo.expirationDate);
    setShowEditModal(true);}
    


    const handleSaveChanges = async () => {
      try {
        const token = sessionStorage.getItem('token');
        const response = await fetch(`http://localhost:3001/toDo/${selectedToDoId}`, {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ description: newDescription, expirationDate: newExpireDate })
        });
        if (response.ok) {
          setToDo(prevToDo =>
            prevToDo.map(todo =>
              todo.id === selectedToDoId ? { ...todo, description: newDescription, expirationDate: newExpireDate} : todo
            )
          );
          setShowEditModal(false);
        } else {
          console.error('Error updating to-do:', response.statusText);
        }
      } catch (error) {
        console.error('Error updating to-do:', error);
      }
    };



  if (isLoading) {
    return  <Spinner animation="border" variant="primary" />;
}

    return (
      <div>
        <div className='space'></div>
      <Table striped bordered hover variant="dark" className='mt-4'>
        <thead>
          <tr>
            <th>ID</th>
            <th>Expiration Date</th>
            <th>Description</th>
            <th>State</th>
          </tr>
        </thead>
        <tbody>
        {toDo.map((toDo) => (
            <tr key={toDo.id}>
              <td>{toDo.id} 
              <br />
              <Button className='deleteIcon' variant="link" onClick={() => handleDeleteToDo(toDo.id)}>
        <FcDeleteDatabase />  
      </Button>
              </td>
              <td>{toDo.expirationDate}
              <br />
              <Button variant="link " onClick={() => handleModToDo(toDo.id)}>
              <BsPencilSquare style={{ color: 'gray' }} /> 
      </Button>
              </td>
              <td>{toDo.description}
              <br />
              <Button variant="link " onClick={() => handleModToDo(toDo.id)}>
              <BsPencilSquare style={{ color: 'gray' }}/>  
      </Button>
              </td>
              <td> <Dropdown >
                <Dropdown.Toggle variant="dark" id="dropdown-basic">
                  {toDo.state}
                </Dropdown.Toggle>
                <Dropdown.Menu id='stateDropdown'>
                <Dropdown.Item onClick={() => handleStateChange(toDo.id, 'COMPLETED')}>COMPLETED</Dropdown.Item>
                    <Dropdown.Item onClick={() => handleStateChange(toDo.id, 'PENDING')}>PENDING</Dropdown.Item>
                    <Dropdown.Item onClick={() => handleStateChange(toDo.id, 'INPROGRESS')}>INPROGRESS</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown></td>
            </tr>
          ))}
        </tbody>
      </Table>




      <Modal show={showDateModal} onHide={handleCloseDateModal}>
        <Modal.Header   closeButton>
          <Modal.Title  >Select Date</Modal.Title>
        </Modal.Header>
        <Modal.Body  >
        <Form.Group controlId="formDate">
          <Form.Label>Select a date:</Form.Label>
          <Form.Control type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
        </Form.Group>
        </Modal.Body>
        <Modal.Footer>
         
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
        <option >Seleziona uno stato</option>
        <option value="PENDING">PENDING</option>
        <option value="INPROGRESS">INPROGRESS</option>
      </Form.Select>
    </Form.Group>
        </Modal.Body>
        <Modal.Footer>
      
          <Button 
      variant="primary" 
      onClick={() => {
        if(selectedState && selectedState !== "Seleziona uno stato") {
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
         
          <Button variant="primary" onClick={handleIdInput}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>



      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit To-Do</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="formDescription">
            <Form.Label>Description</Form.Label>
            <Form.Control
              type="text"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="formExpireDate">
            <Form.Label>ExpirationDate</Form.Label>
            <Form.Control
              type="text"
              value={newExpireDate}
              onChange={(e) => setNewExpireDate(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          
          <Button variant="primary" onClick={handleSaveChanges}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      <div className='space2'></div>

      <div className="mt-4">
        {['end'].map((direction) => (
          <SplitButton
            key={direction}
            id={`dropdown-button-drop-${direction}`}
            drop={direction}
            variant="secondary"
            title={`filter by`}
            style={{ color: 'white' }} 
          >
            
            <Dropdown.Item eventKey="Date" onClick={() => handleFilter('Date')}>Date</Dropdown.Item>
            <Dropdown.Item eventKey="State" onClick={() => handleFilter('State')}>State</Dropdown.Item>
            <Dropdown.Item eventKey="ID" onClick={() => handleFilter('ID')}>ID</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item eventKey="All" onClick={() => handleFilter('All')}>All</Dropdown.Item>
          </SplitButton>
        ))}
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
    )
}
export default ToDoPage;