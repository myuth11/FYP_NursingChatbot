import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ProtocolsPage = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const navigate = useNavigate();

  const openImageModal = (imageSrc, imageAlt) => {
    setSelectedImage({ src: imageSrc, alt: imageAlt });
  };

  const closeImageModal = () => {
    setSelectedImage(null);
  };

  return (
    <div className="protocols-page">
      <button
        onClick={() => navigate('/chat')}
        style={{
          marginBottom: '1rem',
          padding: '0.5rem 1rem',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontSize: '1rem',
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          width="20"
          height="20"
          aria-hidden="true"
          focusable="false"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Back to Chat
      </button>

      

      <h2>Clinical Protocols</h2>
      <p>Access evidence-based clinical guidelines and protocols for safe patient care.</p>

      <div className="protocol-container">
        {/* Blood Transfusion */}
        <div className="protocol-card blood-transfusion compact">
          <div className="protocol-category">Critical Care</div>
          <h3>🩸 Blood Transfusion Protocol</h3>
          <p>
            Comprehensive step-by-step guide for safely administering blood transfusions,
            including pre-transfusion checks, compatibility testing, and monitoring procedures.
          </p>
          <div className="protocol-actions">
            <a
              href="/assets/protocols/65010-1260 Clinical Transfusion Protocol(Jun21).pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="protocol-link"
            >
              View Protocol
            </a>
          </div>
        </div>

        {/* Procedural Sedation */}
        <div className="protocol-card sedation compact">
          <div className="protocol-category">Procedural Care</div>
          <h3>💤 Procedural Sedation</h3>
          <p>
            Evidence-based protocol for safely sedating patients during minor procedures,
            including patient assessment, monitoring requirements, and emergency management.
          </p>
          <div className="protocol-actions">
            <a
              href="/assets/protocols/Procedural Sedation.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="protocol-link"
            >
              View Protocol
            </a>
          </div>
        </div>

        {/* Urinary Catheterisation */}
        <div className="protocol-card catheter compact">
          <div className="protocol-category">Infection Control</div>
          <h3>🛁 Urinary Catheterisation</h3>
          <p>
            Best practice guidelines for sterile insertion and ongoing care of urinary catheters,
            infection prevention strategies, and removal criteria.
          </p>
          <div className="protocol-actions">
            <a
              href="/assets/protocols/Urinary Catheterization slides 08102023.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="protocol-link"
            >
              View Protocol
            </a>
          </div>
        </div>

        {/* Neonatal Jaundice Phototherapy Chart */}
        <div className="protocol-card neonatal expanded">
          <div className="protocol-category">Neonatal Care</div>
          <h3>☀️ Neonatal Jaundice Phototherapy</h3>
          <p>
            Risk-stratified charts for determining phototherapy initiation thresholds based on
            infant gestational age and risk factors.
          </p>
          <div className="chart-container">
            <div className="chart-section">
              <h4>Normal Risk Chart</h4>
              <button
                className="chart-view-button"
                onClick={() =>
                  openImageModal('/assets/protocols/normal_risk_chart.jpg', 'Normal Risk Phototherapy Chart')
                }
              >
                📊 View Normal Risk Chart
              </button>
            </div>

            <div className="chart-section">
              <h4>High Risk Chart</h4>
              <button
                className="chart-view-button"
                onClick={() =>
                  openImageModal('/assets/protocols/high_risk_chart.jpg', 'High Risk Phototherapy Chart')
                }
              >
                📊 View High Risk Chart
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div className="image-modal-overlay" onClick={closeImageModal}>
          <div className="image-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="image-modal-close" onClick={closeImageModal}>
              ✕
            </button>
            <img src={selectedImage.src} alt={selectedImage.alt} className="image-modal-img" />
            <p className="image-modal-caption">{selectedImage.alt}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProtocolsPage;
