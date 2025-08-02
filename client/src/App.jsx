import React, { useEffect, useRef, useState } from 'react';
import { io } from "socket.io-client";
import {
  Container,
  TextField,
  Typography,
  Button,
  Box,
  Stack,
  Paper
} from '@mui/material';

const App = () => {
  const socket = useRef(null);
  const [message, setMessage] = useState("");
  const [user, setUser] = useState("");
  const [messages, setMessages] = useState([]);
  const[room,setRoom] = useState("");
  const[displayroom,setDisplayroom] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!message) return;
    socket.current.emit("message", { message, toUser: user });
    setMessages(prev => [...prev, { from: "You", msg: message }]);
    setMessage("");
  }

  function handleRoomSubmit(e){
    e.preventDefault();
    if(!room) return;
    socket.current.emit("setroom",room);
    setDisplayroom(room);
    setRoom('');
  }

  function sendToRoom(e) {
  e.preventDefault();
  if (!message || !displayroom) return;
  socket.current.emit("room-message", { room: displayroom, msg: message });
  setMessages(prev => [...prev, { from: "You (Room)", msg: message }]);
  setMessage("");
}

  useEffect(() => {
    socket.current = io("http://localhost:3000");

    socket.current.on("connect", () => {
      console.log("Connected", socket.current.id);
    });

    socket.current.on("welcome", (sid) => {
      console.log("Welcome Received to " + sid);
    });

    socket.current.on("recieved", ({ from, msg }) => {
      setMessages(prev => [...prev, { from, msg }]);
    });

      }, []);

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
  🔌 Socket Chat
      </Typography>

  {displayroom && (
    <Typography variant="subtitle1" align="center" color="primary" gutterBottom>
      🏠 Joined Room: <strong>{displayroom}</strong>
    </Typography>
  )}

      <form onSubmit={handleRoomSubmit}>
      <input type="text" placeholder='Enter Room To Join' onChange={(e)=>{
        setRoom(e.target.value);
      }} value={room}/> 
      <button type="submit" disabled={!room.trim()}>
        Join Room
        </button>      
      </form>
      <Box component="form" onSubmit={handleSubmit} sx={{ mb: 3 }}>
        <Stack spacing={2}>
          <TextField
            label="Receiver Socket ID"
            fullWidth
            value={user}
            onChange={(e) => setUser(e.target.value)}
            placeholder="Enter socket ID to send message"
          />
          <TextField
            label="Message"
            fullWidth
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message here..."
          />
          <Button variant="contained" type="submit">
            Send
          </Button>
          <Button variant="outlined" onClick={sendToRoom}>
        Send to Room  
        </Button>

        </Stack>
      </Box>

      <Typography variant="h6" gutterBottom>
        📬 Messages
      </Typography>

      <Stack spacing={1}>
        {messages.map((m, i) => (
          <Paper key={i} sx={{ p: 1.5 }}>
            <Typography variant="body2" color="text.secondary">
              From: {m.from}
            </Typography>
            <Typography>{m.msg}</Typography>
          </Paper>
        ))}
      </Stack>
    </Container>
  );
};

export default App;
