import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import IconButton from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import FavoriteBorderTwoToneIcon from '@mui/icons-material/FavoriteBorderTwoTone';
import CreateIcon from '@mui/icons-material/Create';
import Avatar from '@mui/material/Avatar';
import CardMedia from '@mui/material/CardMedia';
import ShareTwoToneIcon from '@mui/icons-material/ShareTwoTone';
import placeholder from './img/in_img.png';
import ReadMoreTwoToneIcon from '@mui/icons-material/ReadMoreTwoTone';
import CloseFullscreenTwoToneIcon from '@mui/icons-material/CloseFullscreenTwoTone';

export default function CardExp() {
    return (
      <div className='CarEx' >
        
      <Card color='dark' style={{ position: 'relative', backgroundColor: 'rgba(220, 220, 220, 0.5)' }}>
    <div className='heading' style={{display: 'flex'}}>
    <CardMedia
        sx={{ height: '15vh', width: '10%' }}
        image={placeholder}
        
        />
      
        {/* <iframe title="embed" 
            width={640} 
            height={480} 
            src="https://www.hackerrank.com/" 
            /> */}
        
        <a href='#' style={{ display: 'flex', alignSelf: 'end', marginLeft: '2%'}}>
            <Avatar alt='User' />
        </a>
        <Typography sx={{ fontSize: 14, display: 'flex', alignSelf: 'end', marginLeft: '2%', color: 'white' }} color="text.secondary" gutterBottom>
            {'Username'}
        </Typography>
        <IconButton style={{color: 'blue', borderRadius: '50%', position: 'absolute', top: '20%', right:'2%', zIndex: 1}}><CloseFullscreenTwoToneIcon/></IconButton>

    </div>
    

        <CardContent>
          <div className='Tagz' >
          <span style={{ cursor: 'pointer', color: 'white' }} >
              #tag1 #tag2 #tag3
            </span>
          </div>

          <div className='Desc' >
          <Typography variant="body2" color="text.secondary">
            
            <br />
            {'"Post Description"'}
          </Typography>
            
          </div>
        </CardContent>
        <CardActions style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
          <IconButton aria-label="like" size="small" style={{borderRadius: '50%', color: 'white'}}><FavoriteBorderTwoToneIcon /></IconButton>
          <IconButton aria-label='comment' size="small" style={{borderRadius: '50%', color: 'white'}}><CreateIcon /></IconButton>
          <IconButton aria-label='share' size='small' style={{borderRadius: '50%', color: 'white'}}><ShareTwoToneIcon /></IconButton>
        </CardActions>
      </Card>
      
      </div>
    );
  }