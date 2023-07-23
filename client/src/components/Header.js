import { Link, useLocation } from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import HomeTwoToneIcon from '@mui/icons-material/HomeTwoTone';
import SettingsTwoToneIcon from '@mui/icons-material/SettingsTwoTone';
import AccountCircleTwoToneIcon from '@mui/icons-material/AccountCircleTwoTone';
import LoginTwoToneIcon from '@mui/icons-material/LoginTwoTone';
import HowToRegTwoToneIcon from '@mui/icons-material/HowToRegTwoTone';
import LogoutIcon from '@mui/icons-material/Logout';
import Tooltip from '@mui/material/Tooltip';
import React, { useState } from 'react';





const Header = () => {

  //logout function
  const logout = () => {
    localStorage.removeItem('id_token');
    window.location.replace('/');
  };

  const [transition, setTransition] = useState(false);

  const handleClick = () => {
    setTransition(!transition);
  };

  const isAuthenticated = localStorage.getItem('id_token');

  const location = useLocation();

  const showLoginRegisterButtons = !isAuthenticated && (location.pathname === '/login' || location.pathname === '/register');


  return (

    <div className='Bar' >

      <div className='NavCont' style={{ backgroundColor: 'rgba(128, 128, 128, 0.8)', borderRadius: '15px' }}>

        {!isAuthenticated && (
          <>
            <Tooltip title='Login'>
              <IconButton color="inherit" component={Link} to="/login">
                <LoginTwoToneIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title='Register'>
              <IconButton color="inherit" component={Link} to="/register">
                <HowToRegTwoToneIcon />
              </IconButton>
            </Tooltip>
          </>
        )}
        {isAuthenticated && (
          <>
            <Tooltip title='Home'>
              <IconButton color="inherit" component={Link} to="/home">
                <HomeTwoToneIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title='Setting'>
              <IconButton color="inherit" component={Link} to="/settings">
                <SettingsTwoToneIcon />
              </IconButton>
            </Tooltip>


            <Tooltip title='Profile'>
              <IconButton color="inherit" component={Link} to="/profile"><AccountCircleTwoToneIcon /></IconButton>
            </Tooltip>

            <Tooltip title='Logout'>
              <IconButton color="inherit" onClick={logout}>
                <LogoutIcon />
              </IconButton>
            </Tooltip>



          </>
        )}
      </div>

    </div>

  );
};

export default Header;

