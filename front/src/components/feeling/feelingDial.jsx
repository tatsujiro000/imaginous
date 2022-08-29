import React, { useState } from 'react';
import Box from '@mui/material/Box';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import FileCopyIcon from '@mui/icons-material/FileCopyOutlined';
import SaveIcon from '@mui/icons-material/Save';
import PrintIcon from '@mui/icons-material/Print';
import ShareIcon from '@mui/icons-material/Share';

import PoorImage from '../../images/poor.png';
import AverageImage from '../../images/average.png';
import GoodImage from '../../images/good.png';
import VerygoodImage from '../../images/verygood.png';
import ExcellentImage from '../../images/excellent.png';

import db from '../../firebase';
import { collection, addDoc, serverTimestamp, increment, query, where, getDocs, doc, setDoc } from "firebase/firestore";
import UserInfo from "../userinfo/userinfo";




export default function FeelingDial() {

    const [status, setStatus] = useState({
        direction: "up",
        open: false,
        hidden: false
    });

    const userProfile = UserInfo();
    const profile = userProfile.userinfo;

    
    const handleClick = () => {
        setStatus(status => ({ ...status, open: !status.open }));
    };

    const handleClose = () => {
        setStatus(status => ({ ...status, open: false }));
    };

    const postFeeling = async (text) => {
      const moment = require('moment');
      let m = moment();
      const today = m.format("YYYY-MM-DD");

      const checkQuery = query(collection(db, "feelings"), where("day", "==", today));
      const checkQuerySnapshot = await getDocs(checkQuery);
      if(checkQuerySnapshot.docs.length  === 0){
          addDoc(collection(db, "feelings"), {
            created_at: serverTimestamp(),
            day: today,
            text: text,
            user_id: profile.id
          })
      }else{
        checkQuerySnapshot.forEach((document) => {
          
          setDoc(doc(db, "feelings", document.id), {
            text: text,
            created_at: serverTimestamp(),
            day: today,
            user_id: profile.id
          }, { merge: true });
        });
      }
  };    

    const switchFeeling = which => {
        switch (which){
            case "Poor":
                postFeeling("Poor");
                break;
            case "Average":
                postFeeling("Average");
                break;
            case "Good":
                postFeeling("Good");
                break;
            case "Very Good":
                postFeeling("Very Good");
                break;
            case "Excellent":
                postFeeling("Excellent");
                break;
            default:
                break;
    
            }
    }
    const actions = [
      { icon: <img src={PoorImage} width="30px" height="30px"/>, name: 'Poor', do: () => switchFeeling('Poor') },
      { icon: <img src={AverageImage} width="30px" height="30px"/>, name: 'Average', do: () => switchFeeling('Average')},
      { icon: <img src={GoodImage} width="30px" height="30px"/>, name: 'Good', do: () => switchFeeling('Good') },
      { icon: <img src={VerygoodImage} width="30px" height="30px"/>, name: 'Very Good', do: () => switchFeeling('Very Good') },
      { icon: <img src={ExcellentImage} width="30px" height="30px"/>, name: 'Excellent', do: () => switchFeeling('Excellent') }
    ];

  return (
    <Box sx={{ transform: 'translateZ(0px)', flexGrow: 1 }}>
      <SpeedDial
        ariaLabel="Speed example"
        sx={{ position: 'absolute', bottom: 16, right: 16 }}
        icon={<SpeedDialIcon />}
        hidden={status.hidden}
        onClick={handleClick}
        onClose={handleClose}
        onMouseLeave={handleClose}
        open={status.open}
        direction={status.direction}
      >
        {actions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            onClick={action.do}
          />
        ))}
      </SpeedDial>
    </Box>
  );
}