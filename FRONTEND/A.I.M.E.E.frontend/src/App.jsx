import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainSection from './component/Main-Section'
import LoginPage from './component/Login-Page';
import NavBar from './component/NavBar';
import AppointmentPage from './component/Appointment-Page';
import DonePage from './component/Done-Page';
import ToDoPage from './component/ToDo-Page';
import ChatHistory from './component/ChatHistory-Page';
import ProfilePage from './component/Profile-Page';
import RegisterPage from './component/Register-Page';
import { Container, Row } from 'react-bootstrap'
import React from 'react';
import { useSelector } from 'react-redux';




function App() {

  const { token } = useSelector(state => state.login);

  return (
    <BrowserRouter>
    <>
     <NavBar />
      <Container>
        <Routes>
        <Route path="/" element={token ? <MainSection /> : <LoginPage />} />
              <Route path="/mainSection" element={<MainSection />} />
              <Route path="/todo-list" element={<ToDoPage />} />
              <Route path="/appointment-list" element={<AppointmentPage />} />
              <Route path="/done-list" element={<DonePage />} />
              <Route path="/chat-history" element={<ChatHistory />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/logout" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </Container>
    </>
    </BrowserRouter>
  )
}

export default App
