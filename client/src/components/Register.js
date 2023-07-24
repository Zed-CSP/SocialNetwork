import { Box, Button } from "@mui/material";
import TextField from '@mui/material/TextField';
import DoneIcon from '@mui/icons-material/Done';
import { useMutation } from '@apollo/client';
import { ADD_USER } from '../graphql/mutations';
import { useState } from 'react';
import './css/HC.css'
import Tos from './TermsOfServ.js';

export function Register() {
    const [addUser] = useMutation(ADD_USER);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [tosModalOpen, setTosModalOpen] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        // check that all fields are filled out
        if (!username || !email || !dateOfBirth || !password || !confirmPassword) {
            console.error("All fields must be filled out");
            return;
        }
    
        // check that passwords match
        if (password !== confirmPassword) {
            console.error("Passwords do not match");
            return;
        }
        setTosModalOpen(true);
    };

    const handleTosAccept = async () => {
        try {
            const { data } = await addUser({
                variables: { username, email, date_of_birth: dateOfBirth, password },
            });
    
            // Storing the token in localStorage upon successful registration
            const token = data.addUser.token;

            if (token) {
                localStorage.setItem('id_token', token);
                window.location.replace("/home");
            } else {
                console.error("Registration successful but no token received");
            }
        } catch (err) {
            // Handle error (e.g. show error message)
            console.error(err);
        }
    };

    const handleTosClose = () => {
        setTosModalOpen(false);
    };
    
    return (
        <div className="Reg">
            <Box 
            sx={{
                width: 300,
                height: 500,
                margin: '2%',
                paddingTop: '2%',
                borderRadius: '15px',
                backgroundColor: 'rgba(128, 128, 128, 0.6)',
            }}
            >
                <h1 style={{fontWeight: 'bolder', fontSize: '20px', paddingBottom: '5%'}}>Register</h1>
                
                <form onSubmit={handleSubmit}>
                    <div className="regTxt">
                    <TextField id="filled-basic" label="Username" variant="filled" value={username} onChange={(e) => setUsername(e.target.value)} />
                    <TextField id="filled-basic" label="Email" variant="filled" value={email} onChange={(e) => setEmail(e.target.value)} />
                    
                    <TextField id="filled-basic" label="Password" variant="filled" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    <TextField id="filled-basic" label="Confirm Password" variant="filled" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                    <TextField id="filled-basic" label="Date of Birth" variant="filled" type="date" InputLabelProps={{ shrink: true }} value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} />
                   </div> 
                   <Button style={{color:'white', marginTop: '10%'}} variant="contained" endIcon={<DoneIcon/>} color="success" type="submit">Submit</Button>
                
                </form>
                
                <Tos open={tosModalOpen} onAccept={handleTosAccept} onClose={handleTosClose} />
            </Box>
        </div>
    );
}

export default Register;
