import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { QuotesProvider } from './context/QuotesContext';

// React 18 için createRoot kullanılır
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <QuotesProvider>
      <App />
    </QuotesProvider>
  </React.StrictMode>
);


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

