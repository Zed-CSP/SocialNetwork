import { useQuery } from "@apollo/client"; // Importing useQuery
import Box from '@mui/material/Box';
import PostCard from "./Card";
import './css/HC.css';
import Button from '@mui/material/Button';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import { Link } from 'react-router-dom';
import { GET_POSTS } from "../graphql/queries";

export function Home() {
    const { loading, error, data } = useQuery(GET_POSTS);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    const posts = data.posts;

    return (
        <div className="Hom">
            <div className='makeapost'>
                <Link to='/createpost'>
                    <Button className='postBtn' style={{ color: 'white', backgroundColor: 'grey' }} variant='contained' endIcon={<AddTwoToneIcon />}>Add Post </Button>
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
                <div className='innerFeed' style={{ position: 'absolute', height: '70%', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', overflow: 'auto' }}>
                    {posts.map(post => (
                        <PostCard key={post._id} post={post} />
                    ))}
                </div>
            </Box>
        </div>
    );
}

export default Home;
