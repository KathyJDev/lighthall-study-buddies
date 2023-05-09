import React from 'react'
import Modal from '@mui/material/Modal'
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const CreateChatroom = ({modal, toggle, save}) => {
  return (
    <Modal
    open={modal}
    onClose={toggle}
    aria-labelledby="modal-modal-title"
    aria-describedby="modal-modal-description"
    >
    <Box>
        <Typography id="modal-modal-title" variant="h6" component="h2">
        Text in a modal
        </Typography>
        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
        Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
        </Typography>
    </Box>
    </Modal>
  )
}

export default CreateChatroom