import { useState, useEffect } from "react"
import { collection, onSnapshot, query, orderBy, where } from "firebase/firestore";
import { MessageContent } from './messageContent';
import { MessageSubmit } from './messageSubmit';
import { format } from "date-fns"

import Box from '@mui/material/Box';
import db from '../../firebase';


const Messages = () => {

    const [messages, setMessages] = useState([])

    useEffect(() => {
        const docRef = collection(db, "messages");
        const queryRef = query(docRef, where("user_id", "==", 1), orderBy("created_at"))
        const unsub = onSnapshot(queryRef, snapshot => {
        let results = [];
        snapshot.docs.forEach(doc => {
            results.push({ ...doc.data(), id: doc.id })
            setMessages(results)
        })
        })
        return () => unsub()
    }, [])

    return (
        <>
            <Box sx={{ flexGrow: 1 }}>

                {messages ? (
                    messages.map((message) => (
                    <div key={message.id}
                    >
                        <MessageContent
                            text={message.text}
                            created_at={format(message.created_at.toDate(), "yyyy年MM月dd日")}
                        />
                    </div>
                    ))
                ) : (
                    <p>メッセージが存在しません</p>
                )}
            </Box>
            <MessageSubmit />
        </>
    )
}

export default Messages;