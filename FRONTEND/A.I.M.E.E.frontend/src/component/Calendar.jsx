import React, { useState, useEffect } from 'react';
import {  Button} from 'react-bootstrap';
import { Link } from "react-router-dom";

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [appointments, setAppointments] = useState([]);
  const [todo, setTodo] = useState([]);
  const [done, setDone] = useState([]);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const userId = sessionStorage.getItem('userId');
    setUserId(userId);
  
    if (userId) {
      const fetchData = async () => {
        const token = sessionStorage.getItem('token');
  
        try {
          let allAppointments = [];
          let appointmentPageNumber = 0;
          let appointmentLastPage = false;
          while (!appointmentLastPage) {
            const appointmentResponse = await fetch(`http://localhost:3001/appointment/byUser/${userId}?page=${appointmentPageNumber}&size=10&sortBy=id`, {
              headers: {
                Authorization: `Bearer ${token}`
              }
            });
            const appointmentData = await appointmentResponse.json();
            allAppointments = allAppointments.concat(appointmentData.content);
            appointmentLastPage = appointmentData.last;
            appointmentPageNumber++;
          }
          setAppointments(allAppointments);
  
         
          let allTodos = [];
          let todoPageNumber = 0;
          let todoLastPage = false;
          while (!todoLastPage) {
            const todoResponse = await fetch(`http://localhost:3001/toDo/byUser/${userId}?page=${todoPageNumber}&size=10&sortBy=id`, {
              headers: {
                Authorization: `Bearer ${token}`
              }
            });
            const todoData = await todoResponse.json();
            allTodos = allTodos.concat(todoData.content);
            todoLastPage = todoData.last;
            todoPageNumber++;
          }
          setTodo(allTodos);
  
          
          let allDones = [];
          let donePageNumber = 0;
          let doneLastPage = false;
          while (!doneLastPage) {
            const doneResponse = await fetch(`http://localhost:3001/done/byUser/${userId}?page=${donePageNumber}&size=10&sortBy=id`, {
              headers: {
                Authorization: `Bearer ${token}`
              }
            });
            const doneData = await doneResponse.json();
            allDones = allDones.concat(doneData.content);
            doneLastPage = doneData.last;
            donePageNumber++;
          }
          setDone(allDones);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
  
      fetchData();
    }
  }, []);
  

  const handlePreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const renderDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const endDate = new Date(year, month + 1, 0).getDate();
    const daysInMonth = [];
  
    for (let i = 1; i <= endDate; i++) {
      const currentDate = new Date(year, month, i);
      const currentDateAsString = currentDate.toLocaleDateString(); 
      const appointmentsForDay = appointments.filter(app => new Date(app.date).toLocaleDateString() === currentDateAsString);
      const todosForDay = todo.filter(todo => new Date(todo.expirationDate).toLocaleDateString() === currentDateAsString);
      const donesForDay = done.filter(done => new Date(done.completionDate).toLocaleDateString() === currentDateAsString);
      const hasEvents = appointmentsForDay.length > 0 || todosForDay.length > 0 || donesForDay.length > 0;
  
      daysInMonth.push(
        <div key={i} className={`calendar-day ${hasEvents ? 'has-events' : ''}`}>
          <span className="day-number">{i}</span>
          {hasEvents &&
            <div className="events">
              {appointmentsForDay.map(app => (
                <div key={app.id} className="appointment">
                  {app.title}
                </div>
              ))}
              {todosForDay.map(todo => (
                <div key={todo.id} className="todo">
                  {todo.description}
                </div>
              ))}
              {donesForDay.map(done => (
                <div key={done.id} className="done">
                  {done.description}
                </div>
              ))}
            </div>
          }
        </div>
      );
    }
  
    return daysInMonth;
  };
  

  return (
    <>
    <div className='space'></div>
    <div className="calendar">
    <div className="calendar-header">
      <button onClick={handlePreviousMonth}>Previous</button>
      <span style={{fontSize: "40px"}}>{currentDate.toLocaleString('default', { month: 'long' })} {currentDate.getFullYear()}</span>
      <button onClick={handleNextMonth}>Next</button>
    </div>
    <div className="calendar-body">
      {renderDays()}
    </div>
  </div>
  <Button
        as={Link}
        to="/mainSection"
        variant="outline-warning"
        className="mt-5"
      >
        Back
      </Button>
  </>
);
};

export default Calendar;
