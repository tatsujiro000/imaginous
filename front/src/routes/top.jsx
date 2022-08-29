import db from '../firebase.js';
import { collection, getDocs, orderBy, query, limit, where } from "firebase/firestore";
import React, { useState, useEffect } from 'react';
// import Event from '../components/event';
import Score from '../components/score/score';
import Feeling from '../components/feeling/feeling';
import RenderLineChart  from '../components/chart/chart';
import FeelingDial from '../components/feeling/feelingDial';

import { useNavigate, Navigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import { useAuthContext } from '../context/authContext';
import Stack from '@mui/material/Stack';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import Grow from '@mui/material/Grow';



function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ px: 0, py: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}


export default function Top() {
  // const [events, setEvents] = useState([]);
  const [myScores, setMyScores] = useState([]);
  const [firstMyScore, setFirstMyScore] = useState(0);
  const [partnerScores, setPartnerScores] = useState([]);
  const [firstPartnerScore, setFirstPartnerScore] = useState(0);
  const [myFeelings, setMyFeelings] = useState([]);
  const [partnerFeelings, setPartnerFeelings] = useState([]);
  const [value, setValue] = useState(0);
  const [drawing, setDrawing] = useState(false);

  const navigate = useNavigate();
  const { user, userId } = useAuthContext();


  const handleLogout = () => {
    const auth = getAuth();
    auth.signOut();
    navigate('/login');
  };

  //タブの切り替え
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  

  useEffect(() => {
    if(!userId){
      return;
    }
    setDrawing(true);
    //events
    // const eventsData = collection(db, "events");
    // const q = query(eventsData, orderBy("day", "desc"), limit(3));
    // getDocs(q).then((querySnapshot) => {
    //   setEvents(querySnapshot.docs.map((doc) =>doc.data()));
    // });

    //scores
    const scoresData = collection(db, "health_scores");
    const myScoresData = query(scoresData, where("user_id", "==", userId), orderBy("day", "desc"), limit(5));
    getDocs(myScoresData).then((querySnapshot) => {
      const myScores = querySnapshot.docs.map((doc) =>doc.data())
      setFirstMyScore(myScores.shift())
      setMyScores(myScores)
      // setFirstMyScore(querySnapshot.docs.map((doc) =>doc.data()).shift());
      // setMyScores(querySnapshot.docs.map((doc) =>doc.data()));
    })
    

    //partner_scores
    const partnerScoresData = query(scoresData, where("user_id", "==", 3), orderBy("day", "desc"), limit(5));
    getDocs(partnerScoresData).then((querySnapshot) => {
      const partnerScores = querySnapshot.docs.map((doc) =>doc.data())
      setFirstPartnerScore(partnerScores.shift())
      setPartnerScores(partnerScores)
      // setPartnerScores(querySnapshot.docs.map((doc) =>doc.data()));
    })

    //feelings
    const feelingsData = collection(db, "feelings");
    const myFeelings = query(feelingsData, where("user_id", "==", userId), orderBy("created_at", "desc"), limit(5));
    getDocs(myFeelings).then((querySnapshot) => {
      setMyFeelings(querySnapshot.docs.map((doc) =>doc.data()));
    });

    //partner_scores
    const partnerFeelings = query(feelingsData, where("user_id", "==", 3), orderBy("created_at", "desc"), limit(5));
    getDocs(partnerFeelings).then((querySnapshot) => {
      setPartnerFeelings(querySnapshot.docs.map((doc) =>doc.data()));
    })

  },[userId]);


  if (!user) {
    return <Navigate to="/login" />;
  } else {
    return (

      <main style={{ padding: "1rem 0" }}>

        {/* <button onClick={handleLogout}>ログアウト</button>
        <Typography variant="h2">Top</Typography>
        <Box>
          <Stack spacing={2} direction="row">
          {events.map((event) => (
            <Event 
              key={event.id}
              id={event.id}
              day={event.day}
              title={event.title}
            />
            ))}
          </Stack>
        </Box> */}


        <Box sx={{ width: '100%' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
              <Tab label="Me" {...a11yProps(0)} />
              <Tab label="Partner" {...a11yProps(1)} />
            </Tabs>
          </Box>
          <TabPanel value={value} index={0}>
            
            <Box mb={3}>
              <Grow in={drawing}>
                <Card>
                  <Stack spacing={2} direction="row">
                    <Box sx={{ flexGrow: 1 }}>
                      <Grid container spacing={2}>
                          <Grid item xs={6}>
                            <Stack spacing={2} direction="column">
                              <Typography variant="h3">Score</Typography>
                              <p>since yesterday</p>
                            </Stack>
                          </Grid>
                          <Grid 
                            item 
                            xs={6}
                            sx={{
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'flex-end',
                            }}
                          >
                              <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                            
                                <CircularProgress variant="determinate" value={firstMyScore.condition_score}
                                  size="5.2rem"
                                />
                                
                                <Box
                                  sx={{
                                    top: 0,
                                    left: 0,
                                    bottom: 0,
                                    right: 0,
                                    position: 'absolute',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                  }}
                                >
                                  <Typography variant="overline" component="div" color="text.secondary"
                                    sx={{
                                      fontSize:'2.8rem',
                                      padding: '0',
                                      fontWeight: '700'
                                    }}
                                  >
                                    {firstMyScore.condition_score}
                                  </Typography>
                                </Box>
                              </Box>


                              <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                            
                                <CircularProgress variant="determinate" value={firstMyScore.sleep_score}
                                  size="3.2rem"
                                  sx={{color:'#551A8B'}}
                                />
                                
                                <Box
                                  sx={{
                                    top: 0,
                                    left: 0,
                                    bottom: 0,
                                    right: 0,
                                    position: 'absolute',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                  }}
                                >
                                  <Typography variant="overline" component="div" color="text.secondary"
                                    sx={{
                                      fontSize:'1.6rem',
                                      padding: '0',
                                      fontWeight: '700'
                                    }}
                                  >
                                    {firstMyScore.sleep_score}
                                  </Typography>
                                </Box>
                              </Box>



                          </Grid>
                      </Grid>
                    </Box>

                  </Stack>

                  <Stack spacing={1} direction="row" sx={{display: 'flex', justifyContent: 'space-around'}}>
                    {myScores.map((score) => (
                      <Score 
                        key={score.id}
                        condition_score={score.condition_score}
                        sleep_score={score.sleep_score}
                      />
                    ))}

                  </Stack>

                  <Stack spacing={1} direction="row" sx={{mb:2, justifyContent:"right"}}>
                    <Typography variant="body2" sx={{color:"#188356"}}>condition's score</Typography>
                    <Typography variant="body2" sx={{color:"#551A8B"}}>/sleep's score</Typography>
                  </Stack>

                </Card>
              </Grow>
            </Box>

            <Box mb={3}>
              <Grow in={drawing}>
                <Card>
                  <Typography variant="h3">Feeling</Typography>
                  <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        p: 1,
                        m: 1,
                      }}
                    >
                    {myFeelings.map((feeling) => (
                      <Feeling 
                        key={feeling.created_at}
                        feeling={feeling.text}
                        day={feeling.created_at}
                      />
                    ))}
                  </Box>
                  
                </Card>
              </Grow>
            </Box>


            <Box>
              <Grow in={drawing}>
                <Card sx={{ width: '100%', height: 300}}>
                  <Typography variant="h3">Trend</Typography>
                    <RenderLineChart 
                      // user_id={userId}
                      userType={"own"}
                    />
                </Card>
              </Grow>
            </Box>

          </TabPanel>


          {/* Partner Area*/}
          <TabPanel value={value} index={1}>
            <Box mb={3}>
                <Grow in={drawing}>
                  <Card>
                    <Stack spacing={2} direction="row">
                      <Box sx={{ flexGrow: 1 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                              <Stack spacing={2} direction="column">
                                <Typography variant="h3">Score</Typography>
                                <p>+4</p>
                                <p>since yesterday</p>
                              </Stack>
                            </Grid>
                            <Grid 
                              item 
                              xs={6}
                              sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'flex-end',
                              }}
                            >
                                <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                              
                                  <CircularProgress variant="determinate" value={firstPartnerScore.condition_score}
                                    size="5.2rem"
                                  />
                                  
                                  <Box
                                    sx={{
                                      top: 0,
                                      left: 0,
                                      bottom: 0,
                                      right: 0,
                                      position: 'absolute',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                    }}
                                  >
                                    <Typography variant="caption" component="div" color="text.secondary"
                                      sx={{
                                        fontSize:'2.8rem',
                                        padding: '0',
                                        fontWeight: '700'
                                      }}
                                    >
                                      {firstPartnerScore.condition_score}
                                    </Typography>
                                  </Box>
                                </Box>
                                <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                              
                                  <CircularProgress variant="determinate" value={firstPartnerScore.sleep_score}
                                    size="3.2rem"
                                    sx={{color:'#551A8B'}}
                                  />
                                  
                                  <Box
                                    sx={{
                                      top: 0,
                                      left: 0,
                                      bottom: 0,
                                      right: 0,
                                      position: 'absolute',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                    }}
                                  >
                                    <Typography variant="caption" component="div" color="text.secondary"
                                      sx={{
                                        fontSize:'1.6rem',
                                        padding: '0',
                                        fontWeight: '700'
                                      }}
                                    >
                                      {firstPartnerScore.sleep_score}
                                    </Typography>
                                  </Box>
                                </Box>
                            </Grid>
                        </Grid>
                      </Box>

                    </Stack>

                    <Stack spacing={1} direction="row" sx={{display: 'flex', justifyContent: 'space-around'}}>
                      {partnerScores.map((score) => (
                        <Score 
                          key={score.id}
                          condition_score={score.condition_score}
                          sleep_score={score.sleep_score}
                        />
                      ))}

                    </Stack>

                    <Stack spacing={1} direction="row" sx={{mb:2, justifyContent:"right"}}>
                      <Typography variant="body2" sx={{color:"#188356"}}>condition's score</Typography>
                      <Typography variant="body2" sx={{color:"#551A8B"}}>/sleep's score</Typography>
                    </Stack>

                  </Card>
                </Grow>
            </Box>

            <Box mb={3}>
              <Grow in={drawing}>
                <Card>
                  <Typography variant="h3">Feeling</Typography>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        p: 1,
                        m: 1,
                      }}
                    >
                    {partnerFeelings.map((feeling) => (
                      <Feeling 
                        key={feeling.created_at}
                        feeling={feeling.text}
                        day={feeling.created_at}
                      />
                    ))}
                  </Box>
                </Card>
              </Grow>
            </Box>

            <Box>
              <Grow in={drawing}>
                <Card sx={{ width: '100%', height: 300}}>
                  <Typography variant="h3">Trend</Typography>
                  <RenderLineChart 
                    // user_id={3}
                    userType={"partner"}
                  />
                </Card>
              </Grow>
            </Box>

          </TabPanel>
        </Box>
        <FeelingDial/>


      </main>
    );
  }


}