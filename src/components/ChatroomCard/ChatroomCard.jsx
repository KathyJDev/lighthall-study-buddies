import React from 'react'
import Card from '@mui/joy/Card';
import Typography from '@mui/joy/Typography';
import Chip from '@mui/joy/Chip';
import Box from '@mui/joy/Box';

const ChatroomCard = ({chatroom}) => {
  return (
    <Card variant="outlined" sx={{ minWidth: 275, backgroundColor: "#E0ECFF", borderWidth: '4px',borderColor: "#B8D1FD"}}>
        <Typography level="h2" sx={{ fontSize: '1.9rem', fontWeight:"700", color:"#23286B" }} mb={0.5}>
            {chatroom.title}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
            <Typography level="h6" sx={{ fontSize: '1rem', fontWeight:"600", color:"#23286B" }} mb={0.5}>
                Members: {chatroom.joinedUsers.length}
            </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 1}}>
            {chatroom.tags.map((tag) => (
                <Chip size="sm" variant="solid" color='primary'>{tag}</Chip>
            ))}
        </Box>
    </Card>
  )
}

export default ChatroomCard