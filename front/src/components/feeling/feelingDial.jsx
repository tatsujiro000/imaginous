import React, { useState } from 'react';
import Box from '@mui/material/Box';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import FileCopyIcon from '@mui/icons-material/FileCopyOutlined';
import SaveIcon from '@mui/icons-material/Save';
import PrintIcon from '@mui/icons-material/Print';
import ShareIcon from '@mui/icons-material/Share';
import db from '../../firebase';
import { collection, addDoc, serverTimestamp, increment } from "firebase/firestore";
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

    const postFeeling = (text) => {
        addDoc(collection(db, "feelings"), {
        created_at: serverTimestamp(),
        id: increment(1),
        text: text,
        user_id: profile.id
    })};    

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
      { icon: <FileCopyIcon />, name: 'Poor', do: () => switchFeeling('Poor') },
      { icon: <SaveIcon />, name: 'Average', do: () => switchFeeling('Average')},
      { icon: <PrintIcon />, name: 'Good', do: () => switchFeeling('Good') },
      { icon: <ShareIcon />, name: 'Very Good', do: () => switchFeeling('Very Good') },
      { icon: <ShareIcon />, name: 'Excellent', do: () => switchFeeling('Excellent') }
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