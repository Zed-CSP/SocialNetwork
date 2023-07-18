import { Box, Button } from "@mui/material";
import TextField from '@mui/material/TextField';
import DoneIcon from '@mui/icons-material/Done';
import { useMutation } from '@apollo/client';
import { ADD_USER } from '../graphql/mutations';
import { useState } from 'react';

export function Register() {
    const [addUser] = useMutation(ADD_USER);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');


    const handleSubmit = async (event) => {
        event.preventDefault();
        if (password !== confirmPassword) {
            // Handle password mismatch
            console.error("Passwords do not match");
            return;
        }
        try {
            const { data } = await addUser({
                variables: { username, email, date_of_birth: dateOfBirth, password },
            });
            
            if(data.addUser.token){
                window.location.replace("/home");
            }
            // Handle successful registration (e.g. redirect to login page)
        } catch (err) {
            // Handle error (e.g. show error message)
            console.error(err);
        }
    };

    return (
        <>
            <Box 
            sx={{
                width: 300,
                height: 600,
                margin: '2%',
                padding: '2%',
                borderRadius: '15px',
                backgroundColor: 'primary.dark',
            }}
            >
                <h1 style={{fontWeight: 'bolder', fontSize: '20px', paddingBottom: '5%'}}>Register</h1>
                <form onSubmit={handleSubmit}>
                    <TextField id="filled-basic" label="Username" variant="filled" value={username} onChange={(e) => setUsername(e.target.value)} />
                    <TextField id="filled-basic" label="Email" variant="filled" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <TextField id="filled-basic" label="Date of Birth" variant="filled" type="date" InputLabelProps={{ shrink: true }} value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} />
                    <TextField id="filled-basic" label="Password" variant="filled" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    <TextField id="filled-basic" label="Confirm Password" variant="filled" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                    <Button style={{color:'black', marginTop: '10%'}} variant="contained" endIcon={<DoneIcon/>} color="success" type="submit">Submit</Button>
                </form>
            </Box>
        </>
    );
}

export default Register;
