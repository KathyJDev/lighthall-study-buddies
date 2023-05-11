import React from 'react'
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import SendIcon from '@mui/icons-material/Send';
import IconButton from '@mui/material/IconButton';

function Input({ value, onChange, onSend }) {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      onSend();
    }
  };

  return (
    <Stack
    direction="row"
    sx={{
      '& .MuiTextField-root': { m: 1, width: '30rem' },
    }}
    spacing={1}
    noValidate
    autoComplete="off"
  >
    <TextField
        id="outlined-multiline-flexible"
        multiline
        sx={{color:'#418BF6'}}
        value={value}
        onChange={onChange}
        onKeyDown={handleKeyDown}
    />
    <IconButton color="primary" aria-label="send message" onClick={onSend}>
        <SendIcon />
    </IconButton>
    </Stack>
  )
}

export default Input