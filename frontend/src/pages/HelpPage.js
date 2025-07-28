import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLogout } from '../hooks/useLogout';
import { useAuthContext } from '../hooks/useAuthContext';
import '../index.css';

const HelpPage = () => {
  const [expandedSection, setExpandedSection] = useState(null);
  const navigate = useNavigate();
  const { logout } = useLogout();
  const { user } = useAuthContext();

  const toggleSection = (sectionId) => {
    setExpandedSection(expandedSection === sectionId ? null : sectionId);
  };

  const faqData = [
    {
      id: 1,
      question: "How do I use the Fluid Calculator?",
      answer: "Enter the patient's weight and age, then click 'Calculate' to get maintenance fluid requirements, flow rates, and bolus volumes using the 4-2-1 rule."
    },
    {
      id: 2,
      question: "What is the 4-2-1 rule?",
      answer: "The 4-2-1 rule calculates maintenance fluids: 4 ml/kg/hr for the first 10 kg, 2 ml/kg/hr for the next 10 kg, and 1 ml/kg/hr for each kg above 20 kg."
    },
    {
      id: 3,
      question: "How accurate is the Neonatal Calculator?",
      answer: "The neonatal calculator uses evidence-based formulas for day-of-life specific fluid requirements, with adjustments for premature infants and phototherapy."
    },
    {
      id: 4,
      question: "What does the Dehydration Calculator assess?",
      answer: "It calculates fluid deficits based on percentage dehydration, provides replacement fluid recommendations, and estimates ongoing losses."
    },
    {
      id: 5,
      question: "Can I access clinical protocols offline?",
      answer: "Some protocols are cached for offline viewing, but full functionality requires an internet connection for the latest updates."
    },
    {
      id: 6,
      question: "How do I report issues or bugs?",
      answer: "Contact the IT support team at support@hospital.com or use the feedback form in the Settings page."
    }
  ];

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
            <li onClick={() => navigate('/help')} style={{backgroundColor: '#e6f0ff'}}>❓ Help center</li>
            <li onClick={() => navigate('/settings')}>⚙️ Settings</li>
            <li onClick={() => { logout(); navigate('/'); }}>🚪 Logout</li>
          </ul>
        </div>
      </aside>

      {/* CENTER CONTENT */}
      <main className="chat-main scrollable-content">
        <div className="content-container">
          <div className="help-container">
            <h2 className="help-title">Help Center</h2>
            <p className="help-subtitle">Find answers to common questions and get support for using NurseAid</p>

            {/* Quick Links */}
            <div className="help-section">
              <h3 className="section-title">Quick Links</h3>
              <div className="quick-links">
                <div className="quick-link-card">
                  <div className="quick-link-icon">🧮</div>
                  <h4>Fluid Calculator Guide</h4>
                  <p>Learn how to use the pediatric fluid calculators</p>
                </div>
                <div className="quick-link-card">
                  <div className="quick-link-icon">📋</div>
                  <h4>Clinical Protocols</h4>
                  <p>Access and understand clinical guidelines</p>
                </div>
                <div className="quick-link-card">
                  <div className="quick-link-icon">💊</div>
                  <h4>Drug Information</h4>
                  <p>Search and review medication details</p>
                </div>
              </div>
            </div>

            {/* FAQ Section */}
            <div className="help-section">
              <h3 className="section-title">Frequently Asked Questions</h3>
              <div className="faq-container">
                {faqData.map((faq) => (
                  <div key={faq.id} className="faq-item">
                    <button 
                      className="faq-question"
                      onClick={() => toggleSection(faq.id)}
                    >
                      <span>{faq.question}</span>
                      <span className={`faq-arrow ${expandedSection === faq.id ? 'expanded' : ''}`}>
                        ▼
                      </span>
                    </button>
                    {expandedSection === faq.id && (
                      <div className="faq-answer">
                        <p>{faq.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Support */}
            <div className="help-section">
              <h3 className="section-title">Contact Support</h3>
              <div className="contact-info">
                <div className="contact-method">
                  <h4>📧 Email Support</h4>
                  <p>support@hospital.com</p>
                  <p>Response time: 24-48 hours</p>
                </div>
                <div className="contact-method">
                  <h4>📞 Phone Support</h4>
                  <p>+65 6XXX XXXX</p>
                  <p>Available: Mon-Fri, 9AM-6PM</p>
                </div>
                <div className="contact-method">
                  <h4>🏥 IT Help Desk</h4>
                  <p>Level 2, IT Department</p>
                  <p>Walk-in hours: 9AM-5PM</p>
                </div>
              </div>
            </div>

            {/* User Manual */}
            <div className="help-section">
              <h3 className="section-title">User Manual</h3>
              <div className="manual-links">
                <button className="manual-link" onClick={() => alert('PDF Guide will be available soon!')}>
                  📖 Complete User Guide (PDF)
                </button>
                <button className="manual-link" onClick={() => alert('Video Tutorials will be available soon!')}>
                  🎥 Video Tutorials
                </button>
                <button className="manual-link" onClick={() => alert('Mobile App Guide will be available soon!')}>
                  📱 Mobile App Guide
                </button>
                <button className="manual-link" onClick={() => alert('Release Notes will be available soon!')}>
                  🔄 What's New
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* RIGHT SIDEBAR */}
      <aside className="sidebar-right">
        <h4>Recent Help Topics</h4>
        <ul className="help-history">
          <li>How to calculate maintenance fluids</li>
          <li>Understanding neonatal fluid requirements</li>
          <li>Accessing clinical protocols</li>
          <li>Password reset instructions</li>
          <li>Mobile app synchronization</li>
        </ul>
        <div className="help-feedback">
          <h4>Was this helpful?</h4>
          <div className="feedback-buttons">
            <button className="feedback-btn positive">👍 Yes</button>
            <button className="feedback-btn negative">👎 No</button>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default HelpPage;