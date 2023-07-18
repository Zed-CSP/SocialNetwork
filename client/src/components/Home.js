
import Box from '@mui/material/Box';
import PostCard from "./Card";
import './css/HC.css'



export function Home () {

    
    return(
      <div className="Hom" >
        <Box
        sx={{
            display: 'flex',
            flexWrap: 'wrap',
            overflow: 'auto',
            outline: "solid white",
            borderRadius: '15px',
            padding: '2%',
            margin: '1%',
            height: '70vh',
            width: '70vw',
            '& > :not(style)': {
              m: 4,
              height: 400,
              p: '2%',
            },
            
          }}
        >
            
        <div className='innerFeed' style={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
            {<PostCard/>}
        </div>

        
        </Box>
        </div>
    );

}
export default Home;