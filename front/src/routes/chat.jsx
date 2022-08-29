import Messages from "../components/message/messages";
import Typography from '@mui/material/Typography';

export default function Chat() {

    return (
      <main style={{ padding: "1rem 0" }}>
        <Typography variant="h3">Chat</Typography>

        <Messages />
      </main>
    );
}

