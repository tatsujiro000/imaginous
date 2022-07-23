import db from '../firebase.js';
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import React, { useState, useEffect } from 'react';
import Event from '../components/event';
import { useNavigate, Navigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import { useAuthContext } from '../context/authContext';



export default function Top() {
    const [events, setEvents] = useState([]);
    const navigate = useNavigate();
    const { user } = useAuthContext();

    const handleLogout = () => {
      const auth = getAuth();
      auth.signOut();
      navigate('/login');
    };

    

    useEffect(() => {
      const eventsData = collection(db, "events");
      const q = query(eventsData, orderBy("day", "desc"));
      getDocs(q).then((querySnapshot) => {
        setEvents(querySnapshot.docs.map((doc) =>doc.data()));
      });
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

      </main>
      );
    }


}