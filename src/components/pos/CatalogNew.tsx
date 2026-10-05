import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import api from '../../services/api';
import { CatalogSkeleton } from './CatalogSkeleton';
import { toast } from 'react-toastify';
import {
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Chip,
  Box,
  Alert,
} from '@mui/material';
import ReplayIcon from '@mui/icons-material/Replay';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

export const CatalogNew: React.FC = () => {
  const { branchId } = useAuth();
  const { currentCustomer, add } = useCart();

  const [keyword, setKeyword] = useState('');
  const [products, setProducts] = useState<any[]>([]);
  const [hasProductsLoaded, setHasProductsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => {
      setIsOnline(false);
      setIsError(true);
      setErrorMessage('No internet connection.');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const fetchProducts = useCallback(
    async (searchKeyword: string) => {
      setHasProductsLoaded(false);
      setIsError(false);
      setErrorMessage('');

      try {
        const response = await api.get('stock/pos-search', {
          params: {
            branchId,
            productName: searchKeyword.trim(),
          },
        });
        setProducts(response.data?.data?.item1 ?? []);
      } catch (err: any) {
        setIsError(true);
        setErrorMessage('Failed to fetch products. Please try again.');
        setProducts([]);
      } finally {
        setHasProductsLoaded(true);
      }
    },
    [branchId]
  );

  // Debounced search on keyword change
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts(keyword);
    }, 400);

    return () => clearTimeout(timer);
  }, [keyword, fetchProducts]);

  const handleResetFilter = () => {
    setKeyword('');
  };

  const handleAddToCart = (product: any) => {
    if (!currentCustomer) {
      toast.error('Select a customer');
      return;
    }
    add(product);
  };

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ mb: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={9}>
            <TextField
              fullWidth
              size="small"
              label="Filter Products"
              placeholder="Search For Products"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <Button
              fullWidth
              variant="contained"
              color="secondary"
              startIcon={<ReplayIcon />}
              onClick={handleResetFilter}
            >
              Reload
            </Button>
          </Grid>
        </Grid>
      </Box>

      {!isOnline && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          You are offline. Search will retry when connection is back.
        </Alert>
      )}

      {isError && isOnline && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errorMessage}
        </Alert>
      )}

      {!hasProductsLoaded && !isError && <CatalogSkeleton />}

      {hasProductsLoaded && !isError && (
        <Grid container spacing={2}>
          {products.map((product) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={product.productId}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderRadius: 2, boxShadow: 2 }}>
                <CardContent sx={{ pb: 1 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1, lineHeight: 1.2 }}>
                    {product.productName}{' '}
                    {product.productPackSize && (
                      <span style={{ fontSize: '11px', border: '1px dotted grey', padding: '0 4px', borderRadius: '2px', fontWeight: 'normal' }}>
                        {product.productPackSize}
                      </span>
                    )}
                  </Typography>

                  <Typography variant="caption" color="textSecondary" component="div" sx={{ mb: 1 }}>
                    <Chip label={product.productCategory || 'General'} size="small" variant="outlined" color="success" sx={{ height: '20px', fontSize: '10px', mr: 0.5 }} />
                    {product.supplierName}
                  </Typography>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                    <Typography variant="body1" color="primary" sx={{ fontWeight: 'bold' }}>
                      ৳ {product.mrp?.toFixed(2)}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      In Stock: <b>{product.quantity}</b>
                    </Typography>
                  </Box>
                </CardContent>

                <CardActions sx={{ p: 1.5, pt: 0 }}>
                  <Button
                    fullWidth
                    size="small"
                    variant="contained"
                    color="secondary"
                    startIcon={<ShoppingCartIcon />}
                    onClick={() => handleAddToCart(product)}
                  >
                    ADD TO CART
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
          {products.length === 0 && (
            <Grid item xs={12}>
              <Typography variant="body1" color="textSecondary" align="center" sx={{ py: 4 }}>
                No products found matching your filter.
              </Typography>
            </Grid>
          )}
        </Grid>
      )}
    </Box>
  );
};
