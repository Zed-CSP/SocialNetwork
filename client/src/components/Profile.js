import { Paper, Box, Typography} from "@mui/material";
import './css/HC.css'
import pro_img from './img/default_pro_pic.png';
import CardMedia from '@mui/material/CardMedia';
export function Profile() {
  return (
    <div className="Pro" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center'  }}>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          overflow: 'auto',
          // outline: 'solid white',
          borderRadius: '15px',
          padding: '2%',
          margin: '1%',
          height: '70vh',
          width: '100vw',
          
        }}
      >
        <Paper elevation={3} sx={{ p: 2, flex:1 }} style={{   position: 'relative', backgroundColor: 'rgba(220, 220, 220, 0.5)' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', flexDirection:'column' ,alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
            {/* <img src={pro_img} alt="Profile Pic" style={{ width: '50vw', height: '30vh', borderRadius: '15px' }} /> */}
            <CardMedia sx={{ height: '30vh', width: '100%'}} image={pro_img} />
            <Typography variant="h6" gutterBottom>
              Username
            </Typography>
          </div>
          <Typography variant="body1">
            Name: 
          </Typography>
          <Typography variant="body1">
            Email: 
          </Typography>
          <Typography variant="body1">
            Location: 
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