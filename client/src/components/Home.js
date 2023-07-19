
import Box from '@mui/material/Box';
import PostCard from "./Card";
import './css/HC.css'
import Button from '@mui/material/Button';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';


function UploadPost() {

}

export function Home () {

    
    return(
      
      
      <div className="Hom" >
        <div className='makeapost'>
        <Button style={{color: 'white', backgroundColor: 'grey'}}variant='contained' endIcon={<AddTwoToneIcon/>}>Add Post </Button>
        </div>
        <Box
        className='haus'
        sx={{
            display: 'flex',
            flexWrap: 'wrap',
            // overflow: 'auto',
            // outline: "solid white",
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
            
        <div className='innerFeed' style={{position: 'absolute', height: '70%',top: '50%', left: '50%', transform: 'translate(-50%, -50%)', overflow: 'auto'}}>
            {<PostCard/>}
            <PostCard />
        </div>

        
        </Box>
        </div>
       
    );

}
export default Home;