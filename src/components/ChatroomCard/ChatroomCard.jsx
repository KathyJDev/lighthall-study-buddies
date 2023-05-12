import React, {useState, useEffect} from 'react'
import Card from '@mui/joy/Card';
import Typography from '@mui/joy/Typography';
import Chip from '@mui/joy/Chip';
import Box from '@mui/joy/Box';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import Divider from '@mui/material/Divider';
import ShareIcon from '@mui/icons-material/Share';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import { db } from '../../../firebase-config.js';
import { collection, addDoc, doc, updateDoc, getDoc, deleteDoc } from 'firebase/firestore';
import { getAuth } from "firebase/auth";

const ChatroomCard = ({chatroom, chatroomId, isOwner}) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [username, setUsername] = useState("");
    const [open, setOpen] = useState(false);
    const auth = getAuth();
    const user = auth.currentUser;

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

      const handleJoin = async () => {
        // Check if current user is the creator of the chatroom
        if (isOwner) {
            return;
        }
      
        try {
          const chatroomRef = doc(db, "chatrooms", chatroomId);
          const chatroomSnapshot = await getDoc(chatroomRef);
          const chatroomData = chatroomSnapshot.data();
          const joinedUsers = chatroomData.joinedUsers || [];
      
          // Check if current user is already in joinedUsers
          if (joinedUsers.includes(username)) {
            // Redirect the user to the chatroom
            window.location.href = `/chatroom/${chatroomId}`;
            return;
          }

          const updatedJoinedUsers = [...joinedUsers, username];
          await updateDoc(chatroomRef, { joinedUsers: updatedJoinedUsers });
      
          // Redirect the user to the chatroom
          window.location.href = `/chatroom/${chatroomId}`;
        } catch (error) {
          console.error("Error updating chatroom: ", error);
        }
      };

    const handleClose = () => {
    setOpen(false);
    };

    function handleMenuClick(event) {
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
      }

    function handleMenuClose(event) {
        event.stopPropagation();
        setAnchorEl(null);
    }

    function handleShareChatroom(event) {
        event.stopPropagation();
        setOpen(true);
        setAnchorEl(null);
    }

    function handleEditChatroom(event) {
        event.stopPropagation();
        setAnchorEl(null);
    }

    function handleLeaveChatroom(event) {
        event.stopPropagation();
        const chatroomRef = doc(db, "chatrooms", chatroomId);
        const updatedJoinedUsers = chatroom.joinedUsers.filter(user => user !== username);
        updateDoc(chatroomRef, { joinedUsers: updatedJoinedUsers });
        setAnchorEl(null);
    }

    function handleDeleteChatroom(event) {
        event.stopPropagation();
        const chatroomRef = doc(db, "chatrooms", chatroomId);
        deleteDoc(chatroomRef);
        setAnchorEl(null);
    }

    return (
        <>
        <Card onClick={handleJoin} variant="outlined" sx={{ minWidth: 275, minHeight: 175, backgroundColor: "#E0ECFF", borderWidth: '4px',borderColor: "#B8D1FD", cursor: 'pointer'}}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography level="h2" sx={{ fontSize: '1.9rem', fontWeight: '700', color: '#23286B' }} mb={0.5}>
                    {chatroom.title}
                </Typography>
                <IconButton onClick={handleMenuClick}>
                    <MoreVertIcon />
                </IconButton>
                <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                <MenuItem onClick={handleShareChatroom}><ShareIcon fontSize="small" sx={{ color: '#23286B', mr: 1 }}/> Share</MenuItem>
                {isOwner && <MenuItem onClick={handleEditChatroom}><EditIcon fontSize="small" sx={{ color: '#23286B', mr: 1 }}/> Edit</MenuItem>}
                {isOwner && <Divider sx={{ my: 0.5 }} />}
                {!isOwner && <MenuItem onClick={handleLeaveChatroom}><PersonRemoveIcon fontSize="small" sx={{ color: '#E34543', mr: 1 }}/> Leave</MenuItem>}
                {isOwner && <MenuItem onClick={handleDeleteChatroom}><DeleteIcon fontSize="small" sx={{ color: '#E34543', mr: 1 }}/> Delete</MenuItem>}
                </Menu>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                <Typography level="h6" sx={{ fontSize: '1rem', fontWeight:"600", color:"#23286B" }} mb={0.5}>
                    Members: {chatroom.joinedUsers.length + 1}
                </Typography>
            </Box>
            <Box sx={{ display: "flex", gap: 1, mt: 5}}>
                {chatroom.tags.map((tag) => (
                    <Chip size="sm" variant="solid" color='primary'>{tag}</Chip>
                ))}
            </Box>
        </Card>
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
        <DialogActions>
            <Button variant="contained" sx={{ mt: 2, backgroundColor:'#23286B' }} onClick={handleClose}>Close</Button>
        </DialogActions>
        </Dialog>
        </>
  )
}

export default ChatroomCard