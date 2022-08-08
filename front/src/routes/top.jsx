import db from '../firebase.js';
import { collection, getDocs, orderBy, query, limit } from "firebase/firestore";
import React, { useState, useEffect } from 'react';
import Event from '../components/event';
import Score from '../components/score/score';
import RenderLineChart  from '../components/chart/chart';
import { useNavigate, Navigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import { useAuthContext } from '../context/authContext';
import Stack from '@mui/material/Stack';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';

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
        <Box sx={{ p: 3 }}>
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
  const [events, setEvents] = useState([]);
  const [scores, setScores] = useState([]);
  const [value, setValue] = useState(0);

  const navigate = useNavigate();
  const { user } = useAuthContext();


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
    //events
    const eventsData = collection(db, "events");
    const q = query(eventsData, orderBy("day", "desc"), limit(3));
    getDocs(q).then((querySnapshot) => {
      setEvents(querySnapshot.docs.map((doc) =>doc.data()));
    });

    //scores
    const myScores = collection(db, "health_scores");
    const queryScore = query(myScores, orderBy("day", "desc"), limit(5));
    getDocs(queryScore).then((querySnapshot) => {
      setScores(querySnapshot.docs.map((doc) =>doc.data()));
    })

  },[]);


  if (!user) {
    return <Navigate to="/login" />;
  } else {
    return (

      <main style={{ padding: "1rem 0" }}>
                <button onClick={handleLogout}>ログアウト</button>

        <h2>Top</h2>
        <div>
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
        </div>


        <h3>Score</h3>

        <Box sx={{ width: '100%' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
              <Tab label="Me" {...a11yProps(0)} />
              <Tab label="Partner" {...a11yProps(1)} />
            </Tabs>
          </Box>
          <TabPanel value={value} index={0}>
              <Stack spacing={2} direction="row">
                {scores.map((score) => (
                  <Score 
                    key={score.id}
                    condition_score={score.condition_score}
                    sleep_score={score.sleep_score}
                  />
                ))}
              </Stack>
          </TabPanel>
          <TabPanel value={value} index={1}>
            Partner
          </TabPanel>
        </Box>


        
        <div>
          <h3>Feeling</h3>
        </div>
        <div>
          <h3>Trend</h3>
            <RenderLineChart 
         />
            
        </div>

      </main>
    );
  }


}