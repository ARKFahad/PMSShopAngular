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
  Grid,
  Typography,
  Box,
  Divider,
} from '@mui/material';

interface CashPaymentDialogProps {
  open: boolean;
  subTotal: number;
  discount: number;
  netTotal: number;
  onClose: () => void;
  onSuccess: (saleId: string) => void;
}

export const CashPaymentDialog: React.FC<CashPaymentDialogProps> = ({
  open,
  subTotal,
  discount,
  netTotal,
  onClose,
  onSuccess,
}) => {
  const { branchId } = useAuth();
  const { cartItems, currentCustomer, clearCartItemsOnly } = useCart();

  const [tenderedAmount, setTenderedAmount] = useState<string>('');
  const [changeAmount, setChangeAmount] = useState<number>(0);

  useEffect(() => {
    const tendered = parseFloat(tenderedAmount) || 0;
    const change = tendered - netTotal;
    setChangeAmount(change > 0 ? change : 0);
  }, [tenderedAmount, netTotal]);

  const handleCheckout = async () => {
    const tendered = parseFloat(tenderedAmount) || 0;
    if (tendered < netTotal) {
      toast.error('Tendered amount must be equal to or greater than Net Total!');
      return;
    }

    try {
      const payload = {
        saleType: 0, // Cash
        customerId: currentCustomer?.id,
        branchId,
        subTotal,
        discount,
        netTotal,
        tenderedAmount: tendered,
        changeAmount,
        items: cartItems.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.price,
          totalPrice: item.total,
        })),
      };

      const response = await api.post('sale', payload);
      if (response.data?.succeeded) {
        toast.success('Sale completed successfully!');
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
      <DialogTitle sx={{ fontWeight: 'bold' }}>Cash Payment Checkout</DialogTitle>
      <DialogContent dividers>
        <Box sx={{ mb: 2 }}>
          <Grid container spacing={1}>
            <Grid item xs={6}>
              <Typography variant="body2" color="textSecondary">Sub Total:</Typography>
            </Grid>
            <Grid item xs={6} sx={{ textAlign: 'right' }}>
              <Typography variant="body2" fontWeight="bold">৳ {subTotal.toFixed(2)}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" color="textSecondary">Discount:</Typography>
            </Grid>
            <Grid item xs={6} sx={{ textAlign: 'right' }}>
              <Typography variant="body2" color="error">৳ {discount.toFixed(2)}</Typography>
            </Grid>
            <Grid item xs={12}><Divider sx={{ my: 1 }} /></Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle1" fontWeight="bold">Net Total:</Typography>
            </Grid>
            <Grid item xs={6} sx={{ textAlign: 'right' }}>
              <Typography variant="subtitle1" color="primary" fontWeight="bold">
                ৳ {netTotal.toFixed(2)}
              </Typography>
            </Grid>
          </Grid>
        </Box>

        <TextField
          fullWidth
          size="small"
          autoFocus
          label="Tendered Amount"
          type="number"
          value={tenderedAmount}
          onChange={(e) => setTenderedAmount(e.target.value)}
          sx={{ mb: 2 }}
        />

        <Box sx={{ p: 1.5, bgcolor: 'action.hover', borderRadius: 1 }}>
          <Grid container justifyContent="space-between">
            <Typography variant="body2" fontWeight="bold">Change Amount:</Typography>
            <Typography variant="body2" color="success.main" fontWeight="bold">
              ৳ {changeAmount.toFixed(2)}
            </Typography>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button onClick={handleCheckout} variant="contained" color="success">
          Complete Sale
        </Button>
      </DialogActions>
    </Dialog>
  );
};
