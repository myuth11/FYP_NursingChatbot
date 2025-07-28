import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLogout } from '../hooks/useLogout';
import { useAuthContext } from '../hooks/useAuthContext';
import '../index.css';

const SettingsPage = () => {
  const navigate = useNavigate();
  const { logout } = useLogout();
  const { user } = useAuthContext();
  const [settings, setSettings] = useState({
    theme: 'light',
    notifications: true,
    autoSave: true,
    language: 'en',
    fontSize: 'medium',
    defaultCalculator: 'maintenance',
    showTooltips: true,
    emailNotifications: false,
    soundEnabled: true,
    autoLogout: '30'
  });

  const [userProfile, setUserProfile] = useState({
    name: 'Nurse User',
    email: 'nurse@hospital.com',
    department: 'Pediatrics',
    role: 'Registered Nurse',
    employeeId: 'N12345'
  });

  const [feedback, setFeedback] = useState('');

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleProfileChange = (key, value) => {
    setUserProfile(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSaveSettings = () => {
    alert('Settings saved successfully!');
  };

  const handleSubmitFeedback = () => {
    if (feedback.trim()) {
      alert('Thank you for your feedback! We will review it shortly.');
      setFeedback('');
    }
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
          <li onClick={() => navigate('/calculator')}>💧 Fluid Calculator</li>
          <li onClick={() => navigate('/modules')}>📚 Learning Modules</li>
        </ul>

        <div className="sidebar-footer-bottom">
          <ul className="menu-list">
            <li onClick={() => navigate('/help')}>❓ Help center</li>
            <li onClick={() => navigate('/settings')} style={{backgroundColor: '#e6f0ff'}}>⚙️ Settings</li>
            <li onClick={() => { logout(); navigate('/'); }}>🚪 Logout</li>
          </ul>
        </div>
      </aside>

      {/* CENTER CONTENT */}
      <main className="chat-main scrollable-content">
        <div className="content-container">
          <div className="settings-container">
            <h2 className="settings-title">Settings</h2>
            <p className="settings-subtitle">Customize your NurseAid experience</p>

            {/* User Profile Section */}
            <div className="settings-section">
              <h3 className="section-title">👤 User Profile</h3>
              <div className="profile-form">
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input
                      type="text"
                      value={userProfile.name}
                      onChange={(e) => handleProfileChange('name', e.target.value)}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      value={userProfile.email}
                      onChange={(e) => handleProfileChange('email', e.target.value)}
                      className="form-input"
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Department</label>
                    <select
                      value={userProfile.department}
                      onChange={(e) => handleProfileChange('department', e.target.value)}
                      className="form-input"
                    >
                      <option value="Pediatrics">Pediatrics</option>
                      <option value="ICU">ICU</option>
                      <option value="Emergency">Emergency</option>
                      <option value="General Ward">General Ward</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Role</label>
                    <select
                      value={userProfile.role}
                      onChange={(e) => handleProfileChange('role', e.target.value)}
                      className="form-input"
                    >
                      <option value="Registered Nurse">Registered Nurse</option>
                      <option value="Staff Nurse">Staff Nurse</option>
                      <option value="Senior Nurse">Senior Nurse</option>
                      <option value="Nurse Manager">Nurse Manager</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* App Preferences */}
            <div className="settings-section">
              <h3 className="section-title">🎨 App Preferences</h3>
              <div className="preferences-grid">
                <div className="preference-item">
                  <label className="preference-label">Theme</label>
                  <select
                    value={settings.theme}
                    onChange={(e) => handleSettingChange('theme', e.target.value)}
                    className="preference-select"
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="auto">Auto</option>
                  </select>
                </div>

                <div className="preference-item">
                  <label className="preference-label">Font Size</label>
                  <select
                    value={settings.fontSize}
                    onChange={(e) => handleSettingChange('fontSize', e.target.value)}
                    className="preference-select"
                  >
                    <option value="small">Small</option>
                    <option value="medium">Medium</option>
                    <option value="large">Large</option>
                  </select>
                </div>

                <div className="preference-item">
                  <label className="preference-label">Default Calculator</label>
                  <select
                    value={settings.defaultCalculator}
                    onChange={(e) => handleSettingChange('defaultCalculator', e.target.value)}
                    className="preference-select"
                  >
                    <option value="maintenance">Maintenance</option>
                    <option value="neonatal">Neonatal</option>
                    <option value="dehydration">Dehydration</option>
                  </select>
                </div>

                <div className="preference-item">
                  <label className="preference-label">Language</label>
                  <select
                    value={settings.language}
                    onChange={(e) => handleSettingChange('language', e.target.value)}
                    className="preference-select"
                  >
                    <option value="en">English</option>
                    <option value="zh">中文</option>
                    <option value="ms">Bahasa Malaysia</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Notifications & Alerts */}
            <div className="settings-section">
              <h3 className="section-title">🔔 Notifications & Alerts</h3>
              <div className="toggle-options">
                <div className="toggle-item">
                  <label className="toggle-label">
                    <input
                      type="checkbox"
                      checked={settings.notifications}
                      onChange={(e) => handleSettingChange('notifications', e.target.checked)}
                    />
                    In-app notifications
                  </label>
                </div>
                <div className="toggle-item">
                  <label className="toggle-label">
                    <input
                      type="checkbox"
                      checked={settings.emailNotifications}
                      onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
                    />
                    Email notifications
                  </label>
                </div>
                <div className="toggle-item">
                  <label className="toggle-label">
                    <input
                      type="checkbox"
                      checked={settings.soundEnabled}
                      onChange={(e) => handleSettingChange('soundEnabled', e.target.checked)}
                    />
                    Sound alerts
                  </label>
                </div>
                <div className="toggle-item">
                  <label className="toggle-label">
                    <input
                      type="checkbox"
                      checked={settings.showTooltips}
                      onChange={(e) => handleSettingChange('showTooltips', e.target.checked)}
                    />
                    Show tooltips
                  </label>
                </div>
              </div>
            </div>

            {/* Security Settings */}
            <div className="settings-section">
              <h3 className="section-title">🔐 Security Settings</h3>
              <div className="security-options">
                <div className="security-item">
                  <label className="form-label">Auto-logout after (minutes)</label>
                  <select
                    value={settings.autoLogout}
                    onChange={(e) => handleSettingChange('autoLogout', e.target.value)}
                    className="form-input"
                  >
                    <option value="15">15 minutes</option>
                    <option value="30">30 minutes</option>
                    <option value="60">1 hour</option>
                    <option value="120">2 hours</option>
                  </select>
                </div>
                <div className="security-actions">
                  <button className="btn btn-secondary">Change Password</button>
                  <button className="btn btn-secondary">Two-Factor Authentication</button>
                </div>
              </div>
            </div>

            {/* Feedback Section */}
            <div className="settings-section">
              <h3 className="section-title">💬 Feedback</h3>
              <div className="feedback-form">
                <label className="form-label">Help us improve NurseAid</label>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Share your suggestions, report issues, or tell us what you love about NurseAid..."
                  className="feedback-textarea"
                  rows="4"
                />
                <button 
                  className="btn btn-primary"
                  onClick={handleSubmitFeedback}
                  disabled={!feedback.trim()}
                >
                  Submit Feedback
                </button>
              </div>
            </div>

            {/* Save Settings */}
            <div className="settings-actions">
              <button className="btn btn-primary" onClick={handleSaveSettings}>
                Save Settings
              </button>
              <button className="btn btn-secondary">
                Reset to Defaults
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* RIGHT SIDEBAR */}
      <aside className="sidebar-right">
        <h4>Quick Actions</h4>
        <ul className="quick-actions">
          <li>🔄 Sync Data</li>
          <li>📥 Export Settings</li>
          <li>📤 Import Settings</li>
          <li>🗑️ Clear Cache</li>
          <li>❓ Help & Support</li>
        </ul>
        
        <div className="app-info">
          <h4>App Information</h4>
          <p><strong>Version:</strong> 2.1.0</p>
          <p><strong>Last Updated:</strong> Jul 15, 2025</p>
          <p><strong>Build:</strong> 2025.07.15</p>
        </div>
      </aside>
    </div>
  );
};

export default SettingsPage;