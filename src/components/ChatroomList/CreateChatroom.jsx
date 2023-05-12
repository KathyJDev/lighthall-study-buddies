import { useState, useEffect } from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/joy/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#28306D',
    },
  },
});

const CreateChatroom = ({ modal, toggle, save, editData }) => {
  const [chatroomName, setChatroomName] = useState('');
  const [chatroomTags, setChatroomTags] = useState('');

  useEffect(() => {
    if (modal) {
      if (editData) {
        setChatroomName(editData.title);
        setChatroomTags(editData.tags.join(', '));
      } else {
        setChatroomName('');
        setChatroomTags('');
      }
    }
  }, [modal, editData]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const title = chatroomName.trim();
    const tags = chatroomTags.split(",").map((tag) => tag.trim().toLowerCase());
  
    // Validation checks
    if (title.length > 20) {
      alert("Chatroom title must be 20 characters or less");
      return;
    }
  
    if (tags.length > 5) {
      alert("You can only input up to 5 chatroom tags");
      return;
    }
  
    save(event, title, tags);
    toggle();
  };
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: '#FFFFFF',
    border: '6px solid',
    borderColor: '#B8D1FD',
    borderRadius: '1rem',
    boxShadow: 24,
    p: 4,
  };

  return (
    <div>
      <ThemeProvider theme={theme}>
      <Modal
        open={modal}
        onClose={toggle}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          {!editData && <Typography variant="h6" component="h2" gutterBottom>
            Create a new chatroom
          </Typography>}
          {editData && <Typography variant="h6" component="h2" gutterBottom>
            Edit chatroom
          </Typography>}
          <form onSubmit={handleSubmit}>
            <TextField
              id="chatroom-name"
              label="Chatroom name"
              fullWidth
              required
              value={chatroomName}
              onChange={(event) => setChatroomName(event.target.value)}
              margin="normal"
              autoComplete='off'
              color='primary'
              maxLength={20}
            />
            <TextField
              id="chatroom-tags"
              label="Chatroom tags (comma-separated)"
              required
              fullWidth
              value={chatroomTags}
              onChange={(event) => setChatroomTags(event.target.value)}
              margin="normal"
              variant="outlined"
              autoComplete='off'
              color='primary'
            />
            {!editData && <Button type="submit" variant="contained" sx={{ mt: 2, backgroundColor:'#23286B' }}>
              Create
            </Button>}
            {editData && <Button type="submit" variant="contained" sx={{ mt: 2, backgroundColor:'#23286B' }}>
              Save
            </Button>}
          </form>
        </Box>
      </Modal>
      </ThemeProvider>
    </div>
  );
};

export default CreateChatroom