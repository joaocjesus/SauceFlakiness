import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { PropsWithChildren } from 'react';

interface Props extends PropsWithChildren {
  open: boolean;
  onClose: Function;
  title?: string;
}

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 'auto',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};



export const InfoPanel = ({ open, onClose, title, children }: Props) => {

  const handleClose = (e: any) => {
    onClose();
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
    >
      <Box sx={style}>
        <Typography sx={{ mb: 1 }} id="info-panel-title" variant="h6" align="center">
          <b>{title}</b>
        </Typography>
        <Typography sx={{ mt: 2 }} id="info-panel-description" component="body" >
          {children}
        </Typography>
      </Box>
    </Modal>
  );
}
