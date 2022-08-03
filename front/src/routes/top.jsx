import db from '../firebase.js';
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import React, { useState, useEffect } from 'react';
import Event from '../components/event';
import Score from '../components/score';
import { useNavigate, Navigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import { useAuthContext } from '../context/authContext';



export default function Top() {
  const [events, setEvents] = useState([]);
  const [scores, setScores] = useState([]);
  const navigate = useNavigate();
  const { user } = useAuthContext();

  const handleLogout = () => {
    const auth = getAuth();
    auth.signOut();
    navigate('/login');
  };

  useEffect(() => {
    //events
    const eventsData = collection(db, "events");
    const q = query(eventsData, orderBy("day", "desc"));
    getDocs(q).then((querySnapshot) => {
      setEvents(querySnapshot.docs.map((doc) =>doc.data()));
    });

    //score
    const myScores = collection(db, "health_scores");
    getDocs(myScores).then((querySnapshot) => {
      setScores(querySnapshot.docs.map((doc) =>doc.data()));
    })

  },[]);


  if (!user) {
    return <Navigate to="/login" />;
  } else {
    return (
      <main style={{ padding: "1rem 0" }}>
        <h2>Top</h2>
        <div>
          {events.map((event) => (
            <Event 
              key={event.id}
              id={event.id}
              day={event.day}
              title={event.title}
            />
            ))}
        </div>
        <button onClick={handleLogout}>ログアウト</button>
        <div>
          <h3>Score</h3>
          {scores.map((score) => (
            <Score 
              key={score.id}
              condition_score={score.condition_score}
              sleep_score={score.sleep_score}
            />
          ))}
        </div>
        <div>
          <h3>Feeling</h3>

        </div>

      </main>
    );
  }


}