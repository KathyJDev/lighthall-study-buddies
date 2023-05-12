import { styled } from '@mui/system';
import React, { useState, useEffect } from 'react';
import Input from './Input'
import { useParams } from 'react-router-dom';
import { getAuth } from "firebase/auth";
import { db } from '../../../firebase-config.js';
import { doc, getDoc, collection, query, where, onSnapshot, addDoc, serverTimestamp, orderBy } from 'firebase/firestore';
import LogoutIcon from '@mui/icons-material/Logout';
import ShareIcon from '@mui/icons-material/Share';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

const ChatroomContainer = styled('div')({
  borderRadius: '20px',
  border: '2px solid #E0ECFF',
  position: 'absolute',
  width: '85vw',
  height: '95vh',
  left: '50%',
  top: '50%',
  transform: 'translate(-50%, -50%)',
});

const ChatroomHeader = styled('div')({
  width: '100%',
  height: '10%',
  background: '#418BF6',
});

const MessagesContainer = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  height: '65vh',
  width: '85vw',
  overflowY: 'scroll',
  padding: '16px',
});

const MessageWrapper = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  marginBottom: '8px',
  '&.sent': {
    alignItems: 'flex-end',
  },
});

const MessageText = styled('p')({
  background: '#E0ECFF',
  padding: '8px',
  borderRadius: '8px',
  maxWidth: '60%',
  '.sent &': {
    background: '#418BF6',
    color: '#FFFFFF',
  },
  '.received &': {
    background: '#E0ECFF',
  },
});

const MessageUser = styled('span')({
  color: '#B0B0B0',
  fontSize: '12px',
  marginTop: '4px',
});

const InputWrapper = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
});

const LeaveIcon = styled(LogoutIcon)({
  background: '#E34543',
  color: '#FFFFFF',
  height: '2rem',
  width: '2rem',
  borderRadius: '5px',
  marginLeft: 'auto',
  padding: '4px',
});

const ShareIconStyled = styled(ShareIcon)({
  background: '#418BF6',
  color: '#FFFFFF',
  height: '2rem',
  width: '2rem',
  borderRadius: '5px',
  marginLeft: '8px',
  padding: '4px',
});

function Chatroom() {
  const { chatroomId } = useParams();
  const [chatroom, setChatroom] = useState({});
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [open, setOpen] = useState(false);
  const auth = getAuth();
  const user = auth.currentUser;

  const chatroomRef = doc(db, "chatrooms", chatroomId);
  const messagesRef = collection(chatroomRef, "messages");

  useEffect(() => {
    const getChatroom = async () => {
      const docSnap = await getDoc(chatroomRef);
      if (docSnap.exists()) {
        setChatroom(docSnap.data());
      } else {
        console.log("No such document!");
      }
    }
    getChatroom();
  }, [])

  useEffect(() => {
    const messagesQuery = query(messagesRef, orderBy('timestamp', 'asc'));
    const unsubscribe = onSnapshot(messagesQuery, (querySnapshot) => {
      const messages = [];
      querySnapshot.forEach((doc) => {
        messages.push(doc.data());
      });
      if (unsubscribe) {
        setMessages(messages);
      }
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const handleSendMessage = async () => {
    if (messageInput.trim() !== '') {
      await addDoc(messagesRef, {
        text: messageInput,
        user: user.username,
        timestamp: serverTimestamp(),
      });
      setMessageInput('');
    }
  };

  function navigateToDashboard() {
    window.location.href = `/dashboard`;
  }

  function handleOpen(){
    setOpen(true);
  }

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
    <ChatroomContainer>
      <ChatroomHeader>
          <div className='header'>
            <h2>{chatroom.title}</h2>
            <LeaveIcon cursor='pointer' onClick={navigateToDashboard}/>
            <ShareIconStyled cursor='pointer' onClick={handleOpen} />
          </div>
          <MessagesContainer>
            {messages.map((message, index) => (
              <MessageWrapper key={index} className={message.user === user.username ? 'sent' : 'received'}>
                <MessageText>{message.text}</MessageText>
                <MessageUser>{message.user}</MessageUser>
              </MessageWrapper>
            ))}
        </MessagesContainer>
        <InputWrapper>
        <Input value={messageInput} onChange={(e) => setMessageInput(e.target.value)} onSend={handleSendMessage} />
        </InputWrapper>
      </ChatroomHeader>
    </ChatroomContainer>
    <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        sx={{ minWidth: 400 }}
        >
        <DialogTitle id="alert-dialog-title">{"Share Chatroom"}</DialogTitle>
        <DialogContent>
            <DialogContentText id="alert-dialog-description">
            Share this code with your friends to invite them to join this chatroom!
            </DialogContentText>
            <Typography level="h6" sx={{ fontSize: '2rem', fontWeight:"600", color:"#23286B"}} mb={0.5}>
                {chatroom.joinCode}
            </Typography>
        </DialogContent>
        </Dialog>
    </>
    )
}

export default Chatroom;
