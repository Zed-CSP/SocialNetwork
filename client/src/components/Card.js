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

export default function PostCard({ post }) {
  return (
    <div className='Car'>
      <Card color='dark' style={{ position: 'relative', backgroundColor: 'rgba(128, 128, 128, 0.6)', borderRadius: '15px' }}>
        
        <CardMedia
          sx={{ height: '20vh', width: '30vw' }}
          image={post.photo ? post.photo : placeholder}
        />

        <a href='#' style={{ position: 'absolute', top: '2%', left:'2%', zIndex: 1 }}>
            <Avatar alt={post.username} />
        </a>
        
        <CardContent>
          <div className='Tagz'>
            {/* Here you might want to parse post tags in the future */}
            <span style={{ cursor: 'pointer',color: 'white' }}>
              #tag1 #tag2 #tag3
            </span>
          </div>
          
          <div className='Desc'>
            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
              {post.username}
            </Typography>
            
            <Typography variant="body2" color="text.secondary">
              {post.content}
            </Typography>
            
            <IconButton style={{color:'blue', borderRadius: '50%'}}>
              <ReadMoreTwoToneIcon />
            </IconButton>
          </div>
        </CardContent>

        <CardActions style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
          <IconButton aria-label="like" size="small" style={{borderRadius: '50%', color: 'white'}}>
            <FavoriteBorderTwoToneIcon />
          </IconButton>
          <IconButton aria-label='comment' size="small" style={{borderRadius: '50%', color: 'white'}}>
            <CreateIcon />
          </IconButton>
          <IconButton aria-label='share' size='small' style={{borderRadius: '50%', color: 'white'}}>
            <ShareTwoToneIcon />
          </IconButton>
        </CardActions>
      </Card>
    </div>
  );
}
