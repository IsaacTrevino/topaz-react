import React, {useEffect, useState} from 'react';
import {
  Typography,
  makeStyles,
  Card,
  CardHeader,
  CardContent,
  Button,
  Box,
  Divider,
  TextField
 } from '@material-ui/core';
import './App.css';
import {
  listener,
  startTablet
} from "./SigWebTablet";


const useStyles = makeStyles((theme) => ({
  root: {},
  card: {
    boxShadow: theme.shadows[5],
    outline: 'none'
  },
  textField: {
    border: 1,
    background: 'grey',
    width: 500
  }

}));

/* sdk
   https://www.topazsystems.com/web.html
   Dev Guide
   https://www.topazsystems.com/Software/download/sigweb.pdf
   installer
   https://www.topazsystems.com/software/sigweb.exe
*/

function App() {
  const classes = useStyles();
  const [sigCaptured, setSigCaptured] = useState(null);

  listener()

  const handleSig = () => {

  }

  const handleSigCapture = (sig) => {
    let image = new Image();
    image.src = 'data:image/png;base64,' + sig;
    setSigCaptured({image, sig})
  }



  return (
    <div className="App">
      <header className="App-header">
        <Card
          className={classes.card}
          align='center'
        >
          <CardHeader title='Capture Signature' />
          <Divider/>
          <CardContent>
            <Box p={5}>
              <canvas id="cnv" name="cnv" width="500" height="100" />
            </Box>
            <form action="#" name="FORM1">
              {!sigCaptured?
                <Button 
                  onClick={() => {
                    startTablet(handleSigCapture);
                  }}
                >
                  Sign
                </Button>
                : 
                <Button 
                  onClick={() => {
                    handleSig();
                  }}
                >
                  Done
                </Button>
              }
              <Typography variant='body1'>
                Please have customer sign signature pad.
              </Typography>
              <Box p={2}>
                <Typography>
                  SigString:
                </Typography>
                <TextField className={classes.textField} name="sigString" rows='20'  multiline/>
              </Box>
              <Box p={2}>
                <Typography>
                  ImgData:
                </Typography>
                <TextField className={classes.textField} name='imgData' rows='20'  multiline value={sigCaptured?.image.src}/>
              </Box>
              <Box p={2}>
                <Typography>
                  Image:
                </Typography>
                <img src={sigCaptured?.image.src}/>
              </Box>
            </form>
          </CardContent>
        </Card>
      </header>
    </div>
  );
}

export default App;
