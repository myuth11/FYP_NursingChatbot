import React, { useState } from 'react';
import './tabs.css';

const MaintenanceCalculator = () => {
  const [form, setForm] = useState({ weight: '', age: '' });
  const [results, setResults] = useState({
    maintenance: '',
    flowRate: '',
    bolus: '',
    fluidCapMessage: '',
    sbp: '',
    urineOutput: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const calculateFluids = (weight) => {
    let maintenance = 0, flowRate = 0, bolus = 0, fluidCapMessage = '';

    if (weight <= 10) {
      maintenance = weight * 100;
      flowRate = weight * 4;
    } else if (weight <= 20) {
      maintenance = 1000 + (weight - 10) * 50;
      flowRate = 40 + (weight - 10) * 2;
    } else {
      maintenance = 1500 + (weight - 20) * 20;
      flowRate = 60 + (weight - 20);
      if (maintenance > 2500) {
        maintenance = 2500;
        fluidCapMessage = '⚠️ Max daily fluid capped at 2500 ml.';
      }
    }

    bolus = weight * 20;
    return { maintenance, flowRate, bolus, fluidCapMessage };
  };

  const calculateSBP = (ageInYears) => {
    if (ageInYears < 1 / 12) return '>60 mmHg';
    else if (ageInYears < 1) return '>70 mmHg';
    else return `> ${70 + (ageInYears * 2)} mmHg`;
  };

  const expectedUrineOutput = (ageInYears) =>
    ageInYears < 1 ? '>0.5 ml/kg/hr' : '>1 ml/kg/hr';

  const handleCalculate = () => {
    const weight = parseFloat(form.weight);
    const ageInYears = parseFloat(form.age);

    if (isNaN(weight) || weight <= 0) {
      alert("Please enter a valid weight.");
      return;
    }

    // Age validation is now optional - only validate if age is provided
    if (form.age && (isNaN(ageInYears) || ageInYears < 0)) {
      alert("Please enter a valid age.");
      return;
    }

    const { maintenance, flowRate, bolus, fluidCapMessage } = calculateFluids(weight);

    // Only calculate age-dependent values if age is provided
    const sbp = form.age && !isNaN(ageInYears) ? calculateSBP(ageInYears) : '';
    const urineOutput = form.age && !isNaN(ageInYears) ? expectedUrineOutput(ageInYears) : '';

    setResults({
      maintenance: maintenance.toFixed(1),
      flowRate: flowRate.toFixed(1),
      bolus: bolus.toFixed(1),
      fluidCapMessage,
      sbp,
      urineOutput,
    });
  };

  const handleReset = () => {
    setForm({ weight: '', age: '' });
    setResults({
      maintenance: '',
      flowRate: '',
      bolus: '',
      fluidCapMessage: '',
      sbp: '',
      urineOutput: '',
    });
  };

  return (
    <div className="calculator-card">
      <h3 className="calculator-title">Maintenance Fluid Calculator</h3>
      
      <div>
        <div className="form-group">
          <label className="form-label">Weight (kg)</label>
          <input
            name="weight"
            value={form.weight}
            onChange={handleChange}
            placeholder="Enter weight in kg"
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Age (years) - Optional</label>
          <input
            name="age"
            value={form.age}
            onChange={handleChange}
            placeholder="Enter age in years (optional)"
            className="form-input"
          />
        </div>

        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Daily Maintenance (ml/day)</label>
            <input
              name="maintenance"
              value={results.maintenance}
              readOnly
              placeholder="Daily Maintenance (ml/day)"
              className="form-input"
            />
          </div>

          {results.fluidCapMessage && (
            <div className="warning-message">
              {results.fluidCapMessage}
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Flow Rate (ml/hr)</label>
            <input
              name="flowRate"
              value={results.flowRate}
              readOnly
              placeholder="Flow Rate (ml/hr)"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Fluid Bolus (ml)</label>
            <input
              name="bolus"
              value={results.bolus}
              readOnly
              placeholder="Fluid Bolus (ml)"
              className="form-input"
            />
          </div>
        </div>

        <div className="button-group">
          <button 
            onClick={handleCalculate}
            className="btn btn-primary"
          >
            Calculate
          </button>
          <button 
            onClick={handleReset}
            className="btn btn-secondary"
          >
            Reset
          </button>
        </div>

        {(results.sbp || results.urineOutput || results.maintenance) && (
          <div className="clinical-info">
            <h4>Clinical References:</h4>
            <div className="clinical-info-content">
              {results.sbp && <p><strong>Expected SBP:</strong> {results.sbp}</p>}
              {results.urineOutput && <p><strong>Normal Urine Output:</strong> {results.urineOutput}</p>}
              {!results.sbp && !results.urineOutput && results.maintenance && (
                <p><em>Enter age to see SBP and urine output references</em></p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MaintenanceCalculator;
