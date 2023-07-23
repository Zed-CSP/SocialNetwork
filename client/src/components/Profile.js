
import { Paper, Box, Typography, Avatar, Chip, Stack, Badge, Button} from "@mui/material";

import './css/HC.css'
import pro_img from './img/stock_earth.webp';
import CardMedia from '@mui/material/CardMedia';
import CreateTwoToneIcon from '@mui/icons-material/CreateTwoTone';
import FavoriteTwoToneIcon from '@mui/icons-material/FavoriteTwoTone';
import ChatBubbleTwoToneIcon from '@mui/icons-material/ChatBubbleTwoTone';
import PostCard from "./Card";
import { useState, useRef } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import{UPLOAD_AVATAR, GET_POSTS} from "../graphql/queries";
import jwt_decode from "jwt-decode";


const hi = '10';

export function Profile() {

  

  // load profile picture/avatar
  // const { loading, error, data } = useQuery(GET_ME);
  // if (loading) return <p>Loading...</p>;
  // if (error) return <p>Error: {error.message}</p>;
  // const user = data.me;
  // const hasProfilePicture = !!user.profile_picture;

  
  const [cardMediaFile, setCardMediaFile] = useState(null);
  const cardMediaFileInputRef = useRef(null);
  const avatarFileInputRef = useRef(null);

const [avatarFile, setAvatarFile] = useState(null);
  const [uploadAvatar] = useMutation(UPLOAD_AVATAR);


  const handleCardMediaFileChange = (event) => {
    const file = event.target.files[0];
    setCardMediaFile(file);
  };

  const handleAvatarFileChange = (event) => {
    const file = event.target.files[0];
    setAvatarFile(file);
  };
  
  

  const handleUploadAvatar = async () => {
    try {
      if (avatarFile) {
        await uploadAvatar({ variables: { avatar: avatarFile } });
        console.log(avatarFile);
        alert('Avatar uploaded successfully!');
      }
    } catch (error) {
      console.error('Error uploading avatar:', error);
      alert('Error uploading avatar.');
    }
  };

  
  const token = localStorage.getItem("id_token");
  const decodedToken = jwt_decode(token);
  const username = decodedToken.data.username;
  const _id = decodedToken.data._id
  console.log(username);
  console.log(_id);

  const { loading, error, data } = useQuery(GET_POSTS, {
    variables: { _id }, // Pass the username variable here
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const posts = data.posts;
  // const posts = data.posts.filter(post => post.user._id === id);
  console.log(posts);
  

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
          borderRadius: '15px',
          padding: '2%',
          height: '70vh',
          width: '100vw',
        }}
      >
        <Paper elevation={0} sx={{ p: 2, flex:1 }} style={{ position: 'relative', backgroundColor: 'rgba(128, 128, 128, 0.0)', borderRadius: '15px' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', flexDirection:'column' ,alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>

          <input type="file" accept="image/*" onChange={handleCardMediaFileChange} style={{ display: 'none' }} ref={cardMediaFileInputRef} />
            <CardMedia sx={{ height: '30vh', width: '100%', border: '3px solid white', borderRadius: '15px', cursor: 'pointer'}} image={cardMediaFile ? URL.createObjectURL(cardMediaFile) : pro_img}
              onClick={() => cardMediaFileInputRef.current.click()} />
            
            
            <Avatar sx={{ width: 60, height: 60, position:'absolute', bottom: '30vh', border: '2px solid white', cursor: 'pointer' }} onClick={() => avatarFileInputRef.current.click()}>  {/*() => avatarFileInputRef.current.click()*/}
            
            <input type="file" accept="image/*" onChange={handleAvatarFileChange} style={{ display: 'none' }} ref={avatarFileInputRef} />
            {/* {hasProfilePicture && <img src={user.profile_picture} alt="Profile Avatar" />} */}
            {avatarFile && ( 
                <img src={URL.createObjectURL(avatarFile)} alt="Uploaded Avatar" style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
              )}
            </Avatar>
            {avatarFile && (
              <Button onClick={handleUploadAvatar} style={{}}>Upload Avatar</Button>
            )}

          </div>
          <div className="secondary" style={{display: 'flex', padding: '2%'}}>

          <Typography style={{marginTop: '1%', padding: '1%', backgroundColor: 'rgba(128, 128, 128, 0.6)', borderRadius: '15px',  margin: '3%'}} variant="h6" gutterBottom>
              {username}
          </Typography>


          
              
          </div>
          <div className="userPost">

          {posts.map((post) => (
            <PostCard key={post._id} post={post} likes={post.likes} />
          ))}

          </div>
        </Paper>
      </Box>
    </div>
  );
}

export default Profile;
