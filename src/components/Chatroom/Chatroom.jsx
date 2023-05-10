import { styled } from '@mui/system';
import React, { useState, useEffect } from 'react';
import Input from './Input'
import { useParams } from 'react-router-dom';
import { db } from '../../../firebase-config.js';
import { doc, getDoc, collection, query, where, onSnapshot, addDoc, serverTimestamp, orderBy } from 'firebase/firestore';

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
  '&.sent': {
    background: '#418BF6',
  },
  '&.recieved': {
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

function Chatroom() {
  const { chatroomId } = useParams();
  const [chatroom, setChatroom] = useState({});
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');

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
      setMessages(messages);
    });
    return unsubscribe;
  }, []);

  const handleSendMessage = async () => {
    if (messageInput.trim() !== '') {
      const user = 'John Doe'; // Replace this with your authentication logic to get the current user
      await addDoc(messagesRef, {
        text: messageInput,
        user,
        timestamp: serverTimestamp(),
      });
      setMessageInput('');
    }
  };

  return (
    <ChatroomContainer>
      <ChatroomHeader>
          <div className='header'>
            <h2>{chatroom.title}</h2>
          </div>
          <MessagesContainer>
            {messages.map((message, index) => (
              <MessageWrapper key={index} className={message.user === 'KathyJ' ? 'sent' : 'received'}>
                <MessageText>{message.text}</MessageText>
                <MessageUser>{message.user}</MessageUser>
              </MessageWrapper>
            ))}
        </MessagesContainer>
        <InputWrapper>
          <Input />
        </InputWrapper>
      </ChatroomHeader>
    </ChatroomContainer>
    )
}

export default Chatroom;