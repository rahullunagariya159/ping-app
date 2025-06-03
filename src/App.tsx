import React, { useState } from 'react';
import { PingProvider } from './context/PingContext';
import AddTestForm from './components/AddTestForm';
import ReportPage from './components/ReportPage';
import { Button } from 'antd';
import { Container, ButtonGroup } from './AppStyle';
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';

const App: React.FC = () => {
  const [view, setView] = useState<'add' | 'report'>('add');
  const location = useLocation();

  return (
    <PingProvider>
      <Container>
        <ButtonGroup>
          <Link to="/add">
            <Button type={location.pathname === '/add' ? 'primary' : 'default'}>
              Add New Ping Test
            </Button>
          </Link>
          <Link to="/report">
            <Button type={location.pathname === '/report' ? 'primary' : 'default'}>
              View Report
            </Button>
          </Link>
        </ButtonGroup>

        <Routes>
          <Route path="/" element={<Navigate to="/add" replace />} />
          <Route path="/add" element={<AddTestForm />} />
          <Route path="/report" element={<ReportPage />} />
          <Route path="*" element={<Navigate to="/add" replace />} />
        </Routes>
      </Container>
    </PingProvider>
  );
};

export default App;