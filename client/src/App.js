import React, { useState, useRef } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import { Inter, Login, Register, Profile, Home, Header } from './components';





function App() {
  return (<div className="AppSc" >
      
      <Router>
        <Header />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/home" element={<Home />} />
          <Route path="/" element={<Login />} />
        </Routes>
      </Router>


      </div>
    
  );
}


export default App;
