import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { Box, Button } from "@mui/material";
import TextField from '@mui/material/TextField';
import DoneIcon from '@mui/icons-material/Done';
import './css/HC.css'
import { LOGIN_USER } from "../graphql/mutations";
import Auth from '../utils/auth';

export function Login() {
  const [formState, setFormState] = useState({ email: '', password: '' });

  const [login, { error }] = useMutation(LOGIN_USER);


  const handleChange = event => {
    const { name, value } = event.target;
    setFormState({
      ...formState,
      [name]: value
    });
  };

  const handleFormSubmit = async event => {
    event.preventDefault();
    try {
      console.log(formState, "formState");
      const { data } = await login({
        variables: { ...formState }
      });

      Auth.login(data.login.token);

      // redirect to HomeCards.js
      if(data.login.token){
        window.location.replace("/home");
      }

    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className='Log'>
    <Box
      sx={{
        width: 300,
        height: 300,
        margin: '2%',
        padding: '2%',
        borderRadius: '15px',
        backgroundColor: 'rgba(220, 220, 220, 0.5)',
      }}
    >
      <h1 style={{ fontWeight: 'bolder', fontSize: '20px', paddingBottom: '5%' }}>Login</h1>
      <form onSubmit={handleFormSubmit}>
        <TextField  id="email" name="email" label="Email" variant="filled" onChange={handleChange} />
        <TextField id="password" name="password" type="password" label="Password" variant="filled" onChange={handleChange} />

        <Button style={{ color: 'white', marginTop: '10%' }} variant="contained" endIcon={<DoneIcon />} color="success" type="submit">Submit</Button>
      </form>
    </Box>
    </div>
  );
}

export default Login;
