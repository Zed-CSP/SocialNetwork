import { Paper, Box, Typography} from "@mui/material";


export function Profile() {

    return(
    <Box
        sx={{
            display: 'flex',
            flexWrap: 'wrap',
            overflow: 'auto',
            outline: "solid white",
            borderRadius: '15px',
            padding: '2%',
            margin: '1%',
            height: '60vh',
            width: '70vw',
            '& > :not(style)': {
              m: 4,
              height: 400,
              p: '2%',
            },
            
          }}
        >
            
        <div>
            <Paper></Paper>
        </div>

        
        </Box>
    );
}

export default Profile;