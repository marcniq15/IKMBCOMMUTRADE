import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // You can keep this, though we don't use it much
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

serviceWorkerRegistration.register();