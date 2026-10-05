import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './i18n';
import './styles.scss';
import 'bootstrap/dist/css/bootstrap-grid.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'react-toastify/dist/ReactToastify.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
