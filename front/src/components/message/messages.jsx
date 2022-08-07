import styles from '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { MainContainer, ChatContainer, MessageList, Message, MessageInput } from '@chatscope/chat-ui-kit-react';

    const Messages = () => {
        return (
            <div style={{ position:"relative", height: "500px" }}>
                <MainContainer>
                    <ChatContainer>       
                        <MessageList>
                            <Message model={{
                                    message: "Hello my friend",
                                    sentTime: "just now",
                                    sender: "Joe",
                                    direction: "outgoing"
                                    }} />
                            <Message model={{
                                    message: "Hello my friend",
                                    sentTime: "just now",
                                    sender: "me",
                                    direction: "incoming",
                                    }}>
                            </Message>

                            <Message model={{
                                    message: "Hello my friend",
                                    sentTime: "just now",
                                    sender: "Joe",
                                    direction: "outgoing"
                                    }} />
                        </MessageList>
                    <MessageInput 
                        placeholder="Type message here"
                        attachButton={false}
                    />        
                    </ChatContainer>
                </MainContainer>
            </div>
        )
    }

export default Messages;
