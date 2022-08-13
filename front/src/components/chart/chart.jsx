import db from '../../firebase';
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  Tooltip
} from "recharts";

const RenderLineChart = (user_id) => {

    let myArray = [];
    let dataValue;

    const [Scores, setScores] = useState([]);
    const [userId, setUserId] = useState(0);

    useEffect(()=>{
        setUserId(user_id.user_id);
        console.log(userId);
        //dbから取得
        const healthScores = collection(db, "health_scores");
        const q = query(healthScores, where("user_id", "==", userId), orderBy("day", "asc"));

        getDocs(q).then((querySnapshot) => {
          myArray = [];
          querySnapshot.docs.forEach((doc) => {
                dataValue = doc.data();
                myArray.push(dataValue);
            }
          );
          setScores(myArray);
        })
    },[userId])
    
    return (
      <LineChart width={800} height={400} data={Scores}>
        <CartesianGrid strokeDasharray="3 4" />
        <XAxis dataKey="day" />
        <YAxis />
        <Legend />
        <Tooltip />
        <Line type="monotone" dataKey="condition_score" stroke="#8884d8" />
        <Line type="monotone" dataKey="sleep_score" stroke="green" />
      </LineChart>
    );
};

export default RenderLineChart;
