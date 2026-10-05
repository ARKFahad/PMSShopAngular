import React, { useState } from 'react';
import { PosToolbar } from './PosToolbar';
import { CatalogNew } from './CatalogNew';
import { Cart } from './Cart';
import { CustomerSelectionDialog } from './dialogs/CustomerSelectionDialog';
import { CustomerRegisterDialog } from './dialogs/CustomerRegisterDialog';
import { CustomerPaymentDialog } from './dialogs/CustomerPaymentDialog';
import { Customer } from '../../context/CartContext';
import { Drawer, Box } from '@mui/material';

export const PosComponent: React.FC = () => {
  const [cartDrawerOpen, setCartDrawerOpen] = useState(true);
  const [customerSelectionOpen, setCustomerSelectionOpen] = useState(false);
  const [customerRegisterOpen, setCustomerRegisterOpen] = useState(false);
  const [customerPaymentOpen, setCustomerPaymentOpen] = useState(false);

  const [registerSearchName, setRegisterSearchName] = useState('');
  const [selectedPaymentCustomer, setSelectedPaymentCustomer] = useState<Customer | null>(null);

  const handleOpenRegister = (searchName: string) => {
    setRegisterSearchName(searchName);
    setCustomerSelectionOpen(false);
    setCustomerRegisterOpen(true);
  };

  const handleOpenPayment = (customer: Customer) => {
    setSelectedPaymentCustomer(customer);
    setCustomerSelectionOpen(false);
    setCustomerPaymentOpen(true);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      <PosToolbar
        onToggleCartDrawer={() => setCartDrawerOpen((prev) => !prev)}
        onOpenCustomerSelection={() => setCustomerSelectionOpen(true)}
      />

      <Box sx={{ display: 'flex', flexGrow: 1, overflow: 'hidden' }}>
        <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
          <CatalogNew />
        </Box>

        <Drawer
          anchor="right"
          variant="persistent"
          open={cartDrawerOpen}
          onClose={() => setCartDrawerOpen(false)}
          PaperProps={{ sx: { position: 'relative', height: '100%' } }}
        >
          <Cart onCloseDrawer={() => setCartDrawerOpen(false)} />
        </Drawer>
      </Box>

      {/* Customer Dialogs */}
      <CustomerSelectionDialog
        open={customerSelectionOpen}
        onClose={() => setCustomerSelectionOpen(false)}
        onOpenRegister={handleOpenRegister}
        onOpenPayment={handleOpenPayment}
      />

      <CustomerRegisterDialog
        open={customerRegisterOpen}
        initialName={registerSearchName}
        onClose={() => setCustomerRegisterOpen(false)}
      />

      <CustomerPaymentDialog
        open={customerPaymentOpen}
        customer={selectedPaymentCustomer}
        onClose={() => setCustomerPaymentOpen(false)}
      />
    </Box>
  );
};
