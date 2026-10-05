import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { CartProvider } from './context/CartContext';
import { ToastContainer } from 'react-toastify';

import { AuthLayout } from './layouts/AuthLayout';
import { HomeLayout } from './layouts/HomeLayout';
import { PosLayout } from './layouts/PosLayout';

import { LoginComponent } from './components/auth/LoginComponent';
import { WelcomeComponent } from './components/home/WelcomeComponent';
import { PosComponent } from './components/pos/PosComponent';

import { NotFoundComponent } from './components/shared/NotFoundComponent';
import { AccessDenialComponent } from './components/shared/AccessDenialComponent';
import { ServerErrorComponent } from './components/shared/ServerErrorComponent';
import { AuthGuard, RoleGuard } from './components/shared/Guards';

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <BrowserRouter>
            <Routes>
              {/* Default Redirect */}
              <Route path="/" element={<Navigate to="/home" replace />} />

              {/* Auth Route */}
              <Route element={<AuthLayout />}>
                <Route path="/login" element={<LoginComponent />} />
              </Route>

              {/* Protected Home Route */}
              <Route element={<AuthGuard />}>
                <Route element={<HomeLayout />}>
                  <Route path="/home" element={<WelcomeComponent />} />
                </Route>
              </Route>

              {/* Protected POS Route */}
              <Route element={<AuthGuard />}>
                <Route element={<PosLayout />}>
                  <Route path="/pos" element={<PosComponent />} />
                </Route>
              </Route>

              {/* Error Routes */}
              <Route path="/access-denial" element={<AccessDenialComponent />} />
              <Route path="/not-found" element={<NotFoundComponent />} />
              <Route path="/server-error" element={<ServerErrorComponent />} />
              <Route path="*" element={<Navigate to="/not-found" replace />} />
            </Routes>
          </BrowserRouter>
          <ToastContainer position="top-right" autoClose={3000} />
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
