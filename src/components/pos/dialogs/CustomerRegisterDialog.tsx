import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useCart } from '../../../context/CartContext';
import api from '../../../services/api';
import { toast } from 'react-toastify';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
} from '@mui/material';

interface CustomerRegisterDialogProps {
  open: boolean;
  initialName?: string;
  onClose: () => void;
}

export const CustomerRegisterDialog: React.FC<CustomerRegisterDialogProps> = ({
  open,
  initialName = '',
  onClose,
}) => {
  const { branchId } = useAuth();
  const { setCurrentCustomer, getCustomerCart } = useCart();

  const [name, setName] = useState(initialName);
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) {
      toast.error('Customer name is required');
      return;
    }

    try {
      const response = await api.post('customer', {
        name,
        phoneNumber: phone,
        email,
        address,
        branchId,
      });

      if (response.data?.succeeded) {
        toast.success('Customer registered successfully');
        const createdCustomer = response.data.data;
        setCurrentCustomer(createdCustomer);
        getCustomerCart(createdCustomer.id);
        onClose();
      } else {
        toast.error(response.data?.messages?.[0] || 'Failed to create customer');
      }
    } catch (err: any) {
      toast.error('Error creating customer');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>Register New Customer</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                size="small"
                label="Customer Name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                size="small"
                label="Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                size="small"
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                size="small"
                label="Address"
                multiline
                rows={2}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="inherit">
            Cancel
          </Button>
          <Button type="submit" variant="contained" color="primary">
            Save & Select
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
