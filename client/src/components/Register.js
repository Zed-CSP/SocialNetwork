import { Box, Button } from "@mui/material";
import TextField from '@mui/material/TextField';
import DoneIcon from '@mui/icons-material/Done';
export function Register() {

    return (
        <>
            <Box 
            sx={{
                
                width: 300,
                height: 400,
                margin: '2%',
                padding: '2%',
                borderRadius: '15px',
                backgroundColor: 'primary.dark',
            }}
            >
                <h1 style={{fontWeight: 'bolder', fontSize: '20px', paddingBottom: '5%'}}>Register</h1>
                <TextField id="filled-basic" label="Username" variant="filled" />
                <TextField id="filled-basic" label="Password" variant="filled" />
                <TextField id="filled-basic" label="Confirm Password" variant="filled" />

                <Button style={{color:'black', marginTop: '10%'}} variant="contained" endIcon={<DoneIcon/>} color="success">Submit</Button>
            </Box>
        </>
    );

}

export default Register;
