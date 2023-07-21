import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { TextField, Button, Box, Card, CardMedia } from '@mui/material';
import { ADD_POST } from '../graphql/mutations';



function CreatePost() {
  const [content, setContent] = useState('');
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState(null);
  const [addPost, { error }] = useMutation(ADD_POST);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      console.log("photo", photo);
      console.log("content", content);

      const { data } = await addPost({
        variables: {
          content,
          photo,git 
        },
      });
    
      console.log(data);
      setContent('');
      setPhoto(null);
      setPreview(null);
      window.location.replace('/home');
    } catch (e) {
      console.error(e);
    }
  };

  const handlePhotoChange = (event) => {

    const file = event.target.files[0];
<<<<<<< HEAD
=======
    if (!file) return;
    
    setPhoto(file);


    const file = event.target.files[0];
>>>>>>> e54413177b546466db2fff7f3cf015d3a339355f
    if(!file) return;

    setPhoto(file); 
    // Create a new FileReader object
    let reader = new FileReader();

    // Read the contents of the file
    reader.readAsDataURL(file);

    // Set the preview state to the result once reading is finished
    reader.onloadend = () => {
      setPreview(reader.result);
      };
    };

  return (
    <div className='Cre'>
      <Box
        className='cratecase'
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          borderRadius: '15px',
          padding: '2%',
          margin: '1%',
          height: '80vh',
          width: '100vw',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(220, 220, 220, 0.5)',
          '& > :not(style)': {
            m: 4,
            height: 400,
            p: '2%',
          },
        }}>
        <form onSubmit={handleSubmit}>
          {preview && (
            <Card sx={{ maxWidth: 345, marginBottom: 1 }}>
              <CardMedia
                sx={{ height: '30vh', width: '40vw' }}
                component="img"
                height="140"
                image={preview}
                alt="Preview"
              />
            </Card>
          )}

        <TextField
        
          value={content}
          onChange={(e) => setContent(e.target.value)}
          label="Post Content"
          variant="outlined"
          fullWidth
          multiline
          rows={4}
          margin="normal"
        />
        <label htmlFor="upload-photo">
          <input
            accept="image/*"
            id="upload-photo"
            type="file"
            hidden
            onChange={handlePhotoChange}
          />
          <Button variant="contained" component="span" style={{ marginTop: '1rem', marginRight: '1rem', backgroundColor: 'grey' }}>
            Choose Photo
          </Button>
        </label>
        <Button type="submit" variant="contained" style={{ marginTop: '1rem', backgroundColor: 'grey' }}>
          Create Post
        </Button>
        {error && <p>Error creating post: {error.message}</p>}
      </form>
    </Box>
    </div>
  );
}

export default CreatePost;
