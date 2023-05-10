import React, { useState, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid';
import CreateChatroom from './CreateChatroom'
import JoinChatroom from './JoinChatroom'
import ChatroomCard from '../ChatroomCard/ChatroomCard'
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import { useParams } from 'react-router-dom';
import { db } from '../../../firebase-config.js';
import { doc, getDoc, collection, query, where, onSnapshot, addDoc, getDocs, updateDoc } from 'firebase/firestore';

const SearchButton = styled(Button)({
  background: '#E34543',
  color: '#FFFFFF',
  textTransform: 'none',
  height: '3rem',
  borderRadius: '13px',
  fontSize: '1.2rem',
  fontWeight: 'bold',
  marginLeft: 'auto',
  '&:hover': {
    background: '#418BF6',
  },
});

function ChatroomList() {
  const { id } = useParams();
  const [createModal, setCreateModal] = useState(false)
  const [joinModal, setJoinModal] = useState(false)
  const [username, setUsername] = useState('');
  const [createdChatrooms, setCreatedChatrooms] = useState([])
  const [joinedChatrooms, setJoinedChatrooms] = useState([]);

  const generateJoinCode = () => {
    return uuidv4().slice(0, 6);
  };

  const userRef = doc(db, "users", id);

  useEffect(() => {
    const getUser = async () => {
      const docSnap = await getDoc(userRef);
      if (docSnap.exists()) {
        setUsername(docSnap.data().username);
      } else {
        console.log("No such document!");
      }
    }
    getUser();
  }, [userRef])

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
      const joinedUsers = [...chatroomData.joinedUsers, username];
      await updateDoc(doc(chatroomsRef, chatroomId), { joinedUsers });
      console.log(`User ${username} joined chatroom ${chatroomId}`);
      setJoinModal(false);
    } catch (e) {
      console.error("Error joining chatroom: ", e);
    }
  }

  function navigateToCommunity() {
    window.location.href = `/community/${id}`;
  }

  return (
    <>
    <div className='header'>
      <h2>{username}'s Chatrooms</h2>
      <SearchButton variant="contained" onClick={navigateToCommunity}>Search Community</SearchButton>
    </div>
    <div className='chatrooms'>
        <div className='chatrooms-header'>
          <h3>Created Chatrooms</h3>
          <Button sx={{ m:2, backgroundColor: '#28306D', '&:hover': {backgroundColor: '#E94A47'} }} variant="contained" onClick={() => setCreateModal(true)}>Create New</Button>
        </div>
        <div className='chatrooms-container'>
        {createdChatrooms.map((chatroom) => (
          <ChatroomCard key={chatroom.id} userId={id} chatroom={chatroom} chatroomId={chatroom.id} isOwner={true} />
        ))}
        </div>
    </div>
    <div className='chatrooms'>
        <div className='chatrooms-header'>
          <h3>Joined Chatrooms</h3>
          <Button sx={{ m:2, backgroundColor: '#28306D', '&:hover': {backgroundColor: '#E94A47'} }} variant="contained" onClick={() => setJoinModal(true)}>Join New</Button>
        </div>
        <div className='chatrooms-container'>
        {joinedChatrooms.map((chatroom) => (
          <ChatroomCard key={chatroom.id} userId={id} chatroom={chatroom} chatroomId={chatroom.id} isOwner={false}/>
        ))}
        </div>
    </div>
    <CreateChatroom toggle={createModaltoggle} modal={createModal} save={saveChatroom}/>
    <JoinChatroom toggle={joinModaltoggle} modal={joinModal} save={joinChatroom}/>
    </>
  )
}

export default ChatroomList