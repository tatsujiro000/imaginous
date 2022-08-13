import React, {useState} from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import SendIcon from '@mui/icons-material/Send';
import { collection, addDoc, Timestamp, increment } from "firebase/firestore";
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
                id: increment(1),
                is_ai: false,
                user_id:profile.id,
            })
        } catch (error) {
            setError(false)
            console.log(error);
            setError(true);
        } finally{

        }
    }

    return (
        <>
            <Box
            sx={{
                position: "fixed",
                bottom: 0,
                width: "600px",
            }}
            >
            {
                error && <Alert severity="error">送信できませんでした</Alert>
            }
            <Divider />
            <Stack direction="row" spacing={2} sx={{ margin: "0.5rem 1rem" }}>
                <TextField size="small" sx={{ flex: 1 }} onChange={e => setMessage(e.target.value)}/>
                <Button variant="contained" endIcon={<SendIcon />}  onClick={() => handleClick()}>
                    送信
                </Button>
            </Stack>
            </Box>
        </>
      )
}
