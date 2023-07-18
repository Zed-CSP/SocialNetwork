import { Paper, Box, Typography} from "@mui/material";
import './css/HC.css'


export function Profile() {
  return (
    <div className="Pro" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          overflow: 'auto',
          outline: 'solid white',
          borderRadius: '15px',
          padding: '2%',
          margin: '1%',
          height: '70vh',
          width: '70vw',
        }}
      >
        <Paper elevation={3} sx={{ p: 2 }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
            <img src={'profileImage'} alt="Profile" style={{ width: '100px', height: '100px', borderRadius: '50%', marginRight: '16px' }} />
            <Typography variant="h4" gutterBottom>
              Profile
            </Typography>
          </div>
          <Typography variant="body1">
            Name: John Doe
          </Typography>
          <Typography variant="body1">
            Email: john.doe@example.com
          </Typography>
          <Typography variant="body1">
            Location: New York
          </Typography>
          {/* Add more profile information here */}
        </Paper>
      </Box>
    </div>
  );
}
// export function Profile() {

//     return(
//       <div className="Pro">
//     <Box
//         sx={{
//             display: 'flex',
//             flexWrap: 'wrap',
//             overflow: 'auto',
//             outline: "solid white",
//             borderRadius: '15px',
//             padding: '2%',
//             margin: '1%',
//             height: '70vh',
//             width: '70vw',
//             '& > :not(style)': {
//               m: 4,
//               height: 400,
//               p: '2%',
//             },
            
//           }}
//         >
            
//         <div>
//             <Paper></Paper>
//         </div>

        
//         </Box>
//         </div>
//     );
// }

export default Profile;