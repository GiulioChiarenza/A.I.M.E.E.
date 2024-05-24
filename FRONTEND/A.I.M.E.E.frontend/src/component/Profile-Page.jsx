
import { Container, Row, Col, Card, ListGroup, Button, Image, Spinner, Modal, Form } from 'react-bootstrap';
import { Link, useNavigate} from "react-router-dom";
import React, { useEffect, useState } from "react";
import { BiShow, BiHide } from "react-icons/bi";




const ProfilePage= () => {
 
  const [profile, setProfile] = useState({ id: "", email: "", username: "", name: "", surname: "", avatar: "" })
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [updatedProfile, setUpdatedProfile] = useState({ ...profile });
  const [showPassword, setShowPassword] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const navigate= useNavigate()



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
          } finally {
              setIsLoading(false); 
          }
      };
      fetchProfile();
  }, []);




  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);
  const handleShowAvatarModal = () => setShowAvatarModal(true);
  const handleCloseAvatarModal = () => setShowAvatarModal(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedProfile({ ...updatedProfile, [name]: value });
  };
  const handleFileChange = (e) => {
    setAvatarFile(e.target.files[0]);
  };



  const handleSaveChanges = async () => {
    try {
      const token = sessionStorage.getItem('token');
      const response = await fetch(`http://localhost:3001/users/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(updatedProfile)
      });
      if (response.ok) {
        const data = await response.json();
        setProfile(data);
        handleCloseModal();
      } else {
        console.error('Error updating profile:', response.statusText);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };




const handleAvatarUpload = async () => {
  if (!avatarFile) return;
  const formData = new FormData();
  formData.append('avatar', avatarFile);
  try {
    const token = sessionStorage.getItem('token');
    const response = await fetch('http://localhost:3001/users/me/upload', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData
    });
    if (response.ok) {
      const data = await response.json();
      setProfile({ ...profile, avatar: data.avatar });
      handleCloseAvatarModal();
    } else {
      console.error('Error uploading avatar:', response.statusText);
    }
  } catch (error) {
    console.error('Error uploading avatar:', error);
  }
};



const handleBack = () => {
  navigate('/mainSection', { replace: true });
  window.location.reload();
};



const handleDelete = async () => {
  try {
    const token = sessionStorage.getItem('token');
    const response = await fetch('http://localhost:3001/users/me', {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    if (response.ok) {
      console.log('Profilo eliminato con successo.');
      
    } else {
      console.error('Errore durante l\'eliminazione del profilo:', response.statusText);
    }
  } catch (error) {
    console.error('Errore durante l\'eliminazione del profilo:', error);
  }
};



if (isLoading) {
  return  <Spinner animation="border" variant="primary" />;
}

    return (

<Container>
<div className='space'></div>
<Row className="mt-4">
  <Col xs={12} md={4}>
    <Image src={profile.avatar} roundedCircle style={{ width: '200px', height: '200px'}} className='my-4'/>
    <Button variant="link" onClick={handleShowAvatarModal}>Edit Avatar</Button>
  </Col>
  <Col xs={12} md={8}>
    <Card>
      <Card.Header className='text-start'>ID user ({profile.id})</Card.Header>
      <Card.Body className='text-start'>
        <Card.Title>{profile.name} {profile.surname}</Card.Title>
        <ListGroup variant="flush">
          <ListGroup.Item>{profile.username}</ListGroup.Item>
          <ListGroup.Item>{profile.email}</ListGroup.Item>
          <ListGroup.Item></ListGroup.Item>
        </ListGroup>
        <div className="d-flex justify-content-between m-3">
          <Button variant="primary" onClick={handleShowModal}>Edit</Button>
          <Link to="/logout">
          <Button variant="danger" onClick={handleDelete}>Delete User</Button>
          </Link>
        </div>
      </Card.Body>
    </Card>
  </Col>
</Row>



<Button
      variant="outline-warning"
      className="mt-5"
      onClick={handleBack}
    >
      Back
    </Button>



    <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Modifica Profilo</Modal.Title>
        </Modal.Header>
        <Modal.Body>

          <Form>
            <Form.Group controlId="formUsername">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                name="username"
                value={updatedProfile.username}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={updatedProfile.email}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formPassword">
              <Form.Label>password</Form.Label>
              <Form.Control
                type={showPassword ? "text" : "password"}
                name="password"
                value={updatedProfile.password || ''}
                onChange={handleInputChange}
              />
               <Button
                                    variant="outline-secondary"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <BiShow /> : <BiHide />}
                                </Button>
            </Form.Group>
            <Form.Group controlId="formName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={updatedProfile.name}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formSurname">
              <Form.Label>Surname</Form.Label>
              <Form.Control
                type="text"
                name="surname"
                value={updatedProfile.surname}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSaveChanges}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>



      <Modal show={showAvatarModal} onHide={handleCloseAvatarModal}>
        <Modal.Header closeButton>
          <Modal.Title>Modifica Avatar</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formAvatar">
              <Form.Label>Upload Avatar</Form.Label>
              <Form.Control
                type="file"
                name="avatar"
                onChange={handleFileChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseAvatarModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleAvatarUpload}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
</Container>

    )
}
export default ProfilePage;