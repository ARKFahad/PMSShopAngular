import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Box,
} from '@mui/material';

export const LoginComponent: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const returnUrl = searchParams.get('returnUrl') || '/home';

  const [username, setUsername] = useState('test');
  const [password, setPassword] = useState('12300');
  const [isBeingLoggedIn, setIsBeingLoggedIn] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) return;

    setIsBeingLoggedIn(true);
    const success = await login({ username, password });
    setIsBeingLoggedIn(false);

    if (success) {
      navigate(returnUrl);
    }
  };

  const fillSuperAdminCredentials = () => {
    setUsername('test');
    setPassword('12300');
  };

  const fillStaffCredentials = () => {
    setUsername('staff@fluentpos.com');
    setPassword('123Pa$$word!');
  };

  return (
    <div className="content" style={{ width: '100%', maxWidth: '900px', margin: '0 auto', padding: '20px' }}>
      <div className="container">
        <Card className="mat-card-login" sx={{ borderRadius: 2, boxShadow: '0 10px 60px 0 rgba(29, 29, 31, .09)' }}>
          <CardContent className="mat-card-content-login" sx={{ padding: '32px !important' }}>
            <div className="row">
              <div
                className="col-lg-6 col-md-6 col-xl-6 col-xs-6 d-none d-lg-block login-image"
                style={{
                  backgroundImage: 'url(/images/bg-login.jpg)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  minHeight: '350px',
                  borderRadius: '4px',
                }}
              ></div>
              <div className="col-lg-6 col-md-12 col-xl-6 col-xs-6 login-form">
                <form onSubmit={handleSubmit}>
                  <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', mb: 1 }}>
                    Sign in to POS
                  </Typography>
                  <Typography variant="subtitle1" color="textSecondary" sx={{ mb: 3 }}>
                    Enter your credentials here.
                  </Typography>

                  <Box sx={{ mb: 2 }}>
                    <TextField
                      fullWidth
                      label="Username"
                      variant="outlined"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                      disabled={isBeingLoggedIn}
                    />
                  </Box>

                  <Box sx={{ mb: 3 }}>
                    <TextField
                      fullWidth
                      type="password"
                      label="Password"
                      variant="outlined"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={isBeingLoggedIn}
                    />
                  </Box>

                  <Button
                    fullWidth
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={isBeingLoggedIn || !username || !password}
                    sx={{ height: '50px', mb: 2, fontSize: '16px' }}
                  >
                    {isBeingLoggedIn ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CircularProgress size={20} color="inherit" />
                        Logging you in..
                      </Box>
                    ) : (
                      'Sign In'
                    )}
                  </Button>
                </form>

                <div className="row mt-2">
                  <div className="col">
                    <Button
                      fullWidth
                      variant="outlined"
                      color="secondary"
                      onClick={fillSuperAdminCredentials}
                      sx={{ height: '40px', fontSize: '12px' }}
                    >
                      Superadmin Credentials
                    </Button>
                  </div>
                  <div className="col">
                    <Button
                      fullWidth
                      variant="outlined"
                      color="secondary"
                      onClick={fillStaffCredentials}
                      sx={{ height: '40px', fontSize: '12px' }}
                    >
                      Staff Credentials
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
