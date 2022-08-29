import React from "react";
import styles from "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import Addstyles from "../../Add.scss";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
    Avatar
} from "@chatscope/chat-ui-kit-react";

export const MessageContent = ({created_at, text,is_ai}) => {
    return (
        <>
                { is_ai ? 
                    <Message
                        model={{
                            message: text,
                            sentTime: created_at,
                            position: "normal",
                            direction: "outgoing"
                        }}
                    />
                :
                    <Message
                        model={{
                            message: text,
                            sentTime: created_at,
                            position: "normal",
                            direction: "incoming"
                        }}
                    />
                            }
                                        

                {/* <p>{created_at}</p>
                <p>{text}</p> */}
        </>
    )
}