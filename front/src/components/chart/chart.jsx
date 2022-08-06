import db from '../../firebase';
import { collection, getDocs, orderBy, query } from "firebase/firestore";
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

const RenderLineChart = () => {

    //dbから取得
    const healthScores = collection(db, "health_scores");
    const q = query(healthScores, orderBy("day", "asc"));
    let myArray = [];
    let dataValue;

    const [myScores, setmyScores] = useState([]);

    useEffect(()=>{
        getDocs(q).then((querySnapshot) => {
          myArray = [];
          querySnapshot.docs.forEach((doc) => {
                dataValue = doc.data();
                myArray.push(dataValue);
            }
          );
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
