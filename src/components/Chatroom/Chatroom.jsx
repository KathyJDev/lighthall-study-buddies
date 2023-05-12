import { styled } from '@mui/system';
import React, { useState, useEffect } from 'react';
import Input from './Input'
import { useParams } from 'react-router-dom';
import { getAuth } from "firebase/auth";
import { db, storage } from '../../../firebase-config.js';
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
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { AnimatePresence, motion } from 'framer-motion';

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
  height: '75vh',
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
  '& img': {
    maxWidth: '400px',
    height: 'auto',
    borderRadius: '8px',
    float: 'right',
  },
  '& video': {
    maxWidth: '400px',
    height: 'auto',
    borderRadius: '8px',
    float: 'right',
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

function Message({ message, currentUser }) {
  const { text, user, fileURL, fileName, fileType } = message;
  const isSent = currentUser === user;
  const messageClass = isSent ? 'sent' : 'received';

  return (
    <MessageWrapper className={messageClass}>
      <MessageText>
        {text}
        {fileType === 'image' && <img src={fileURL} alt={fileName} />}
        {fileType === 'video' && (
          <video controls>
            <source src={fileURL} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        )}
        {fileType !== 'image' && fileType !== 'video' && (
          <a href={fileURL} download={fileName}>
            {fileName}
          </a>
        )}
      </MessageText>
      <MessageUser>{user}</MessageUser>
    </MessageWrapper>
  );
}

function Chatroom() {
  const { chatroomId } = useParams();
  const [chatroom, setChatroom] = useState({});
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [username, setUsername] = useState('');
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
    if (user) {
      const getUser = async () => {
        const userRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
          setUsername(docSnap.data().username);
        } else {
          console.log("No such document!");
        }
      };
      getUser();
    }
  }, [user]);


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
        user: username,
        timestamp: serverTimestamp(),
      });
      setMessageInput('');
    }
  };

  const handleFileInputChange = async (e) => {
    const file = e.target.files[0];
    const storageRef = ref(storage, 'chatroom-files/' + file.name);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
  
    await addDoc(messagesRef, {
      text: '',
      user: username,
      timestamp: serverTimestamp(),
      fileURL: downloadURL,
      fileName: file.name,
      fileType: file.type.split('/')[0],
    });
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

  const handleCloseMenu = () => {
    setMenuOpen(false);
  };
  const handleClickMenu = (event) => {
    setAnchorEl(event.currentTarget);
    setMenuOpen(true);
  };

  return (
    <>
    <ChatroomContainer>
      <ChatroomHeader>
          <motion.div 
          className='header'
          initial={{ y: -50 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5 }}
          >
            <h2>{chatroom.title}</h2>
            <LeaveIcon cursor='pointer' onClick={navigateToDashboard}/>
            <ShareIconStyled cursor='pointer' onClick={handleOpen} />
          </motion.div>
          <MessagesContainer>
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <Message message={message} currentUser={username} />
                </motion.div>
              ))}
            </AnimatePresence>
        </MessagesContainer>
        <InputWrapper>
          <IconButton onClick={handleClickMenu} color='primary'> <AttachFileIcon /> </IconButton>
          <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={menuOpen}
              onClose={handleCloseMenu}
              MenuListProps={{
                'aria-labelledby': 'basic-button',
              }}
            >
              <MenuItem>
                <label htmlFor="image-input">Image</label>
                <input
                  id="image-input"
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleFileInputChange}
                />
              </MenuItem>
              <MenuItem>
                <label htmlFor="video-input">Video</label>
                <input
                  id="video-input"
                  type="file"
                  accept="video/*"
                  style={{ display: 'none' }}
                  onChange={handleFileInputChange}
                />
              </MenuItem>
              <MenuItem>
                <label htmlFor="file-input">File</label>
                <input
                  id="file-input"
                  type="file"
                  style={{ display: 'none' }}
                  onChange={handleFileInputChange}
                />
              </MenuItem>
            </Menu>
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
