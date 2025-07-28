import React, { useState } from 'react';
import './tabs.css';

const DehydrationCalculator = () => {
  const [weight, setWeight] = useState('');
  const [dehydration, setDehydration] = useState('');
  const [ongoingLoss, setOngoingLoss] = useState('');
  const [results, setResults] = useState(null);

  const getSeverity = (d) => {
    if (d < 3) return 'Mild (<3%)';
    if (d <= 6) return 'Moderate (3–6%)';
    return 'Severe (>6%)';
  };

  const calculateAll = () => {
    const w = parseFloat(weight);
    const d = parseFloat(dehydration);
    const o = parseFloat(ongoingLoss) || 0;

    if (isNaN(w) || w <= 0 || isNaN(d) || d < 0 || d > 15) {
      alert("Please enter valid weight and % dehydration (0–15).");
      return;
    }

    const severity = getSeverity(d);
    const deficit = w * d * 10; // in mL
    const replace24hr = deficit / 2;
    const replace48hr = deficit;

    const total24hr = replace24hr + o;
    const total48hr = replace48hr + o;

    setResults({
      severity,
      deficit: deficit.toFixed(1),
      replace24hr: replace24hr.toFixed(1),
      replace48hr: replace48hr.toFixed(1),
      ongoing: o.toFixed(1),
      total24hr: total24hr.toFixed(1),
      total48hr: total48hr.toFixed(1),
    });
  };

  const reset = () => {
    setWeight('');
    setDehydration('');
    setOngoingLoss('');
    setResults(null);
  };

  return (
    <div className="calculator-card">
      <h3 className="calculator-title">Dehydration Calculator</h3>

      <div>
        <div className="form-group">
          <label className="form-label">Weight (kg)</label>
          <input
            type="number"
            placeholder="Enter weight in kg"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label className="form-label">% Dehydration</label>
          <input
            type="number"
            placeholder="Enter % dehydration (e.g., 5)"
            value={dehydration}
            onChange={(e) => setDehydration(e.target.value)}
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Ongoing Losses (ml)</label>
          <input
            type="number"
            placeholder="Enter ongoing losses in ml"
            value={ongoingLoss}
            onChange={(e) => setOngoingLoss(e.target.value)}
            className="form-input"
          />
        </div>

        <div className="button-group">
          <button className="btn btn-primary" onClick={calculateAll}>
            Calculate
          </button>
          <button className="btn btn-secondary" onClick={reset}>
            Reset
          </button>
        </div>
      </div>

      {results && (
        <div className="clinical-info">
          <h4>Calculation Results:</h4>
          <div className="clinical-info-content">
            <p><strong>Severity:</strong> {results.severity}</p>
            <p><strong>Fluid Deficit:</strong> {results.deficit} mL</p>
            <p><strong>Replacement over 24 hrs:</strong> {results.replace24hr} mL</p>
            <p><strong>Replacement over 48 hrs:</strong> {results.replace48hr} mL</p>
            <p><strong>Ongoing Losses:</strong> {results.ongoing} mL</p>
            <p><strong>Total Fluids (24 hrs):</strong> {results.total24hr} mL</p>
            <p><strong>Total Fluids (48 hrs):</strong> {results.total48hr} mL</p>
            <p className="text-sm text-gray-600 mt-3">
              <strong>Note:</strong> Electrolyte correction depends on specific lab values (e.g., Na⁺, K⁺). Always refer to hospital protocol.
            </p>
          </div>
        </div>
      )}

      {/* <div className="placeholder-features dehydration mt-6">
        <h5>What’s Included:</h5>
        <ul>
          <li>• Dehydration severity assessment</li>
          <li>• Fluid deficit calculations</li>
          <li>• Replacement fluid recommendations (24–48 hrs)</li>
          <li>• Electrolyte correction guidance (manual)</li>
          <li>• Ongoing loss estimations</li>
        </ul>
      </div> */}
    </div>
  );
};

export default DehydrationCalculator;
