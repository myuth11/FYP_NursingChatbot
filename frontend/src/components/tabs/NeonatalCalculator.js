import React, { useState } from 'react';
import './tabs.css';

const NeonatalCalculator = () => {
  const [weight, setWeight] = useState('');
  const [day, setDay] = useState('');
  const [isPremature, setIsPremature] = useState(false);
  const [phototherapy, setPhototherapy] = useState(false);
  const [result, setResult] = useState(null);

  const getFluidRange = (day, isPremature) => {
    if (day < 1) return isPremature ? [80, 100] : [60, 80];
    if (day < 2) return isPremature ? [100, 120] : [80, 100];
    if (day < 3) return isPremature ? [120, 150] : [100, 120];
    return isPremature ? [150, 180] : [120, 150];
  };

  const handleCalculate = () => {
    const w = parseFloat(weight);
    const d = parseInt(day);

    if (isNaN(w) || w <= 0 || isNaN(d) || d < 0 || d > 28) {
      alert("Enter valid weight and day of life (0–28).");
      return;
    }

    const [min, max] = getFluidRange(d, isPremature);
    const adjust = phototherapy ? 10 : 0;

    const minTotal = w * (min + adjust);
    const maxTotal = w * (max + adjust);

    setResult({
      minDaily: minTotal.toFixed(1),
      maxDaily: maxTotal.toFixed(1),
      minRate: (minTotal / 24).toFixed(1),
      maxRate: (maxTotal / 24).toFixed(1),
      range: `${min + adjust}–${max + adjust} ml/kg/day`,
    });
  };

  const handleReset = () => {
    setWeight('');
    setDay('');
    setIsPremature(false);
    setPhototherapy(false);
    setResult(null);
  };

  return (
    <div className="calculator-card">
      <h3 className="calculator-title">Neonatal Fluid Calculator</h3>

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
          <label className="form-label">Day of Life (0–28)</label>
          <input
            type="number"
            placeholder="Enter day of life (0–28)"
            value={day}
            onChange={(e) => setDay(e.target.value)}
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label className="fluid-checkbox">
            <input
              type="checkbox"
              checked={isPremature}
              onChange={() => setIsPremature(!isPremature)}
            />
            Premature infant
          </label>

          <label className="fluid-checkbox">
            <input
              type="checkbox"
              checked={phototherapy}
              onChange={() => setPhototherapy(!phototherapy)}
            />
            Under phototherapy
          </label>
        </div>

        <div className="button-group">
          <button className="btn btn-primary" onClick={handleCalculate}>Calculate</button>
          <button className="btn btn-secondary" onClick={handleReset}>Reset</button>
        </div>
      </div>

      {result && (
        <div className="clinical-info">
          <h4>Calculation Results:</h4>
          <div className="clinical-info-content">
            <p><strong>Recommended Fluid Range:</strong> {result.range}</p>
            <p><strong>Daily Fluid Volume:</strong> {result.minDaily} – {result.maxDaily} ml</p>
            <p><strong>Hourly Rate:</strong> {result.minRate} – {result.maxRate} ml/hr</p>
            <p className="text-sm text-gray-600 mt-2">
              * Phototherapy adds ~10 ml/kg/day due to insensible losses.
            </p>
            <p className="text-sm text-gray-600">
              * Electrolyte correction should follow unit protocol (e.g., Na⁺, K⁺ checks).
            </p>
          </div>
        </div>
      )}

      {/* <div className="placeholder-features neonatal mt-6">
        <h5>Included:</h5>
        <ul>
          <li>• Age-specific fluid requirements (Day of Life)</li>
          <li>• Premature infant calculations</li>
          <li>• Phototherapy fluid adjustment</li>
          <li>• Electrolyte correction note</li>
        </ul>
      </div> */}
    </div>
  );
};

export default NeonatalCalculator;
