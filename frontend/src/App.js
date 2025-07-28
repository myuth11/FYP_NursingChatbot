import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import { useAuthContext } from './hooks/useAuthContext';
import LandingPage from './pages/LandingPage';
import ChatPage from './pages/ChatPage';
import FluidCalculatorPage from './pages/FluidCalculatorPage';
import EducationalModulesPage from './pages/EducationalModulesPage';
import QuizPage from './pages/QuizPage';
import Login from './pages/Login';
import ProtocolsPage from './pages/ProtocolsPage';
import SettingsPage from './pages/SettingsPage';
import HelpPage from './pages/HelpPage';
import MaterialsPage from './pages/MaterialsPage';
import ModuleIntroPage from './pages/ModuleIntroPage';
import ClinicalScenarioPage from './pages/ClinicalScenarioPage';

const App = () => {
  const { user } = useAuthContext();

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      {/* Protected routes: redirect to login if not authenticated */}
      <Route path="/" element={user ? <LandingPage /> : <Navigate to="/login" />} />
      <Route path="/chat" element={user ? <ChatPage /> : <Navigate to="/login" />} />
      <Route path="/calculator" element={user ? <FluidCalculatorPage /> : <Navigate to="/login" />} />
      <Route path="/modules" element={user ? <EducationalModulesPage /> : <Navigate to="/login" />} />
      <Route path="/modules/intro/:id" element={user ? <ModuleIntroPage /> : <Navigate to="/login" />} />
      <Route path="/quiz" element={user ? <QuizPage /> : <Navigate to="/login" />} />
      <Route path="/quiz/:id" element={user ? <QuizPage /> : <Navigate to="/login" />} />
      <Route path="/materials/:id" element={user ? <MaterialsPage /> : <Navigate to="/login" />} />
      <Route path="/materials/:id/clinical-scenarios" element={user ? <ClinicalScenarioPage /> : <Navigate to="/login" />} /> 
      <Route path="/protocols" element={user ? <ProtocolsPage /> : <Navigate to="/login" />} />
      <Route path="/settings" element={user ? <SettingsPage /> : <Navigate to="/login" />} />
      <Route path="/help" element={user ? <HelpPage /> : <Navigate to="/login" />} />


    </Routes>
  );
};

export default App;
