import React from 'react';
import { Outlet } from 'react-router-dom';

export const PosLayout: React.FC = () => {
  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <Outlet />
    </div>
  );
};
