import React, { useState, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid';
import CreateChatroom from './CreateChatroom'
import JoinChatroom from './JoinChatroom'
import ChatroomCard from '../ChatroomCard/ChatroomCard'
import Button from '@mui/material/Button';
import LogoutIcon from '@mui/icons-material/Logout';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { styled } from '@mui/material/styles';
import { db } from '../../../firebase-config.js';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, collection, query, where, onSnapshot, addDoc, getDocs, updateDoc } from 'firebase/firestore';

const SearchButton = styled(Button)({
  background: '#418BF6',
  color: '#FFFFFF',
  textTransform: 'none',
  height: '3rem',
  borderRadius: '13px',
  fontSize: '1.2rem',
  fontWeight: 'bold',
  marginLeft: 'auto',
  '&:hover': {
    background: '#28306D',
  },
});

const LeaveIcon = styled(LogoutIcon)({
  background: '#E34543',
  color: '#FFFFFF',
  height: '2rem',
  width: '2rem',
  borderRadius: '5px',
  marginLeft: '10px',
  padding: '4px',
});

const ChatroomButton = styled(Button)({
  textTransform: 'none',
});

function ChatroomList() {
  const [createModal, setCreateModal] = useState(false)
  const [joinModal, setJoinModal] = useState(false)
  const [username, setUsername] = useState('');
  const [createdChatrooms, setCreatedChatrooms] = useState([])
  const [joinedChatrooms, setJoinedChatrooms] = useState([]);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(false);

  const generateJoinCode = () => {
    return uuidv4().slice(0, 6);
  };

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (user) {
        console.log('User is logged in');
      } else {
        console.log('User is not logged in');
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

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
    const chatroomsRef = collection(db, "chatrooms");
    const unsubscribe = onSnapshot(chatroomsRef, (querySnapshot) => {
      const chatrooms = [];
      querySnapshot.forEach((doc) => {
        chatrooms.push({ id: doc.id, ...doc.data() });
      });
      setCreatedChatrooms(chatrooms.filter((chatroom) => chatroom.createdBy === username));
      setJoinedChatrooms(chatrooms.filter((chatroom) => chatroom.joinedUsers && chatroom.joinedUsers.includes(username)));
    });
    return unsubscribe;
  }, [username]);

  const createModaltoggle = () => {
    setCreateModal(!createModal)
  }
  const joinModaltoggle = () => {
    setJoinModal(!joinModal)
  }

  const saveChatroom = async (title, tags) => {
    try {
      const joinCode = generateJoinCode();
      const docRef = await addDoc(collection(db, "chatrooms"), {
        title,
        tags,
        createdBy: username,
        joinedUsers: [],
        joinCode
      });
      console.log("Document written with ID: ", docRef.id);
      setCreateModal(false);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setError(false);
  };

  const joinChatroom = async (code) => {
    try {
      const chatroomsRef = collection(db, "chatrooms");
      const querySnapshot = await getDocs(query(chatroomsRef, where("joinCode", "==", code)));
      if (querySnapshot.empty) {
        console.log("No matching documents.");
        return;
      }
      const chatroomDoc = querySnapshot.docs[0];
      const chatroomId = chatroomDoc.id;
      const chatroomData = chatroomDoc.data();
      // Check if current user is already in joinedUsers
      if (joinedUsers.includes(username)) {
        setError(true);
        return;
      }
      const joinedUsers = [...chatroomData.joinedUsers, username];
      await updateDoc(doc(chatroomsRef, chatroomId), { joinedUsers });
      console.log(`User ${username} joined chatroom ${chatroomId}`);
      setJoinModal(false);
    } catch (e) {
      setError(true);
      console.error("Error joining chatroom: ", e);
    }
  }

  function navigateToCommunity() {
    window.location.href = `/community/`;
  }

  function signOut() {
    const auth = getAuth();
    auth.signOut().then(() => {
      console.log('User signed out');
      window.location.href = `/`;
    }).catch((error) => {
      console.log(error);
    });
  }

  return (
    <>
    <div className='header'>
      <h2>{username}'s Chatrooms</h2>
      <SearchButton variant="contained" onClick={navigateToCommunity}>Search Community</SearchButton>
      <LeaveIcon cursor='pointer' onClick={signOut}/>
    </div>
    <div className='chatrooms'>
        <div className='chatrooms-header'>
          <h3>Created Chatrooms</h3>
          <ChatroomButton sx={{ m:2, backgroundColor: '#28306D', '&:hover': {backgroundColor: '#418BF6'} }} variant="contained" onClick={() => setCreateModal(true)}>Create New</ChatroomButton>
        </div>
        <div className='chatrooms-container'>
        {createdChatrooms.map((chatroom) => (
          <ChatroomCard key={chatroom.id} chatroom={chatroom} chatroomId={chatroom.id} isOwner={true} />
        ))}
        </div>
    </div>
    <div className='chatrooms'>
        <div className='chatrooms-header'>
          <h3>Joined Chatrooms</h3>
          <ChatroomButton sx={{ m:2, backgroundColor: '#28306D', '&:hover': {backgroundColor: '#418BF6'} }} variant="contained" onClick={() => setJoinModal(true)}>Join New</ChatroomButton>
        </div>
        <div className='chatrooms-container'>
        {joinedChatrooms.map((chatroom) => (
          <ChatroomCard key={chatroom.id} chatroom={chatroom} chatroomId={chatroom.id} isOwner={false}/>
        ))}
        </div>
    </div>
    <CreateChatroom toggle={createModaltoggle} modal={createModal} save={saveChatroom}/>
    <JoinChatroom toggle={joinModaltoggle} modal={joinModal} save={joinChatroom}/>
    <Snackbar anchorOrigin={{vertical: 'top', horizontal: 'right'}} open={error} onClose={handleClose} autoHideDuration={4000}>
        <Alert severity="error">Already joined chatroom</Alert>
    </Snackbar>
    </>
  )
}

export default ChatroomList