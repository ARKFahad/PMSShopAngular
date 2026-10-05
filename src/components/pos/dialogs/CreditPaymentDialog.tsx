import React from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useCart } from '../../../context/CartContext';
import api from '../../../services/api';
import { toast } from 'react-toastify';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
} from '@mui/material';

interface CreditPaymentDialogProps {
  open: boolean;
  subTotal: number;
  discount: number;
  netTotal: number;
  onClose: () => void;
  onSuccess: (saleId: string) => void;
}

export const CreditPaymentDialog: React.FC<CreditPaymentDialogProps> = ({
  open,
  subTotal,
  discount,
  netTotal,
  onClose,
  onSuccess,
}) => {
  const { branchId } = useAuth();
  const { cartItems, currentCustomer, clearCartItemsOnly } = useCart();

  const handleCheckout = async () => {
    if (!currentCustomer) {
      toast.error('Customer is required for credit sale!');
      return;
    }

    try {
      const payload = {
        saleType: 2, // Credit
        customerId: currentCustomer.id,
        branchId,
        subTotal,
        discount,
        netTotal,
        items: cartItems.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.price,
          totalPrice: item.total,
        })),
      };

      const response = await api.post('sale', payload);
      if (response.data?.succeeded) {
        toast.success('Credit Sale completed successfully!');
        const saleId = response.data?.data;
        clearCartItemsOnly();
        onSuccess(saleId);
      } else {
        toast.error(response.data?.message || 'Sale failed');
      }
    } catch (err) {
      toast.error('Error processing credit sale');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>Confirm Credit Sale</DialogTitle>
      <DialogContent dividers>
        <Box sx={{ mb: 2 }}>
          <Typography variant="body1">
            Customer: <b>{currentCustomer?.name}</b>
          </Typography>
          <Typography variant="subtitle1" fontWeight="bold" color="error" sx={{ mt: 1 }}>
            Net Credit Amount: ৳ {netTotal.toFixed(2)}
          </Typography>
          <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block' }}>
            This amount will be added to the customer's due account balance.
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button onClick={handleCheckout} variant="contained" color="warning">
          Confirm Credit Sale
        </Button>
      </DialogActions>
    </Dialog>
  );
};
