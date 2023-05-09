import React, { useState, useEffect } from 'react'
import CreateChatroom from './CreateChatroom'
import ChatroomCard from '../ChatroomCard/ChatroomCard'
import Carousel from 'react-material-ui-carousel';
import { useParams } from 'react-router-dom';
import { db } from '../../../firebase-config.js';
import { doc, getDoc, collection, query, where, onSnapshot } from 'firebase/firestore';

function ChatroomList() {
  const { id } = useParams();
  const [modal, setModal] = useState(false)
  const [username, setUsername] = useState('');
  const [createdChatrooms, setCreatedChatrooms] = useState([])
  const [joinedChatrooms, setJoinedChatrooms] = useState([]);

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
        chatrooms.push(doc.data());
      });
      setCreatedChatrooms(chatrooms.filter((chatroom) => chatroom.createdBy === username));
      setJoinedChatrooms(chatrooms.filter((chatroom) => chatroom.joinedUsers && chatroom.joinedUsers.includes(username)));
    });
    return unsubscribe;
  }, []);

  const toggle = () => {
    setModal(!modal)
  }

  return (
    <>
    <div className='header'>
      <h2>{username}'s Chatrooms</h2>
    </div>
    <div className='chatrooms'>
        <h3>Created Chatrooms</h3>
        <div className='chatroom-container'>
        {createdChatrooms.map((chatroom) => (
          <ChatroomCard key={chatroom.id} chatroom={chatroom} />
        ))}
        </div>
    </div>
    <div className='chatrooms'>
        <h3>Joined Chatrooms</h3>
        <div className='chatroom-container'>
        {joinedChatrooms.map((chatroom) => (
          <ChatroomCard key={chatroom.id} chatroom={chatroom} />
        ))}
        </div>
    </div>
    <CreateChatroom toggle={toggle} modal={modal}/>
    </>
  )
}

export default ChatroomList