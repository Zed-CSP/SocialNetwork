import * as THREE from 'three';
import React,{ useState, useRef} from 'react'
import { Canvas, useFrame} from '@react-three/fiber';
import './App.css';
import { Scroll, ScrollControls} from '@react-three/drei';
import { Inter, Login, Register} from './components';
import { Points, PointMaterial } from '@react-three/drei'
import * as random from 'maath/random/dist/maath-random.esm'
import { Avatar } from "@mui/material";
import MailIcon from '@mui/icons-material/Mail';
import IconButton from '@mui/material/IconButton';
import NotificationsNoneTwoToneIcon from '@mui/icons-material/NotificationsNoneTwoTone';
import Box from '@mui/material/Box';
import {Menu, MenuItem, Typography} from "@mui/material";




function Stars(props) {
  const ref = useRef()
  const [sphere] = useState(() => random.inSphere(new Float32Array(5000), { radius: 1.5 }))
  useFrame((state, delta) => {
    ref.current.rotation.x -= delta / 10
    ref.current.rotation.y -= delta / 15
  })
  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={false} {...props}>
        <PointMaterial transparent color="#ffa0e0" size={0.005} sizeAttenuation={true} depthWrite={false} />
      </Points>
    </group>
  )
}

const settings = ['Profile', 'Settings', 'Logout'];


function App() {
  const [view, setView] = useState(0);
  const components = [<Login/>, <Inter/>, <Register />];
  const [anchorElUser, setAnchorElUser] = useState(null);
    
  const handleOpenUserMenu = (event) => {
      setAnchorElUser(event.currentTarget);
  };
    
  const handleCloseUserMenu = () => {
      setAnchorElUser(null);
  };

  const handleSettingClick = (setting) => {
      // Perform different actions based on the setting
      if (setting === 'Profile') {
        // Handle Profile setting
        console.log('Clicked on Profile');
      } else if (setting === 'Settings') {
        // Handle Settings setting
        console.log('Clicked on Settings');
      } else if (setting === 'Logout') {
        // Handle Logout setting

        console.log('Clicked on Logout');
      }
    };
  

  return (
    <div className="App" >
      <Canvas camera={{position:[0, 0, 1]}}>
        <color attach={'background'} args={['#333333']} />

        <ScrollControls pages={1} damping={0.2}>
          <Stars/>
          
          <Scroll html>
            <div className={`h-screen w-screen p-8 max-w-screen-2xl mx-auto `}>
            
          <Box
      sx={{
          display: 'flex',
          // alignItems: 'center',
          // justifyContent: 'center',
          '& > :not(style)': {
            m: 1,
            width: 40,
            height: 40,
            right: 0,
          },
          margin: '5%',
        }}
      >
          
          
          <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}><Avatar/></IconButton>
          <IconButton color="primary" onClick={() => setView(0)}><MailIcon/></IconButton>
          <IconButton color="primary" onClick={() => setView(2)}><NotificationsNoneTwoToneIcon/></IconButton>
          <Menu
            sx={{ mt: '45px' }}
            id="menu-appbar"
            anchorEl={anchorElUser}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorElUser)}
            onClose={handleCloseUserMenu}
          >
            {settings.map((setting) => (
              <MenuItem key={setting} onClick={() => handleSettingClick(setting)}>
                <Typography textAlign="center">{setting}</Typography>
              </MenuItem>
            ))}
          </Menu>
          
      </Box>
            <div className='smContainer'>
            {components[view]}
            </div>

            </div>
          </Scroll>
        </ScrollControls>
      
      
      </Canvas>
      

    </div>
  );
}

export default App;


// flex flex-col items-center justify-center