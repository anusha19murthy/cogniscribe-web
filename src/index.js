import React from 'react';
import ReactDOM from 'react-dom/client';
import { GoogleOAuthProvider } from '@react-oauth/google';
import './App.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
// Use environment variable, fallback to empty string if not set (which will cause a warning, but UI will load)
const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID || 'dummy-client-id.apps.googleusercontent.com';

root.render(
  <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
    <App />
  </GoogleOAuthProvider>
);