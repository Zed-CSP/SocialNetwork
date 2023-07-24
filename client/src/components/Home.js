import { useQuery } from "@apollo/client";
import Box from '@mui/material/Box';
import PostCard from "./Card";
import Button from '@mui/material/Button';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import { Link } from 'react-router-dom';
import jwt_decode from "jwt-decode";
import { GET_PERSONALIZED_POSTS } from "../graphql/queries";
import './css/HC.css';

export default function Home() {
    // Get the current userId from the token
    const token = localStorage.getItem('id_token');
    const decodedToken = jwt_decode(token);
    const currentUserId = decodedToken.data._id;
    
    const { loading, error, data } = useQuery(GET_PERSONALIZED_POSTS, {
        variables: { userId: currentUserId }
    });

    console.log("Error: ", error);

    console.log("Data in Home.js: ", data);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    const posts = data.userFeed;

    return (
        <div className="Hom">
            <div className='makeapost'>
                <Link to='/createpost'>
                    <Button 
                        className='postBtn' 
                        style={{ color: 'white', backgroundColor: 'grey' }} 
                        variant='contained' 
                        endIcon={<AddTwoToneIcon />}
                    >
                        Add Post 
                    </Button>
                </Link>
            </div>
            <Box
                className='haus'
                sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    borderRadius: '15px',
                    padding: '2%',
                    margin: '1%',
                    height: '80vh',
                    width: '100vw',
                    '& > :not(style)': {
                        m: 4,
                        height: 400,
                        p: '2%',
                    },
                }}
            >
                 <div 
                    className='innerFeed' 
                    style={{ 
                        position: 'absolute', 
                        height: '80%', 
                        top: '55%', 
                        left: '50%', 
                        transform: 'translate(-50%, -50%)', 
                        overflow: 'auto' 
                    }}
                >
                    {posts.map(post => (
                        <PostCard key={post._id} post={post} likes={post.likes} />
                    ))}
                </div>
            </Box>
        </div>
    );
}

