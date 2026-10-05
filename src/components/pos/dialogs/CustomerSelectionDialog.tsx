import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useCart, Customer } from '../../../context/CartContext';
import api from '../../../services/api';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemSecondaryAction,
  Typography,
  IconButton,
  Box,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import PaymentIcon from '@mui/icons-material/Payment';

interface CustomerSelectionDialogProps {
  open: boolean;
  onClose: () => void;
  onOpenRegister: (searchName: string) => void;
  onOpenPayment: (customer: Customer) => void;
}

export const CustomerSelectionDialog: React.FC<CustomerSelectionDialogProps> = ({
  open,
  onClose,
  onOpenRegister,
  onOpenPayment,
}) => {
  const { branchId } = useAuth();
  const { setCurrentCustomer, getCustomerCart } = useCart();
  const [searchString, setSearchString] = useState('');
  const [customers, setCustomers] = useState<Customer[]>([]);

  const fetchCustomers = (keyword: string) => {
    api
      .post('customer/search', {
        branchId,
        keyword: keyword.trim().toLowerCase(),
      })
      .then((res) => {
        if (res.data?.succeeded) {
          setCustomers(res.data.data.item1 || []);
        } else {
          setCustomers([]);
        }
      })
      .catch(() => setCustomers([]));
  };

  useEffect(() => {
    if (open) {
      fetchCustomers(searchString);
    }
  }, [open]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchString(val);
    fetchCustomers(val);
  };

  const handleSelectCustomer = (customer: Customer) => {
    setCurrentCustomer(customer);
    getCustomerCart(customer.id);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        Select Customer
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          <TextField
            fullWidth
            size="small"
            label="Search Customer"
            value={searchString}
            onChange={handleSearchChange}
            placeholder="Type customer name or phone..."
          />
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => onOpenRegister(searchString)}
            sx={{ whitespace: 'nowrap' }}
          >
            New Customer
          </Button>
        </Box>

        <List sx={{ maxHeight: 350, overflow: 'auto' }}>
          {customers.map((customer) => (
            <ListItem
              key={customer.id}
              divider
              secondaryAction={
                <IconButton
                  edge="end"
                  color="secondary"
                  title="Receive Payment"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenPayment(customer);
                  }}
                >
                  <PaymentIcon />
                </IconButton>
              }
              disablePadding
            >
              <ListItemButton onClick={() => handleSelectCustomer(customer)}>
                <ListItemText
                  primary={customer.name}
                  secondary={`Phone: ${customer.phoneNumber || 'N/A'} | Balance: ৳${customer.balance ?? 0}`}
                />
              </ListItemButton>
            </ListItem>
          ))}
          {customers.length === 0 && (
            <Typography variant="body2" color="textSecondary" align="center" sx={{ py: 2 }}>
              No customer found.
            </Typography>
          )}
        </List>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};
