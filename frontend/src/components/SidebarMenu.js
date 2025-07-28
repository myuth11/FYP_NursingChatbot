import React from 'react';
import { Link } from 'react-router-dom';

const SidebarMenu = () => (
  <div className="sidebar-menu">
    <nav>
      <Link to="/chat">Chat</Link>
      <Link to="/calculator">Fluid Calculator</Link>
      <Link to="/modules">Education</Link>
      <Link to="/drug-info">Drug Info</Link>
      <Link to="/protocols">Protocols</Link>
      <Link to="/settings">Settings</Link>
      <Link to="/help">Help</Link>
    </nav>
  </div>
);

export default SidebarMenu;