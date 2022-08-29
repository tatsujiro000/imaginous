import db from '../../firebase';
import { useState, useEffect, useLayoutEffect } from "react"
import { collection, doc, getDoc, onSnapshot, query, orderBy, where } from "firebase/firestore";
import { MessageContent } from './messageContent';
import { MessageSubmit } from './messageSubmit';
import { format } from "date-fns"

import { useAuthContext } from '../../context/authContext';
import UserId from '../userinfo/userId';

import {
    MainContainer,
    ChatContainer,
    MessageList,
    Message,
  } from "@chatscope/chat-ui-kit-react";
import Box from '@mui/material/Box';
import Addstyles from "../../Add.scss";




const Messages = () => {

    const { user, userId } = useAuthContext();
    console.log("useContextのuserId",userId)
    const [messages, setMessages] = useState([])
    // const [userId, setUserId] = useState();


    // const GetUserId = async() => {
    //     const uid = user.uid;
    //     const docRef = doc(db, "users", uid);
    //     const docSnap = await getDoc(docRef);
    //     const docData = docSnap.data();
    //     setUserId(docData.id);
    // }

    useEffect(() => {

            if(!userId){
                return;
            }
            const docRef = collection(db, "messages");
            const queryRef = query(docRef, where("user_id", "==", userId), orderBy("created_at"))
            const unsub = onSnapshot(queryRef, snapshot => {
            let results = [];
            snapshot.docs.forEach(doc => {
                results.push({ ...doc.data(), id: doc.id })
                setMessages(results)
            })
            })
            return () => unsub()


    },[userId])
    

    return (
        <>
            <Box sx={{ flexGrow: 1, pb: 5}}>
                <MainContainer style={{backgroundColor: 'transparent', border: 'none'}}>
                    <ChatContainer style={{backgroundColor: 'transparent'}}>
                        <MessageList style={{backgroundColor: 'transparent'}}>
                            {messages ? (
                                messages.map((message) => (
                                    message.is_ai ? 
                                        <Message
                                            model={{
                                                message: message.text,
                                                sentTime: message.created_at,
                                                position: "normal",
                                                direction: "incoming"
                                            }}
                                        />
                                    :
                                        <Message
                                            model={{
                                                message: message.text,
                                                sentTime: message.created_at,
                                                position: "normal",
                                                direction: "outgoing"
                                            }}
                                        />
                                ))

                            ): (
                                <p>メッセージが存在しません</p>
                            )}

                            {/* {messages ? (
                                messages.map((message) => (
                                    <MessageContent
                                        text={message.text}
                                        created_at={format(message.created_at.toDate(), "yyyy年MM月dd日")}
                                        is_ai={message.is_ai}
                                    />
                                ))
                            ) : (
                                <p>メッセージが存在しません</p>
                            )} */}
                        </MessageList>
                    </ChatContainer>
                </MainContainer>
            </Box>
            <MessageSubmit />
        </>
    )
}

export default Messages;