import { useState, useEffect } from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/joy/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

const CreateChatroom = ({ modal, toggle, save }) => {
  const [chatroomName, setChatroomName] = useState('');
  const [chatroomTags, setChatroomTags] = useState('');

  useEffect(() => {
    if (modal) {
      setChatroomName('');
      setChatroomTags('');
    }
  }, [modal]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const title = chatroomName;
    const tags = chatroomTags.split(",").map((tag) => tag.trim());
    save(title, tags);
    toggle();
  };

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '6px solid',
    borderColor: '#B8D1FD',
    borderRadius: '1rem',
    boxShadow: 24,
    p: 4,
  };

  return (
    <div>
      <Modal
        open={modal}
        onClose={toggle}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography variant="h6" component="h2" gutterBottom>
            Create a new chatroom
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              id="chatroom-name"
              label="Chatroom name"
              fullWidth
              required
              value={chatroomName}
              onChange={(event) => setChatroomName(event.target.value)}
              margin="normal"
              variant="outlined"
            />
            <TextField
              id="chatroom-tags"
              label="Chatroom tags (comma-separated)"
              fullWidth
              value={chatroomTags}
              onChange={(event) => setChatroomTags(event.target.value)}
              margin="normal"
              variant="outlined"
            />
            <Button type="submit" variant="contained" sx={{ mt: 2, backgroundColor:'#23286B' }}>
              Create
            </Button>
          </form>
        </Box>
      </Modal>
    </div>
  );
};

export default CreateChatroom