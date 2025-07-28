import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLogout } from '../hooks/useLogout';
import { useAuthContext } from '../hooks/useAuthContext';
import '../index.css';
import '../components/tabs/tabs.css';
import MaintenanceCalculator from '../components/tabs/MaintenanceCalculator';
import NeonatalCalculator from '../components/tabs/NeonatalCalculator';
import DehydrationCalculator from '../components/tabs/DehydrationCalculator';

const FluidCalculatorPage = () => {
  const [activeTab, setActiveTab] = useState('maintenance');
  const navigate = useNavigate();
  const { logout } = useLogout();
  const { user } = useAuthContext();

  const tabs = [
    { id: 'maintenance', label: 'Maintenance', component: MaintenanceCalculator },
    { id: 'neonatal', label: 'Neonatal', component: NeonatalCalculator },
    { id: 'dehydration', label: 'Dehydration', component: DehydrationCalculator },
  ];

  const renderTabContent = () => {
    const activeTabData = tabs.find(tab => tab.id === activeTab);
    const Component = activeTabData.component;
    return <Component />;
  };

  return (
    <div className="chat-wrapper">
      {/* LEFT SIDEBAR */}
      <aside className="sidebar-left">
        <div className="sidebar-header">
          <img src="/logo.jpg" alt="NurseAid" className="sidebar-logo" />
          <h2>NurseAid</h2>
        </div>

        <input type="text" placeholder="Search" className="search-bar" />

        <ul className="menu-list">
          <li onClick={() => navigate('/chat')}>💬 Chat</li>
          <li onClick={() => navigate('/protocols')}>📋 Clinical Protocols</li>
          <li onClick={() => navigate('/calculator')} style={{backgroundColor: '#e6f0ff'}}>💧 Fluid Calculator</li>
          <li onClick={() => navigate('/modules')}>📚 Learning Modules</li>
        </ul>

        <div className="sidebar-footer-bottom">
          <ul className="menu-list">
            <li onClick={() => navigate('/help')}>❓ Help center</li>
            <li onClick={() => navigate('/settings')}>⚙️ Settings</li>
            <li onClick={() => { logout(); navigate('/'); }}>🚪 Logout</li>
          </ul>
        </div>
      </aside>

      {/* CENTER CONTENT WITH TABS */}
      <main className="chat-main scrollable-content">
        <div className="tabs-container">
          <h2 className="tabs-title">Pediatric Fluid Calculator</h2>
          
          {/* Tab Navigation */}
          <div className="tabs-nav">
            <div className="tabs-nav-container">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="tab-content">
            {renderTabContent()}
          </div>
        </div>
      </main>

      {/* RIGHT SIDEBAR */}
      <aside className="sidebar-right">
        <h4>Chat History</h4>
        <ul className="chat-history">
          <li>the protocol for paediatric fever</li>
          <li>Can you calculate IV rate?</li>
          <li>I want to review maintenance fluids</li>
          <li>What’s the protocol for diarrhoea?</li>
          <li>SOP for central line flush</li>
        </ul>
        <button className="clear-history">🗑️ Clear History</button>
      </aside>
    </div>
  );
};

export default FluidCalculatorPage;
