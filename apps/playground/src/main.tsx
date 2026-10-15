import React from 'react';
import { createRoot } from 'react-dom/client';
import { Playground } from './playground';
import './playground.css';

createRoot(document.getElementById('root')!).render(
  <React.StrictMode><Playground /></React.StrictMode>
);
