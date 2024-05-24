
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useState } from "react";
import { Navbar, Nav, Container, NavDropdown, Image, Spinner, Dropdown} from 'react-bootstrap'
import { Link } from "react-router-dom";
import { FiRefreshCw} from 'react-icons/fi';


const NavBar = () => {
    const [profile, setProfile] = useState({ name: "", avatar: "" })
    const [isLoading, setIsLoading] = useState(true);
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
                        name: data.name,
                        avatar: data.avatar
                    });
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




    const handleLogout = () => {
        sessionStorage.removeItem('token');
        navigate('/logout');
    };

    const handleRefresh = () => {
        window.location.reload();
    };

    if (isLoading) {
        return  <Spinner animation="border" variant="primary" />;
    }
    if (location.pathname === '/logout') {
        return null; 
    }

    return(

        <Navbar  variant="dark" expand="lg">
        <Container fluid>
        <Image src="https://thumbs.dreamstime.com/b/simbolo-dell-icona-del-vettore-chip-processore-ai-per-l-intelligenza-artificiale-la-progettazione-grafica-il-logo-sito-web-i-158205566.jpg" roundedCircle width="40" height="40" className='mx-3'/>
        <Dropdown>
                    <Dropdown.Toggle variant="light" id="dropdown-basic" style={{  color: 'white',padding: 0, background: 'transparent', border: 'none', marginTop: "3px"}}>
                        A.I.M.E.E.
                    </Dropdown.Toggle>

                    <Dropdown.Menu align="end" className='mt-2' style={{ backgroundColor: '#2a2a2a00',  borderColor: 'black' }} >
                    <NavDropdown.Item as={Link} to="/todo-list"  className="no-hover">ToDo List</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/appointment-list"  className="no-hover">Appointment List</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/done-list"  className="no-hover">Done List</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item as={Link} to="/chat-history"  className="no-hover">Chat History</NavDropdown.Item>
                        
                    </Dropdown.Menu>
                </Dropdown>



            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto">
                </Nav>
                <Nav>
                    <Nav.Link href="#" className='mt-1 me-3'onClick={handleRefresh} ><FiRefreshCw /></Nav.Link>
                    <Dropdown>
                    <Dropdown.Toggle  id="dropdown-basic" style={{ padding: 0, background: 'transparent', border: 'none', marginTop: "3px"}}>
                        <Image src={profile.avatar} roundedCircle width="40" height="40" />
                    </Dropdown.Toggle>

                    <Dropdown.Menu align="end"  style={{ backgroundColor: '#2a2a2a00',  borderColor: 'black' }} >
                        <Dropdown.Item as={Link} to="/profile" className="no-hover"  >Profile</Dropdown.Item>
                        <Dropdown.Divider style={{ borderColor: 'gray' }}/>
                        <Dropdown.Item as={Link} to="/logout" className="no-hover"  onClick={handleLogout}>Logout</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
                    
                </Nav>
            </Navbar.Collapse>
        </Container>
    </Navbar>



    )
}
export default NavBar