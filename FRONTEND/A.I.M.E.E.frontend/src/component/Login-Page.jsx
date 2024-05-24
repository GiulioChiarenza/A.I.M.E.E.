import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import { Link} from "react-router-dom";


const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);;
    const navigate = useNavigate();
  



    const handleLogin = async (event) => {
        event.preventDefault();
        setLoading(true);
        
        try {
            const response = await fetch('http://localhost:3001/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
                credentials: 'include',
            });
            if (!response.ok) {
                throw new Error('Login failed');
            }
            const data = await response.json();
            if (data.accessToken) {
            sessionStorage.setItem('token', data.accessToken);
            navigate('/mainSection')
            window.location.reload();
        } else {
            throw new Error('Token not received');
        }
        } catch (error) {
            setError('Failed to login');
        } finally {
            setLoading(false);
        }
    };


    

    return (
        <Container className="mt-5">
        <Row className="justify-content-md-center">
            <Col md={6}>
                <h2 className="text-center">Login</h2>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={handleLogin}>
                    <Form.Group controlId="formEmail" className="mb-3">
                        <Form.Label style={{ color: 'white' }}>Email</Form.Label>
                        <Form.Control 
                            type="text" 
                            placeholder="Enter email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)} 
                        />
                    </Form.Group>

                    <Form.Group controlId="formPassword" className="mb-3">
                        <Form.Label style={{ color: 'white' }}>Password</Form.Label>
                        <Form.Control 
                            type="password" 
                            placeholder="Enter password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </Form.Group>



                    <div className="d-grid gap-2">
                        <Button variant="primary" type="submit" disabled={loading}>
                            {loading ? 'Logging in...' : 'Login'}
                        </Button>
                        <Button variant="secondary" type="button"  as={Link}
                to="/register">
                            Register
                        </Button>
                    </div>
                </Form>
            </Col>
        </Row>
    </Container>
    );
}

export default LoginPage;