import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from '@mui/material';

interface DiscountDialogProps {
  open: boolean;
  isPercentage?: boolean;
  onClose: () => void;
  onApply: (discount: number) => void;
}

export const DiscountDialog: React.FC<DiscountDialogProps> = ({
  open,
  isPercentage = false,
  onClose,
  onApply,
}) => {
  const [value, setValue] = useState('');

  const handleApply = () => {
    const num = parseFloat(value);
    if (!isNaN(num) && num >= 0) {
      onApply(num);
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>{isPercentage ? 'Apply Discount (%)' : 'Apply Fixed Discount'}</DialogTitle>
      <DialogContent dividers>
        <TextField
          fullWidth
          size="small"
          autoFocus
          label={isPercentage ? 'Discount Percentage (%)' : 'Discount Amount'}
          type="number"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button onClick={handleApply} variant="contained" color="primary">
          Apply
        </Button>
      </DialogActions>
    </Dialog>
  );
};
