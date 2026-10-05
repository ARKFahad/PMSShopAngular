import React, { useState, useEffect } from 'react';
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Typography,
} from '@mui/material';

interface CardPaymentDialogProps {
  open: boolean;
  subTotal: number;
  discount: number;
  netTotal: number;
  onClose: () => void;
  onSuccess: (saleId: string) => void;
}

export const CardPaymentDialog: React.FC<CardPaymentDialogProps> = ({
  open,
  subTotal,
  discount,
  netTotal,
  onClose,
  onSuccess,
}) => {
  const { branchId } = useAuth();
  const { cartItems, currentCustomer, clearCartItemsOnly } = useCart();

  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
  const [paymentMethodId, setPaymentMethodId] = useState<string>('');
  const [cardNumber, setCardNumber] = useState<string>('');

  useEffect(() => {
    if (open) {
      api.post('PaymentMethod/search', { page: -1 }).then((res) => {
        setPaymentMethods(res.data?.data?.item1 || []);
      });
    }
  }, [open]);

  const handleCheckout = async () => {
    if (!paymentMethodId) {
      toast.error('Please select a payment method!');
      return;
    }

    try {
      const payload = {
        saleType: 1, // Card
        customerId: currentCustomer?.id,
        branchId,
        subTotal,
        discount,
        netTotal,
        paymentMethodId,
        cardNumber,
        items: cartItems.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.price,
          totalPrice: item.total,
        })),
      };

      const response = await api.post('sale', payload);
      if (response.data?.succeeded) {
        toast.success('Card Sale completed successfully!');
        const saleId = response.data?.data;
        clearCartItemsOnly();
        onSuccess(saleId);
      } else {
        toast.error(response.data?.message || 'Sale failed');
      }
    } catch (err) {
      toast.error('Error processing checkout');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>Card / Digital Payment</DialogTitle>
      <DialogContent dividers>
        <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>
          Net Payable: ৳ {netTotal.toFixed(2)}
        </Typography>

        <FormControl fullWidth size="small" sx={{ mb: 2 }}>
          <InputLabel>Payment Gateway / Method</InputLabel>
          <Select
            value={paymentMethodId}
            label="Payment Gateway / Method"
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
          label="Card / Transaction Reference No."
          value={cardNumber}
          onChange={(e) => setCardNumber(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button onClick={handleCheckout} variant="contained" color="primary">
          Complete Card Sale
        </Button>
      </DialogActions>
    </Dialog>
  );
};
