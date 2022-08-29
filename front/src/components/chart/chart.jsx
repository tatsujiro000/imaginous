import db from '../../firebase';
import { collection, getDocs, limit, orderBy, query, where } from "firebase/firestore";
import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import { add, format, differenceInCalendarDays, isFuture } from "date-fns";

import { useAuthContext } from '../../context/authContext';
import moment from 'moment';


const RenderLineChart = (props) => {


    const { userId, partnerId } = useAuthContext();
    //partnerIdはuseContextで定義

    let myArray = [];
    let dataValue;

    const [Scores, setScores] = useState([]);
    // const [userId, setUserId] = useState(0);


    useEffect(()=>{
        // setUserId(user_id.user_id);
        //dbから取得
        const healthScores = collection(db, "health_scores");
        //条件分岐でuserId or PartnerId↓
        let userTypeId = "";
        if(props.userType == "own"){
          userTypeId = userId;
        } else if(props.userType == "partner") {
          userTypeId = partnerId;
        }
        if(userTypeId === ""){
          return;
        }
        console.log("userTypeId",userTypeId)
        const q = query(healthScores, where("user_id", "==", userTypeId), orderBy("day", "asc"),limit(14));


        getDocs(q).then((querySnapshot) => {
          myArray = [];
          querySnapshot.docs.forEach((doc) => {
                dataValue = doc.data();
                myArray.push(dataValue);
            }
          );
          setScores(myArray);
        })
    },[userId,partnerId])
    
    return (
      <ResponsiveContainer width="90%" height="80%">
        <LineChart data={Scores}>
          <CartesianGrid strokeDasharray="4 5" />
          <XAxis 
            dataKey="day"
            // tickFormatter={(unixTime) => new Date(unixTime).toLocaleDateString()}
            tickFormatter={(unixTime) => moment(unixTime).format('MM/DD')}
          />
          <YAxis />
          <Legend />
          <Tooltip />
          <Line type="monotone" dataKey="condition_score" stroke="#8884d8" />
          <Line type="monotone" dataKey="sleep_score" stroke="green" />
        </LineChart>
      </ResponsiveContainer>
    );
};

export default RenderLineChart;
