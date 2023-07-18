import React from 'react';
import { Link } from 'react-router-dom';
// import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import HomeTwoToneIcon from '@mui/icons-material/HomeTwoTone';
import SettingsTwoToneIcon from '@mui/icons-material/SettingsTwoTone';
import AccountCircleTwoToneIcon from '@mui/icons-material/AccountCircleTwoTone';
import LoginTwoToneIcon from '@mui/icons-material/LoginTwoTone';
import HowToRegTwoToneIcon from '@mui/icons-material/HowToRegTwoTone';
const Header = () => {
  return (
    <div className='Bar'>
    {/* <AppBar position="static"> */}
      {/* <Toolbar> */}
        {/* <Typography variant="h5" sx={{ flexGrow: 1 }}>
          Group Hub
        </Typography> */}

        <IconButton color="inherit" component={Link} to="/home">
          <HomeTwoToneIcon />
        </IconButton>
        <IconButton color="inherit" component={Link} to="/login">
          <LoginTwoToneIcon/>
        </IconButton>
        <IconButton color="inherit" component={Link} to="/register">
          <HowToRegTwoToneIcon/>
        </IconButton>
        <IconButton color="inherit" component={Link} to="/settings">
          <SettingsTwoToneIcon />
        </IconButton>
        <IconButton color="inherit" component={Link} to="/profile">
          <AccountCircleTwoToneIcon/>
        </IconButton>
      {/* </Toolbar> */}
    {/* </AppBar> */}
    </div>
  );
};

export default Header;

