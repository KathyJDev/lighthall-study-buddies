import React, { useState } from 'react'
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import SendIcon from '@mui/icons-material/Send';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';

const InputContainer = styled(TextField) ({
  width: '30rem',
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: '#418BF6',
      borderRadius: '20px',
    },
    '&:hover fieldset': {
      borderColor: '#418BF6',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#418BF6',
    },
  },
});

function Input({ value, onChange, onSend }) {

  return (
    <Stack
    direction="row"
    spacing={1}
    noValidate
    autoComplete="off"
  >    
    <InputContainer
        id="outlined-multiline-flexible"
        multiline
        sx={{color:'#418BF6'}}
        value={value}
        onChange={onChange}
    />
    <IconButton color="primary" aria-label="send message" onClick={onSend}>
        <SendIcon />
    </IconButton>
    </Stack>
  )
}

export default Input