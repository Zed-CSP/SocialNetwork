import React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import IconButton from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import FavoriteBorderTwoToneIcon from '@mui/icons-material/FavoriteBorderTwoTone';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CreateIcon from '@mui/icons-material/Create';
import Avatar from '@mui/material/Avatar';
import CardMedia from '@mui/material/CardMedia';
import ShareTwoToneIcon from '@mui/icons-material/ShareTwoTone';
import placeholder from './img/in_img.png';
import ReadMoreTwoToneIcon from '@mui/icons-material/ReadMoreTwoTone';
import { formatDistanceToNow } from 'date-fns';
import { useQuery, useMutation } from '@apollo/client';
import { GET_ME } from '../graphql/queries';
import { LIKE_POST, UNLIKE_POST } from "../graphql/mutations";
import { ADD_COMMENT } from '../graphql/mutations';
import { GET_POSTS } from '../graphql/queries';
import { GET_POST_BY_ID } from '../graphql/queries';

export default function PostCard({ post }) {
  const { data, loading, error } = useQuery(GET_ME);
  // console.log("data in postcard", data);
  const [likePost] = useMutation(LIKE_POST);
  const [unlikePost] = useMutation(UNLIKE_POST);
  const [addComment] = useMutation(ADD_COMMENT);

  const [commentContent, setCommentContent] = React.useState('');
  const [showComments, setShowComments] = React.useState(false);
  const commentsEndRef = React.useRef(null);
  const commentsTopRef = React.useRef(null);

  React.useEffect(() => {
    if (showComments && commentsEndRef.current) {
      commentsEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [showComments]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const currentUser = data.me;

  const likesArray = post.likes || [];

  // console.log("likesArray", likesArray);

  const isLikedByUser = likesArray.some(like => like.user && like.user.username === currentUser.username);

  


  // console.log("isLikedByUser", isLikedByUser);



  const handleCommentSubmit = async (postId) => {
    console.log("postId", postId);
    console.log("commentContent", commentContent);
    try {
      await addComment({
        variables: {
            postId,
            content: commentContent
        },
        update(cache, { data: { addComment: newComment } }) {
            const existingPostData = cache.readQuery({
                query: GET_POST_BY_ID,
                variables: { id: postId }
            });
    
            if (!existingPostData || !existingPostData.post) {
                return; // Exit if post data is not in the cache
            }
    
            const updatedPost = {
                ...existingPostData.post,
                comments: [...existingPostData.post.comments, newComment]
            };
    
            // Write the updated post back to the cache
            cache.writeQuery({
                query: GET_POST_BY_ID,
                variables: { id: postId },
                data: {
                    post: updatedPost
                }
            });
        }
    });
    
    setCommentContent(''); // Clear the input after successful submission

       // After successfully adding the comment
       if (commentsTopRef.current) {
        commentsTopRef.current.scrollTop = 0;
    }

    } catch (err) {
      console.error("Error adding comment:", err);
    }
  };
  



  const handleLike = async (postId) => {
    try {
      await likePost({
        variables: { postId },
        update: (cache, { data: { likePost } }) => {
          // Update the cache here based on the returned post data
        }
      });
    } catch (err) {
      console.error("Error liking post:", err);
    }
  };

  const handleUnlike = async (postId) => {
    try {
      await unlikePost({
        variables: { postId },
        update: (cache, { data: { unlikePost } }) => {
          // Update the cache here based on the returned post data
        }
      });
    } catch (err) {
      console.error("Error unliking post:", err);
    }
  };



  return (
    <div className='Car'>
      <Card color='dark' style={{ position: 'relative', backgroundColor: 'rgba(128, 128, 128, 0.6)', borderRadius: '15px', height: post.photo ? '60vh' : '30vh', width: '30vw' }}>
      {post.photo && (
        <CardMedia
          sx={{ height: '30vh', width: '30vw' }}
          image={post.photo ? post.photo : placeholder}
        />
        )}
        <a href='#' style={{ position: 'absolute', top: '2%', left: '2%', zIndex: 1 }}>
          <Avatar alt={post.username} />
        </a>

        <CardContent>
          {/* <div className='Tagz'>
            
            <span style={{ cursor: 'pointer', color: 'white' }}>
              #tag1 #tag2 #tag3
            </span>
          </div> */}

          <div className='Desc'>
            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
              {post.username}
            </Typography>

            <Typography variant="body2" color="text.secondary">
              {post.content}
            </Typography>

            <IconButton style={{ color: 'blue', borderRadius: '50%' }}>
              <ReadMoreTwoToneIcon />
            </IconButton>
          </div>
        </CardContent>

        <CardActions style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <div style={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-around' }}>
            <IconButton
              aria-label="like"
              size="small"
              style={{ borderRadius: '50%', color: isLikedByUser ? 'red' : 'white' }}
              onClick={isLikedByUser ? () => handleUnlike(post._id) : () => handleLike(post._id)}
            >
              <FavoriteBorderTwoToneIcon />
            </IconButton>
            <Typography variant="body2" color="text.secondary">
              {likesArray.length}
            </Typography>
            <IconButton
              aria-label='comment'
              size="small"
              style={{ borderRadius: '50%', color: 'white' }}
              onClick={() => setShowComments(!showComments)} // Toggle the comment section
            >
              <CreateIcon />
            </IconButton>
            <IconButton aria-label='share' size='small' style={{ borderRadius: '50%', color: 'white' }}>
              <ShareTwoToneIcon />
            </IconButton>
          </div>
          {showComments && (
            <div style={{ width: '100%' }} ref={commentsTopRef}>
              <div style={{ maxHeight: '180px', maxWidth: '328px', overflowY: 'scroll', borderBottom: '1px solid white' }}>
                {/* Dynamically render each comment from the post object in reverse order */}
                {[...post.comments].reverse().map((comment, idx, arr) => (
                  <div
                    key={comment._id}
                    style={{ padding: '10px' }}
                    ref={idx === 0 ? commentsEndRef : null}  // Add ref to the last comment (which is the first in the reversed array)
                  >
                    <strong>{comment.user.username}:</strong> {comment.content}
                    <Typography variant="caption" color="text.secondary" display="block" style={{ marginTop: '5px' }}>
                      {/* Uncomment the following line when you've resolved the date format issue */}
                      {/* {formatDistanceToNow(new Date(comment.createdAt))} ago */}
                    </Typography>
                  </div>
                ))}
              </div>

              {/* Comment input and button section */}
              <div style={{ paddingTop: '10px' }}>
                <TextField
                  value={commentContent}
                  onChange={(e) => setCommentContent(e.target.value)}
                  label="Add a comment"
                  fullWidth
                />
                <Button onClick={() => handleCommentSubmit(post._id)} color="primary" style={{ marginTop: '5px' }}>
                  Post Comment
                </Button>
              </div>
            </div>
          )}
        </CardActions>
      </Card>
    </div>
  );
}