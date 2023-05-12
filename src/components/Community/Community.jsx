import React, { useState, useEffect } from 'react';
import { db } from '../../../firebase-config.js';
import { doc, getDoc, collection, query, where, onSnapshot, addDoc, getDocs, updateDoc } from 'firebase/firestore';
import ChatroomCard from '../ChatroomCard/ChatroomCard.jsx';
import { TextField } from '@mui/material';
import { styled } from '@mui/material/styles';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { getAuth } from "firebase/auth";
import { AnimatePresence, motion } from "framer-motion";

const SearchTextField = styled(TextField)({
    background: '#ffffff',
    borderRadius: '10px',
    '& .MuiOutlinedInput-root': {
        '& fieldset': {
            borderColor: '#ffffff',
            borderRadius: '10px',
        },
        '&:hover fieldset': {
            borderColor: '#ffffff',
            borderRadius: '10px',
        },
        '&.Mui-focused fieldset': {
            borderColor: '#23286B',
            borderRadius: '10px',
        },
    },
});

const ChipContainer = styled(Stack)({
    marginTop: '8px',
    '& > *': {
        marginRight: '8px',
    },
})

const DashButton = styled(Button)({
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

function Community() {
    const [chatrooms, setChatrooms] = useState([]);
    const [filteredChatrooms, setFilteredChatrooms] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [tags, setTags] = useState([]);
    const auth = getAuth();
    const user = auth.currentUser;

    useEffect(() => {
        // Fetch all chatrooms from Firestore
        const chatroomsRef = collection(db, "chatrooms");
        onSnapshot(chatroomsRef, (snapshot) => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setChatrooms(data);
        });
    }, []);

    useEffect(() => {
        // Filter chatrooms by selected tags
        const filtered = chatrooms.filter(chatroom =>
            tags.every(tag => chatroom.tags.includes(tag))
        );
        setFilteredChatrooms(filtered);
    }, [chatrooms, tags]);

    const handleKeyDown = event => {
        if (event.key === 'Enter') {
        setTags([...tags, searchQuery]);
        setSearchQuery('');
        }
    };
    
    const handleDelete = tagToDelete => {
        setTags(tags.filter(tag => tag !== tagToDelete));
    };

    function navigateToDashboard() {
        window.location.href = `/dashboard`;
    }

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="search-header"
      >
        <DashButton variant="contained" onClick={navigateToDashboard}>Dashboard</DashButton>
        <h2>Search Chatrooms</h2>
        <SearchTextField type="text" size="small" value={searchQuery} onChange={event => setSearchQuery(event.target.value)} onKeyDown={handleKeyDown} placeholder="Search by tags" autoComplete='off' />
        <ChipContainer direction="row" gap='1'>
            {tags.map(tag => (
                <Chip color='primary' variant='solid' key={tag} label={tag} onDelete={() => handleDelete(tag)} />
            ))}
        </ChipContainer>
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="community-chatrooms-container"
      >
      <AnimatePresence>
        {filteredChatrooms.length > 0 ? (
          filteredChatrooms.map((chatroom, index) => (
            <motion.div key={chatroom.id} initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }} transition={{ duration: 0.5, delay: index * 0.1 }}>
              <ChatroomCard key={chatroom.id} chatroom={chatroom} chatroomId={chatroom.id} />
            </motion.div>
          ))
        ) : (
          chatrooms.map((chatroom, index) => (
            <motion.div key={chatroom.id} initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }} transition={{ duration: 0.5, delay: index * 0.1 }}>
              <ChatroomCard key={chatroom.id} chatroom={chatroom} chatroomId={chatroom.id} />
            </motion.div>
          ))
        )}
      </AnimatePresence>
      </motion.div>
    </div>
  );
}

export default Community;
