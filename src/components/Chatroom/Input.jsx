import React from 'react'
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import SendIcon from '@mui/icons-material/Send';
import IconButton from '@mui/material/IconButton';

function Input() {
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
    />
    <IconButton color="primary" aria-label="send message">
        <SendIcon />
    </IconButton>
    </Stack>
  )
}

export default Input