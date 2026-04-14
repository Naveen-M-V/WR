import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { measurePageLoad } from './utils/performanceMonitor';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

// Measure page load performance
measurePageLoad();

// Log Web Vitals to console in development
if (process.env.NODE_ENV === 'development') {
  reportWebVitals(console.log);
}
