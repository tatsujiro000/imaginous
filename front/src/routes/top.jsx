import db from '../firebase.js';
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import React, { useState, useEffect } from 'react';
import Event from '../components/event'; 

export default function Top() {
    const [events, setEvents] = useState([]);

    useEffect(() => {
      const eventsData = collection(db, "events");
      const q = query(eventsData, orderBy("day", "desc"));
      getDocs(q).then((querySnapshot) => {
        setEvents(querySnapshot.docs.map((doc) =>doc.data()));
      });
    },[]);

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
      </main>
    );
}