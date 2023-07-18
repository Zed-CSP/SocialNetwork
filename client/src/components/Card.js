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

export default function PostCard() {
    return (
      <div className='Car' >
        
      <Card color='dark' style={{ position: 'relative' }}>
      <CardMedia
        sx={{ height: '30vh', width: '50vw'}}
        image={placeholder}
        
      />
      
        {/* <iframe title="embed" 
            width={640} 
            height={480} 
            src="https://www.hackerrank.com/" 
            /> */}
        
      <a href='#' style={{ position: 'absolute', top: '2%', left:'2%', zIndex: 1 }}>
            <Avatar alt='User' />
            </a>
        <CardContent>
          <div className='Tagz' >
          <span style={{ color: 'blue', cursor: 'pointer' }} >
              #tag1 #tag2 #tag3
            </span>
          </div>
          <div className='Desc' >
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            {'Username'}
          </Typography>
          
          <Typography variant="body2">
            
            <br />
            {'"Post Description"'}
          </Typography>
            <IconButton style={{borderRadius: '50%'}}><ReadMoreTwoToneIcon/></IconButton>
          </div>
        </CardContent>
        <CardActions style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
          <IconButton aria-label="like" size="small"><FavoriteBorderTwoToneIcon /></IconButton>
          <IconButton aria-label='comment' size="small"><CreateIcon /></IconButton>
          <IconButton aria-label='share' size='small'><ShareTwoToneIcon /></IconButton>
        </CardActions>
      </Card>
      
      </div>
    );
  }