import React, { useState, useEffect, useRef } from 'react';
import { UserProvider, useUser } from './contexts/UserContext';
import Layout from './components/Layout';
import './App.css';

function AppInner() {
  return <Layout />;
}

export default function App() {
  return (
    <UserProvider>
      <AppInner />
    </UserProvider>
  );
}
