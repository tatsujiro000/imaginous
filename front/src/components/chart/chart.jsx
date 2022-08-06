import db from '../../firebase';
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  Tooltip
} from "recharts";
import { useState, useEffect } from 'react';

const RenderLineChart = () => {

    //dbから取得
    const healthScores = collection(db, "health_scores");
    const q = query(healthScores, orderBy("day", "asc"));
    let myArray = [];
    let dataValue;
    //mapで回す

const [myScores, setmyScores] = useState([]);

useEffect(()=>{
    getDocs(q).then((querySnapshot) => {
      myArray = [];
      querySnapshot.docs.map(
        (doc) => {
            dataValue = doc.data();
            myArray.push(dataValue);
        }
      );
      console.log("111",myArray);
      setmyScores(myArray);
    })
},[])
    
  return (
    <LineChart width={800} height={400} data={myScores}>
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
