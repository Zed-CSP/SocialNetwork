import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import IconButton from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import FavoriteBorderTwoToneIcon from '@mui/icons-material/FavoriteBorderTwoTone';
import CreateIcon from '@mui/icons-material/Create';
import Avatar from '@mui/material/Avatar';

export default function PostCard() {
    return (
      <Card color='dark'>
        <CardContent>
            <a href='#'>
            <Avatar alt='User' />
            </a>
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            Username
          </Typography>
          
          <Typography variant="body2">
            
            <br />
            {'"User Comment"'}
          </Typography>
        </CardContent>
        <CardActions style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
          <IconButton aria-label="like" size="small"><FavoriteBorderTwoToneIcon /></IconButton>
          <IconButton aria-label='comment' size="small"><CreateIcon /></IconButton>
        </CardActions>
      </Card>
    );
  }