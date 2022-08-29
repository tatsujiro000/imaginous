import React, {useState} from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import SendIcon from '@mui/icons-material/Send';
import { collection, addDoc, Timestamp } from "firebase/firestore";
import db from '../../firebase';
import UserInfo from "../userinfo/userinfo";


export const MessageSubmit = () => {
    const userProfile = UserInfo();
    const profile = userProfile.userinfo;

    const [message, setMessage] = useState("")
    const [error, setError] = useState(false)

    const handleClick = async () => {
        setError(false);
        // 空文の場合は送信しない
        if (message === "") {
            setError(true)
            return
        }

        try {
            const docRef = collection(db, "messages");
            await addDoc(docRef, {
                text: message,
                created_at: Timestamp.fromDate(new Date()),
                is_ai: false,
                user_id:profile.id,
            })



            const response = await fetch("http://localhost:5002/imaginous/asia-northeast1/post_openai", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ message: message }),
              });
            const data = await response.json();
            console.log("POSTのresult", data.result);

            if(data.result === ""){
                return;
            }
            //AIからの返答をDBに書き込む
            await addDoc(docRef, {
                text: data.result,
                created_at: Timestamp.fromDate(new Date()),
                is_ai: true,
                user_id:profile.id,
            })

        } catch (error) {
            setError(false)
            console.log(error);
            setError(true);
        } 
    }

    
        


    return (
        <>
            <Box
            sx={{
                position: "fixed",
                bottom: 0,
                zIndex: 999,
                width: "100%",
                backgroundColor: "#edeef1"
            }}
            >
            {
                error && <Alert severity="error">送信できませんでした</Alert>
            }
            <Stack direction="row" spacing={2} sx={{ margin: "0.5rem 1rem" }}>
                <TextField fullWidth name="message" value={message} variant="standard" size="small" sx={{ flex: 1 }} onChange={e => setMessage(e.target.value)}/>
                <Button variant="contained"  endIcon={<SendIcon />}  onClick={() => handleClick()}>
                    送信
                </Button>
            </Stack>
            </Box>
        </>
      )
}
