import React,{ useState, useEffect } from "react";
import db from '../../firebase';
import { doc, setDoc } from "firebase/firestore";
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Button from '@mui/material/Button';
import axios from "axios";
import { useAuthContext } from '../../context/authContext';

const baseURL = "https://notify-bot.line.me/oauth/token";


export const LineAuthLink = () => {

    const { user } = useAuthContext();


    const [postResullts, setPostResullts] = useState("");

    const getAcesstoken = () => {
        const uid = user.uid;
        const userRef = doc(db, 'users', uid);
    
        axios.post(baseURL, {
            "grant_type": "authorization_code",
            "code": 123,
            "redirect_uri": "tatsuyaoshikiri.work",
            "client_id": process.env.LINE_CLIENT_ID,
            "client_secret": process.env.LINE_CLIENT_SECRET,
        }).then((response) => {
            console.log(response.data())
            // setPostResullts(response.data);
        });
    }

    return (
        <>
            <Box
                sx={{
                    typography: 'body1',
                    '& > :not(style) + :not(style)': {
                    ml: 2,
                    },
                }}
                >
                    下記のリンクにアクセスすると、imaginousからのLINE通知を受け取ることができます。
                <Link href="https://notify-bot.line.me/oauth/authorize?response_type=code&client_id=uvThqlJZgBwlwRXYZ7RnSZ&redirect_uri=https://asia-northeast1-imaginous.cloudfunctions.net/get_response_json&scope=notify&state=imaginous">LINEの通知を受け取る</Link>
            </Box>
        </>
    )
}



