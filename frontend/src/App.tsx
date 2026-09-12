import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import MerchantPOS from './pages/MerchantPOS';
import './index.css';

const App: React.FC = () => {
  return (
    <Router>
      <div className="app-container" style={{ padding: '0', display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        
        {/* Global Navigation for Demo Purposes */}
        <nav style={{ 
          background: 'var(--bg-surface)', 
          padding: '1rem 2rem', 
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          gap: '2rem',
          alignItems: 'center'
        }}>
          <h1 className="text-gradient" style={{ margin: 0, fontSize: '1.5rem' }}>MS Pay</h1>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Link to="/merchant" style={{ color: 'var(--text-main)', textDecoration: 'none' }}>Merchant POS</Link>
            <Link to="/customer" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Customer Portal (Soon)</Link>
            <Link to="/admin" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Admin (Soon)</Link>
          </div>
        </nav>

        <Routes>
          <Route path="/merchant" element={<MerchantPOS />} />
          <Route path="/customer" element={
            <div style={{ padding: '4rem', textAlign: 'center' }}>
              <h2 className="text-gradient">Customer Dashboard</h2>
              <p>Coming soon...</p>
            </div>
          } />
          <Route path="/admin" element={
            <div style={{ padding: '4rem', textAlign: 'center' }}>
              <h2 className="text-gradient">Admin Dashboard</h2>
              <p>Coming soon...</p>
            </div>
          } />
          <Route path="*" element={<Navigate to="/merchant" replace />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
