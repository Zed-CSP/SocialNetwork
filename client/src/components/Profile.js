import { Paper, Box, Typography, Avatar, Chip, Stack, Badge} from "@mui/material";
import './css/HC.css'
import pro_img from './img/stock_earth.webp';
import CardMedia from '@mui/material/CardMedia';
import CreateTwoToneIcon from '@mui/icons-material/CreateTwoTone';
import FavoriteTwoToneIcon from '@mui/icons-material/FavoriteTwoTone';
import ChatBubbleTwoToneIcon from '@mui/icons-material/ChatBubbleTwoTone';

const hi = '10';

export function Profile() {
  return (
    <div className="Pro" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center'  }}>
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                  <Chip icon={<FavoriteTwoToneIcon/>} style={{marginRight: '20%', color: 'white', }} color='secondary'  label={hi}/>
                  <Chip icon={<ChatBubbleTwoToneIcon/>} style={{color: 'white'}} label={hi} color="primary"/>
                  <Chip icon={<CreateTwoToneIcon/>} style={{marginLeft: '20%', color: 'white'}} label={hi} color="success"/>
      </div>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          overflow: 'auto',
          // outline: 'solid white',
          borderRadius: '15px',
          padding: '2%',
          
          height: '70vh',
          width: '100vw',
          
        }}
      >
        
        <Paper elevation={0} sx={{ p: 2, flex:1 }} style={{   position: 'relative', backgroundColor: 'rgba(128, 128, 128, 0.0)', borderRadius: '15px'  }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', flexDirection:'column' ,alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
            {/* <img src={pro_img} alt="Profile Pic" style={{ width: '50vw', height: '30vh', borderRadius: '15px' }} /> */}
            <CardMedia sx={{ height: '30vh', width: '100%', border: '3px solid white', borderRadius: '15px'}} image={pro_img} />
            <Avatar sx={{ width: 60, height: 60, position:'absolute', bottom: '30vh', border: '2px solid white' }}></Avatar>
            
          </div>

          <div className="secondary" style={{display: 'flex', padding: '2%'}}>
          <Typography style={{marginTop: '1%', padding: '1%', backgroundColor: 'rgba(128, 128, 128, 0.6)', borderRadius: '15px',  margin: '3%'}} variant="h6" gutterBottom>
              Username
          </Typography>
          </div>

        </Paper>
      </Box>
    </div>
  );
}


export default Profile;