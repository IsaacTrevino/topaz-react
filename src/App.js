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
 } from '@material-ui/core';
import './App.css';
import {
  listener,
  startTablet,
} from "./SigWeb";


const useStyles = makeStyles((theme) => ({
  root: {},
  card: {
    boxShadow: theme.shadows[5],
    outline: 'none'
  },

}));

// sdk
// https://www.topazsystems.com/web.html

// installer
// https://www.topazsystems.com/software/sigweb.exe

function App() {
  const classes = useStyles();

  listener()

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
              <Button onClick={() => startTablet()}>
                Sign
              </Button>
              <Typography variant='body1'>
                Please have customer sign signature pad.
              </Typography>
              <textarea name="sigString" rows="20" cols="50">SigString: </textarea>
            </form>
          </CardContent>
        </Card>
      </header>
    </div>
  );
}

export default App;
