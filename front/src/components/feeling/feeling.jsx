import React from "react";
import PoorImage from '../../images/poor.png';
import AverageImage from '../../images/average.png';
import GoodImage from '../../images/good.png';
import VerygoodImage from '../../images/verygood.png';
import ExcellentImage from '../../images/excellent.png';
import Stack from '@mui/material/Stack';

export default function Feeling({feeling, day}) {
    //追加
    let date = day.toDate();
    const formatDate = (date)=>{
        let formatted_date = (date.getMonth() + 1) + '/' + date.getDate() 
        return formatted_date;
    }
    // console.log(formatDate(date));
    // console.log(day);


    switch(feeling) {
        case 'Poor':
            return (
                <Stack spacing={0.5} direction="column" sx={{textAlign:'center'}}>
                    <img src={PoorImage} alt="Image" width="60px" height="60px"/>
                    <p>{formatDate(date)}</p>
                </Stack>
            );
        case 'Average':
            return (
                <Stack spacing={0.5} direction="column" sx={{textAlign:'center'}}>
                    <img src={AverageImage} alt="Image" width="60px" height="60px"/>
                    <p>{formatDate(date)}</p>
                </Stack>
            );
        case 'Good':
            return (
                <Stack spacing={0.5} direction="column" sx={{textAlign:'center'}}>
                    <img src={GoodImage} alt="Image" width="60px" height="60px"/>
                    <p>{formatDate(date)}</p>
                </Stack>
            );
        case 'Very Good':
            return (
                <Stack spacing={0.5} direction="column" sx={{textAlign:'center'}}>
                    <img src={VerygoodImage} alt="Image" width="60px" height="60px"/>
                    <p>{formatDate(date)}</p>
                </Stack>
            );
        case 'Excellent':
            return (
                <Stack spacing={0.5} direction="column" sx={{textAlign:'center'}}>
                    <img src={ExcellentImage} alt="Image" width="60px" height="60px"/>
                    <p>{formatDate(date)}</p>
                </Stack>
            );
    }

   
}