import React, { useState, useRef } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import { Canvas} from '@react-three/fiber';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader';
import { CardExp, Login, Register, Profile, Home, Header, Stars, CreatePost } from './components';





function App() {
  return (
  <div className="AppSc" >
     <div className='TopSide'>
      <Router>
        <Header />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/home" element={<Home />} />
          <Route path="/createpost" element={<CreatePost />} />
          <Route path="/" element={<Login />} />
          <Route path="/expanded" element={<CardExp />} />
        </Routes>
      </Router>
      </div>
    <div className='BotSide hight-screen width-screen'>
  <Canvas camera={{position:[0, 0, 1]}}>
      <color attach={'background'} args={['#333333']} />
      <Stars/>
  </Canvas>
  </div>
  </div>
    
  );
}


export default App;
