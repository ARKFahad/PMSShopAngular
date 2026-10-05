import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { Customer } from '../../../context/CartContext';
import api from '../../../services/api';
import { toast } from 'react-toastify';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Box,
} from '@mui/material';

interface CustomerPaymentDialogProps {
  open: boolean;
  customer: Customer | null;
  onClose: () => void;
}

export const CustomerPaymentDialog: React.FC<CustomerPaymentDialogProps> = ({
  open,
  customer,
  onClose,
}) => {
  const { branchId } = useAuth();
  const [customerBalance, setCustomerBalance] = useState<number>(0);
  const [paymentAmount, setPaymentAmount] = useState<string>('');
  const [paymentMethodId, setPaymentMethodId] = useState<string>('');
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);

  useEffect(() => {
    if (open && customer) {
      // Get Payment Methods
      api.post('PaymentMethod/search', { page: -1 }).then((res) => {
        setPaymentMethods(res.data?.data?.item1 || []);
      });

      // Get Customer Balance if accountId exists
      if (customer.accountId) {
        api
          .get(`account/balance/${customer.accountId}/1/${branchId}`)
          .then((res) => {
            setCustomerBalance(res.data?.balance ?? 0);
          })
          .catch(() => {});
      } else {
        setCustomerBalance(customer.balance ?? 0);
      }
    }
  }, [open, customer, branchId]);

  const handleSubmit = async () => {
    const amount = parseFloat(paymentAmount);
    if (!paymentMethodId || isNaN(amount) || amount <= 0) {
      alert('Please select Payment Method and enter Payment Amount greater than 0 !!');
      return;
    }

    try {
      const response = await api.post('CustomerPayment', {
        branchId,
        customerId: customer?.id,
        paymentAmount: amount,
        paymentMethodId,
        remark: 'Payment Received From Pos',
      });

      if (response.data?.succeeded) {
        toast.success(response.data?.message || 'Payment saved successfully');
        onClose();
      } else {
        toast.error(response.data?.message || 'Failed to submit payment');
      }
    } catch (err) {
      toast.error('Error submitting payment');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>Receive Customer Payment</DialogTitle>
      <DialogContent dividers>
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="textSecondary">
            Customer Name: <b>{customer?.name}</b>
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Current Balance: <b>৳{customerBalance}</b>
          </Typography>
        </Box>

        <FormControl fullWidth size="small" sx={{ mb: 2 }}>
          <InputLabel>Payment Method</InputLabel>
          <Select
            value={paymentMethodId}
            label="Payment Method"
            onChange={(e) => setPaymentMethodId(e.target.value)}
          >
            {paymentMethods.map((pm) => (
              <MenuItem key={pm.id} value={pm.id}>
                {pm.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          fullWidth
          size="small"
          label="Payment Amount"
          type="number"
          value={paymentAmount}
          onChange={(e) => setPaymentAmount(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Submit Payment
        </Button>
      </DialogActions>
    </Dialog>
  );
};
