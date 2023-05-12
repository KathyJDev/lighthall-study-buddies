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

const JoinChatroom = ({ modal, toggle, save }) => {
  const [chatroomID, setChatroomID] = useState('');

  useEffect(() => {
    if (modal) {
      setChatroomID('');
    }
  }, [modal]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const code = chatroomID;
    save(code);
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
          <Typography variant="h6" component="h2" gutterBottom>
            Join a new chatroom
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              id="join-code"
              label="Join Code"
              fullWidth
              required
              value={chatroomID}
              onChange={(event) => setChatroomID(event.target.value)}
              margin="normal"
              variant="outlined"
              autoComplete='off'
            />
            <Button type="submit" variant="contained" sx={{ mt: 2, backgroundColor:'#23286B' }}>
              Join
            </Button>
          </form>
        </Box>
      </Modal>
      </ThemeProvider>
    </div>
  );
};

export default JoinChatroom