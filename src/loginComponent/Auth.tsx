import React, { useState } from 'react';
import { IconButton ,Dialog, Typography} from '@mui/material';

import LoginModal from './Login';
import RegisterModal from './Register';


interface AuthModalProps {
  open: boolean;
  handleClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ open, handleClose }) => {
  const [openLogin, setOpenLogin] = useState(false);
  const [openRegister, setOpenRegister] = useState(false);

  // Function to open the login modal
  const handleOpenLogin = () => {
    setOpenLogin(true);
  };

  // Function to open the register modal
  const handleOpenRegister = () => {
    setOpenRegister(true);
  };

  // Function to close the login modal
  const handleCloseLogin = () => {
    setOpenLogin(false);
  };

  // Function to close the register modal
  const handleCloseRegister = () => {
    setOpenRegister(false);
  };

  return (
      <Dialog open={open} onClose={handleClose}>

      <IconButton sx={{
       
      }} onClick={handleOpenLogin}>
       
        <Typography
        sx={{ fontSize:20, color:'green'}}
        >Login</Typography>
      </IconButton>

      {/* Login Modal */}
      <LoginModal
        open={openLogin}
        handleClose={handleCloseLogin}
        onRegisterClick={() => {
          handleCloseLogin();
          handleOpenRegister();
        }}
      />

      {/* Register Modal */}
      <RegisterModal
        open={openRegister}
        handleClose={handleCloseRegister}
        onRegisterComplete={() => {
          handleCloseRegister();
          handleOpenLogin();
        }}
      />

    </Dialog>
  );
};

export default AuthModal;
