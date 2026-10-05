import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';

export const WelcomeComponent: React.FC = () => {
  const { fullName, logout, isAuthorized } = useAuth();
  const navigate = useNavigate();
  const [logoutOpen, setLogoutOpen] = useState(false);

  const handleLogoutClick = () => {
    setLogoutOpen(true);
  };

  const handleLogoutConfirm = () => {
    setLogoutOpen(false);
    logout();
    navigate('/login');
  };

  const handleLogoutCancel = () => {
    setLogoutOpen(false);
  };

  return (
    <div className="home-center-screen container" style={{ padding: '20px' }}>
      <div className="row">
        <div className="col-md-12 col-xl-12">
          <div className="c-card background-color-primary" style={{ backgroundColor: '#1976d2', color: 'white' }}>
            <div>
              <h1>Hi, {fullName || 'User'}</h1>
              <p style={{ opacity: 0.75 }}>
                Welcome to POS Software. Choose a Module to continue.
              </p>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleLogoutClick}
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      {isAuthorized('Role', ['Salesman']) && (
        <div className="row mt-4">
          <div className="col-md-6 col-xl-6 u-mr-auto">
            <div
              className="c-card is-animated background-color-primary"
              style={{ backgroundColor: '#1976d2', color: 'white' }}
            >
              <div>
                <h1>POS</h1>
                <p style={{ opacity: 0.5 }}>
                  Start selling items from your store/warehouse inventory.
                </p>
                <Button
                  variant="contained"
                  color="secondary"
                  component={Link}
                  to="/pos"
                >
                  POS
                </Button>
              </div>
            </div>
          </div>
          <div className="col-md-6 col-xl-6 u-ml-auto"></div>
        </div>
      )}

      {/* Logout Confirmation Dialog */}
      <Dialog open={logoutOpen} onClose={handleLogoutCancel}>
        <DialogTitle>Confirm Logout</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to log out from the system?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleLogoutCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={handleLogoutConfirm} color="error" autoFocus>
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
