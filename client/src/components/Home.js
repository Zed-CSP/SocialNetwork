import {Grid} from "@mui/material";
import Box from '@mui/material/Box';
import PostCard from "./Card";
import './css/HC.css'



export function Home () {

    
    return(
        <Box
        sx={{
            display: 'flex',
            flexWrap: 'wrap',
            overflow: 'auto',
            outline: "solid white",
            borderRadius: '15px',
            padding: '2%',
            '& > :not(style)': {
              m: 4,
              height: 400,
              p: '2%',
            },
            
          }}
        >
            
        <div>
            <PostCard/>
            <PostCard/>
            <PostCard/>
        </div>

        
        </Box>
    );

}
export default Home;