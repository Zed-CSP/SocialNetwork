import React, { useState, useRef } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import { Canvas } from '@react-three/fiber';
import { Dice, CardExp, Login, Register, Profile, Home, Header, Stars, CreatePost } from './components';
import {Button} from '@mui/material';

function App() {
  const [LightTheme, setLightTheme] = useState(false);
  const [Background, setBackground] = useState('#333333');

  const switchBackground = () => {
    setLightTheme(!LightTheme);
    setBackground(LightTheme ?  '#333333' :  'white')
  }

  return (
  <div className="AppSc" >
     <div className='TopSide'>
     <div className='Switch'>
        <Button className='Theme' style={{color: 'white', backgroundColor: 'rgba(128, 128, 128, 0.8)', top: 15, left: 10}} onClick={() => switchBackground(!LightTheme)}>
          {LightTheme ? 'Dark' : 'Light'}
        </Button>
      </div>
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
      <color attach={'background'} args={[Background]} /> 
      <ambientLight intensity={1} />
      <pointLight position={[10, 10, 10]} castShadow />
      {LightTheme ? <Dice/> : <Stars/>}
      
  </Canvas>
  
  </div>
  </div>
    
  );
}

export default App;
