import React, {useState} from 'react'
import Card from '@mui/joy/Card';
import Typography from '@mui/joy/Typography';
import Chip from '@mui/joy/Chip';
import Box from '@mui/joy/Box';
import { CardActionArea } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import shadows from '@mui/material/styles/shadows';

const ChatroomCard = ({chatroom, userId, chatroomId, isOwner}) => {
    const [anchorEl, setAnchorEl] = useState(null);

    function navigateToChatroom() {
        window.location.href = `/chatroom/${userId}/${chatroomId}`;
    }

    function handleMenuClick(event) {
        setAnchorEl(event.currentTarget);
    }

    function handleMenuClose() {
        setAnchorEl(null);
    }

    function handleLeaveChatroom() {
        console.log("Leave chatroom");
    }

    function handleDeleteChatroom() {
        console.log("Delete chatroom");
    }

    return (
        <Card onClick={navigateToChatroom} variant="outlined" sx={{ minWidth: 275, backgroundColor: "#E0ECFF", borderWidth: '4px',borderColor: "#B8D1FD", cursor: 'pointer'}}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography level="h2" sx={{ fontSize: '1.9rem', fontWeight: '700', color: '#23286B' }} mb={0.5}>
                    {chatroom.title}
                </Typography>
                <IconButton onClick={handleMenuClick}>
                    <MoreVertIcon />
                </IconButton>
                <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                <MenuItem onClick={handleLeaveChatroom}>Leave Chatroom</MenuItem>
                {isOwner && <MenuItem onClick={handleDeleteChatroom}>Delete Chatroom</MenuItem>}
                </Menu>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                <Typography level="h6" sx={{ fontSize: '1rem', fontWeight:"600", color:"#23286B" }} mb={0.5}>
                    Members: {chatroom.joinedUsers.length}
                </Typography>
            </Box>
            <Box sx={{ display: "flex", gap: 1, mt: 5}}>
                {chatroom.tags.map((tag) => (
                    <Chip size="sm" variant="solid" color='primary'>{tag}</Chip>
                ))}
            </Box>
        </Card>
  )
}

export default ChatroomCard