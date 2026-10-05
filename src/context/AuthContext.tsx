import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';
import api from '../services/api';

interface DecodedToken {
  unique_name?: string;
  branchId?: string;
  role?: string;
  Permission?: string[];
  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'?: string;
  exp?: number;
}

interface AuthContextType {
  token: string | null;
  isAuthenticated: boolean;
  fullName: string;
  branchId: string;
  email: string;
  login: (credentials: { username: string; password: string }) => Promise<boolean>;
  logout: () => void;
  isAuthorized: (authorizationType: string, allowedData: string[]) => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

  const getDecodedToken = (): DecodedToken | null => {
    if (!token) return null;
    try {
      return jwtDecode<DecodedToken>(token);
    } catch {
      return null;
    }
  };

  const decodedToken = getDecodedToken();

  const isAuthenticated = !!token && !!decodedToken && (decodedToken.exp ? decodedToken.exp * 1000 > Date.now() : true);

  const fullName = decodedToken?.unique_name || '';
  const branchId = decodedToken?.branchId || '';
  const email = decodedToken?.['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] || '';

  const login = async (credentials: { username: string; password: string }): Promise<boolean> => {
    try {
      const response = await api.post('auth/login', credentials);
      const result = response.data;
      if (result?.succeeded === true) {
        const tokenData = result.data;
        localStorage.setItem('token', tokenData);
        setToken(tokenData);
        toast.info('User Logged In');
        return true;
      } else {
        toast.error(result?.messages?.[0] || 'Login failed');
        return false;
      }
    } catch (err: any) {
      toast.error(err.response?.data?.messages?.[0] || 'Login failed');
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    toast.info('User Logged Out');
  };

  const isAuthorized = (authorizationType: string, allowedData: string[]): boolean => {
    if (!allowedData || allowedData.length === 0) return true;
    if (!decodedToken) return false;

    if (authorizationType === 'Role') {
      return decodedToken.role === 'Salesman';
    } else if (authorizationType === 'Permission') {
      const permissions = decodedToken.Permission;
      if (!permissions || permissions.length === 0) return false;
      return allowedData.some((a) => permissions.includes(a));
    }
    return false;
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        isAuthenticated,
        fullName,
        branchId,
        email,
        login,
        logout,
        isAuthorized,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
