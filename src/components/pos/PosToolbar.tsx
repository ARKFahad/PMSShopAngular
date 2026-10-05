import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCart, Customer } from '../../context/CartContext';
import { useTheme } from '../../context/ThemeContext';
import api from '../../services/api';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Button,
  Badge,
  Box,
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import BedtimeIcon from '@mui/icons-material/Bedtime';
import PersonIcon from '@mui/icons-material/Person';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

interface PosToolbarProps {
  onToggleCartDrawer: () => void;
  onOpenCustomerSelection: () => void;
}

export const PosToolbar: React.FC<PosToolbarProps> = ({
  onToggleCartDrawer,
  onOpenCustomerSelection,
}) => {
  const { fullName, branchId } = useAuth();
  const { cartItems, currentCustomer, setCurrentCustomer, getCustomerCart } = useCart();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [branchName, setBranchName] = useState<string>('');

  useEffect(() => {
    if (!currentCustomer) {
      const defaultCustomer: Customer = {
        id: '8156b38d-8724-4a18-8116-303bcf408701',
        name: 'CASH CUSTOMER',
        balance: 0,
      };
      setCurrentCustomer(defaultCustomer);
      getCustomerCart(defaultCustomer.id);
    }
  }, [currentCustomer, setCurrentCustomer, getCustomerCart]);

  useEffect(() => {
    if (branchId) {
      api
        .get(`branch/${branchId}`)
        .then((res) => {
          setBranchName(res.data?.data?.name || '');
        })
        .catch(() => {});
    }
  }, [branchId]);

  const cartItemCount = cartItems.length;

  return (
    <AppBar position="static" color="default" sx={{ boxShadow: 1, zIndex: 1100 }}>
      <Toolbar sx={{ justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            POS Software
          </Typography>
          {branchName && (
            <Typography variant="subtitle2" color="textSecondary" sx={{ bgcolor: 'action.selected', px: 1.5, py: 0.5, borderRadius: 1 }}>
              Branch: <b>{branchName}</b>
            </Typography>
          )}
          <Typography variant="subtitle2" color="textSecondary">
            User: <b>{fullName}</b>
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          {currentCustomer ? (
            <Box sx={{ display: 'flex', alignItems: 'center', bgcolor: 'primary.light', color: 'primary.contrastText', px: 2, py: 0.75, borderRadius: 2, gap: 1 }}>
              <PersonIcon fontSize="small" />
              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                {currentCustomer.name}
              </Typography>
              <Button
                size="small"
                variant="outlined"
                color="inherit"
                onClick={onOpenCustomerSelection}
                sx={{ minWidth: 'auto', px: 1, py: 0.2, ml: 1, fontSize: '11px', borderStyle: 'dashed' }}
              >
                Change
              </Button>
            </Box>
          ) : (
            <Button
              variant="contained"
              color="primary"
              startIcon={<PersonAddIcon />}
              onClick={onOpenCustomerSelection}
            >
              Select Customer
            </Button>
          )}

          <IconButton color="inherit" onClick={toggleDarkMode}>
            {isDarkMode ? <BedtimeIcon /> : <WbSunnyIcon />}
          </IconButton>

          <IconButton color="primary" onClick={onToggleCartDrawer}>
            <Badge badgeContent={cartItemCount} color="error">
              <ShoppingCartIcon />
            </Badge>
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};
