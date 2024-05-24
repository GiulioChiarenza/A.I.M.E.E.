
import { Form, Button, Container, Row, Col, Alert, InputGroup } from 'react-bootstrap';
import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import { BiShow, BiHide } from "react-icons/bi";



const RegisterPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();




    const handleRegister = async (event) => {
        event.preventDefault();
        setLoading(true);
        try {
            const response = await fetch('http://localhost:3001/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, email, password, name, surname }),
                credentials: 'include',
            });
            if (!response.ok) {
                throw new Error('Register failed');
            }
            setSuccess(true);
            setTimeout(() => {
                navigate('/logout');
            }, 1000);
        } catch (error) {
            setError('Failed to register');
        } finally {
            setLoading(false);
        }
    };



    return (
        <Container className="mt-5">
        <Row className="justify-content-md-center">
            <Col md={6}>
                <h2 className="text-center">Register</h2>
                {error && <Alert variant="danger">{error}</Alert>}
                {success && <Alert variant="success">Registration successful! Redirecting to login...</Alert>}
                <Form onSubmit={handleRegister}>
                    <Form.Group controlId="formUsername" className="mb-3">
                        <Form.Label style={{ color: 'white' }}>Username</Form.Label>
                        <Form.Control 
                            type="text" 
                            placeholder="Enter username" 
                            value={username}
                            onChange={(e) => setUsername(e.target.value)} 
                        />
                    </Form.Group>
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
                        <InputGroup>
                                <Form.Control 
                                    type={showPassword ? "text" : "password"} 
                                    placeholder="Enter password" 
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)} 
                                />
                                <Button
                                    variant="outline-secondary"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <BiShow /> : <BiHide />}
                                </Button>
                            </InputGroup>
                    </Form.Group>
                    <Form.Group controlId="formName" className="mb-3">
                        <Form.Label style={{ color: 'white' }}>Name</Form.Label>
                        <Form.Control 
                            type="text" 
                            placeholder="Enter name" 
                            value={name}
                            onChange={(e) => setName(e.target.value)} 
                        />
                    </Form.Group>

                    <Form.Group controlId="formSurname" className="mb-3">
                        <Form.Label style={{ color: 'white' }}>Surname</Form.Label>
                        <Form.Control 
                            type="text" 
                            placeholder="Enter surname" 
                            value={surname}
                            onChange={(e) => setSurname(e.target.value)}
                        />
                    </Form.Group>

                    <div className="d-grid gap-2">
                        <Button variant="primary" type="submit" disabled={loading}>
                            {loading ? 'Registering...' : 'Register'}
                        </Button>
                    </div>
                </Form>
            </Col>
        </Row>
    </Container>
    );
}

export default RegisterPage;