import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { DiscountDialog } from './dialogs/DiscountDialog';
import { CashPaymentDialog } from './dialogs/CashPaymentDialog';
import { CardPaymentDialog } from './dialogs/CardPaymentDialog';
import { CreditPaymentDialog } from './dialogs/CreditPaymentDialog';
import api from '../../services/api';
import { toast } from 'react-toastify';
import {
  Box,
  Typography,
  IconButton,
  Button,
  List,
  ListItem,
  TextField,
  Divider,
  Paper,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import MoneyIcon from '@mui/icons-material/Money';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

interface CartProps {
  onCloseDrawer?: () => void;
}

export const Cart: React.FC<CartProps> = ({ onCloseDrawer }) => {
  const { cartItems, increase, reduce, remove, onChangeQuantity, isCartInvalid, currentCustomer } = useCart();

  const [fixedDiscount, setFixedDiscount] = useState<number>(0);
  const [percentDiscount, setPercentDiscount] = useState<number>(0);

  const [fixedDiscountDialogOpen, setFixedDiscountDialogOpen] = useState(false);
  const [percentDiscountDialogOpen, setPercentDiscountDialogOpen] = useState(false);

  const [cashDialogOpen, setCashDialogOpen] = useState(false);
  const [cardDialogOpen, setCardDialogOpen] = useState(false);
  const [creditDialogOpen, setCreditDialogOpen] = useState(false);

  // Sub total calculation
  const subTotal = cartItems.reduce((acc, item) => acc + item.total, 0);

  // Discount calculation
  let calculatedDiscount = fixedDiscount;
  if (percentDiscount > 0) {
    calculatedDiscount += (subTotal * percentDiscount) / 100;
  }
  if (calculatedDiscount > subTotal) {
    calculatedDiscount = subTotal;
  }

  const netTotal = Math.max(0, subTotal - calculatedDiscount);

  const handleSaleSuccess = async (saleId: string) => {
    setCashDialogOpen(false);
    setCardDialogOpen(false);
    setCreditDialogOpen(false);
    setFixedDiscount(0);
    setPercentDiscount(0);

    toast.info('Generating Invoice PDF...');
    try {
      const response = await api.get(`sale/invoice/${saleId}`, {
        responseType: 'blob',
      });
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      window.open(url, '_blank');
    } catch {
      toast.error('Could not download invoice PDF');
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        width: 380,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.paper',
        p: 2,
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Typography variant="h6" fontWeight="bold">
          Cart Items ({cartItems.length})
        </Typography>
        {currentCustomer && (
          <Typography variant="caption" color="textSecondary">
            Customer: <b>{currentCustomer.name}</b>
          </Typography>
        )}
      </Box>

      <Divider sx={{ mb: 1 }} />

      {/* Cart Item List */}
      <Box sx={{ flexGrow: 1, overflowY: 'auto', pr: 0.5 }}>
        {cartItems.length === 0 ? (
          <Box sx={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
            <Typography variant="body2" color="textSecondary">
              Your cart is empty
            </Typography>
          </Box>
        ) : (
          <List disablePadding>
            {cartItems.map((item) => (
              <ListItem
                key={item.productId}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'stretch',
                  p: 1,
                  mb: 1,
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 1,
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" fontWeight="bold">
                    {item.productName}
                  </Typography>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => remove(item.productId)}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <IconButton
                      size="small"
                      onClick={() => reduce(item.productId, item.productStockQuantity)}
                    >
                      <RemoveIcon fontSize="small" />
                    </IconButton>

                    <TextField
                      size="small"
                      type="number"
                      value={item.quantity}
                      onChange={(e) =>
                        onChangeQuantity(
                          item.productId,
                          parseInt(e.target.value) || 1,
                          item.productStockQuantity
                        )
                      }
                      inputProps={{ style: { textAlign: 'center', padding: '4px' } }}
                      sx={{ width: '50px' }}
                    />

                    <IconButton
                      size="small"
                      onClick={() => increase(item.productId, item.productStockQuantity)}
                    >
                      <AddIcon fontSize="small" />
                    </IconButton>
                  </Box>

                  <Typography variant="body2" fontWeight="bold" color="primary">
                    ৳ {item.total?.toFixed(2)}
                  </Typography>
                </Box>
              </ListItem>
            ))}
          </List>
        )}
      </Box>

      <Divider sx={{ my: 1 }} />

      {/* Totals & Discounts Section */}
      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
          <Typography variant="body2" color="textSecondary">Sub Total:</Typography>
          <Typography variant="body2" fontWeight="bold">৳ {subTotal.toFixed(2)}</Typography>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1, my: 1 }}>
          <Button
            size="small"
            variant="outlined"
            startIcon={<LocalOfferIcon fontSize="small" />}
            onClick={() => setFixedDiscountDialogOpen(true)}
            sx={{ flex: 1, fontSize: '11px' }}
          >
            Discount ৳ ({fixedDiscount})
          </Button>
          <Button
            size="small"
            variant="outlined"
            startIcon={<LocalOfferIcon fontSize="small" />}
            onClick={() => setPercentDiscountDialogOpen(true)}
            sx={{ flex: 1, fontSize: '11px' }}
          >
            Discount % ({percentDiscount}%)
          </Button>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
          <Typography variant="body2" color="textSecondary">Calculated Discount:</Typography>
          <Typography variant="body2" color="error">৳ {calculatedDiscount.toFixed(2)}</Typography>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1, p: 1, bgcolor: 'action.hover', borderRadius: 1 }}>
          <Typography variant="subtitle1" fontWeight="bold">Net Total:</Typography>
          <Typography variant="subtitle1" fontWeight="bold" color="primary">
            ৳ {netTotal.toFixed(2)}
          </Typography>
        </Box>
      </Box>

      {/* Checkout Action Buttons */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Button
          variant="contained"
          color="success"
          disabled={cartItems.length === 0 || isCartInvalid}
          startIcon={<MoneyIcon />}
          onClick={() => setCashDialogOpen(true)}
        >
          Cash Payment
        </Button>
        <Button
          variant="contained"
          color="primary"
          disabled={cartItems.length === 0 || isCartInvalid}
          startIcon={<CreditCardIcon />}
          onClick={() => setCardDialogOpen(true)}
        >
          Card Payment
        </Button>
        <Button
          variant="contained"
          color="warning"
          disabled={cartItems.length === 0 || isCartInvalid}
          startIcon={<AccountBalanceWalletIcon />}
          onClick={() => setCreditDialogOpen(true)}
        >
          Credit Sale
        </Button>
      </Box>

      {/* Dialog Modals */}
      <DiscountDialog
        open={fixedDiscountDialogOpen}
        isPercentage={false}
        onClose={() => setFixedDiscountDialogOpen(false)}
        onApply={(val) => setFixedDiscount(val)}
      />

      <DiscountDialog
        open={percentDiscountDialogOpen}
        isPercentage={true}
        onClose={() => setPercentDiscountDialogOpen(false)}
        onApply={(val) => setPercentDiscount(val)}
      />

      <CashPaymentDialog
        open={cashDialogOpen}
        subTotal={subTotal}
        discount={calculatedDiscount}
        netTotal={netTotal}
        onClose={() => setCashDialogOpen(false)}
        onSuccess={handleSaleSuccess}
      />

      <CardPaymentDialog
        open={cardDialogOpen}
        subTotal={subTotal}
        discount={calculatedDiscount}
        netTotal={netTotal}
        onClose={() => setCardDialogOpen(false)}
        onSuccess={handleSaleSuccess}
      />

      <CreditPaymentDialog
        open={creditDialogOpen}
        subTotal={subTotal}
        discount={calculatedDiscount}
        netTotal={netTotal}
        onClose={() => setCreditDialogOpen(false)}
        onSuccess={handleSaleSuccess}
      />
    </Paper>
  );
};
