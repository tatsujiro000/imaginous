import db from '../firebase.js';
import { collection, getDocs, orderBy, query, limit, where } from "firebase/firestore";
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
  const [myScores, setMyScores] = useState([]);
  const [partnerScores, setPartnerScores] = useState([]);
  const [myFeelings, setMyFeelings] = useState([]);
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
    const scoresData = collection(db, "health_scores");
    const myScores = query(scoresData, where("user_id", "==", 1), orderBy("day", "desc"), limit(5));
    getDocs(myScores).then((querySnapshot) => {
      setMyScores(querySnapshot.docs.map((doc) =>doc.data()));
    })
    //partner_scores
    const partnerScores = query(scoresData, where("user_id", "==", 3), orderBy("day", "desc"), limit(5));
    getDocs(partnerScores).then((querySnapshot) => {
      setPartnerScores(querySnapshot.docs.map((doc) =>doc.data()));
    })

    //feelings
    const feelingsData = collection(db, "feelings");
    const myFeelings = query(feelingsData, where("user_id", "==", 1), orderBy("created_at", "desc"), limit(5));
    getDocs(myFeelings).then((querySnapshot) => {
      setMyFeelings(querySnapshot.docs.map((doc) =>doc.data()));
    });
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
                {myScores.map((score) => (
                  <Score 
                    key={score.id}
                    condition_score={score.condition_score}
                    sleep_score={score.sleep_score}
                  />
                ))}
              </Stack>
              <Box>
                <h3>Feeling</h3>
                <Stack spacing={2} direction="row">
                {myFeelings.map((feeling) => (
                  <Score 
                    key={feeling.id}
                    condition_score={feeling.text}
                  />
                ))}
              </Stack>
              </Box>
              <Box>
                <h3>Trend</h3>
                  <RenderLineChart 
                  user_id={1}
              />
              </Box>

          </TabPanel>


          {/* Partner Area*/}
          <TabPanel value={value} index={1}>
            <Stack spacing={2} direction="row">
                {partnerScores.map((score) => (
                  <Score 
                    key={score.id}
                    condition_score={score.condition_score}
                    sleep_score={score.sleep_score}
                  />
                ))}
              </Stack>
              <Box>
                <h3>Feeling</h3>
              </Box>

              <Box>
                <h3>Trend</h3>
                  <RenderLineChart 
                    user_id={3}
                  />
              </Box>
          </TabPanel>
        </Box>

      </main>
    );
  }


}