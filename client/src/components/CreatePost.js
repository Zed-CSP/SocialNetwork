import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { TextField, Button, Box } from '@mui/material';
import { CREATE_POST } from '../graphql/mutations';

function CreatePost() {
  const [content, setContent] = useState('');
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState(null);
  const [createPost, { error }] = useMutation(CREATE_POST);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const { data } = await createPost({ variables: { content, photo } });
      console.log(data);
      setContent('');
      setPhoto(null);
      setPreview(null);
    } catch (e) {
      console.error(e);
    }
  };

  const handlePhotoChange = (event) => {
    const file = event.target.files[0];
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
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" style={{ minHeight: '100vh' }}>
      <form onSubmit={handleSubmit}>
        {preview && <img src={preview} alt="Preview" style={{ width: '100%', height: 'auto' }} />}
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
        <input
          accept="image/*"
          type="file"
          onChange={handlePhotoChange}
        />
        <Button type="submit" variant="contained" color="primary" style={{ marginTop: '1rem' }}>
          Create Post
        </Button>
        {error && <p>Error creating post: {error.message}</p>}
      </form>
    </Box>
  );
}

export default CreatePost;
