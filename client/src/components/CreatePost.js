import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { TextField, Button } from '@mui/material';
import { CREATE_POST } from '../graphql/mutations';

function CreatePost() {
  const [content, setContent] = useState('');
  const [createPost, { error }] = useMutation(CREATE_POST);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const { data } = await createPost({ variables: { content } });
      console.log(data);
      setContent('');
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        value={content}
        onChange={(e) => setContent(e.target.value)}
        label="Post Content"
        variant="outlined"
        fullWidth
        multiline
        rows={4}
      />
      <Button type="submit" variant="contained" color="primary">
        Create Post
      </Button>
      {error && <p>Error creating post: {error.message}</p>}
    </form>
  );
}

export default CreatePost;
