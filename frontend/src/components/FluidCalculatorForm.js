import React, { useState } from 'react';

const FluidCalculatorForm = () => {
  const [formData, setFormData] = useState({
    weight: '',
    dailyMaintenance: '',
    flowRate: '',
    bolus: ''
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleCalculate = () => {
    console.log('Calculating fluid values...', formData);
  };

  return (
    <div className="fluid-form">
      <input name="weight" type="number" onChange={handleChange} placeholder="Weight (kg)" />
      <input name="dailyMaintenance" type="number" onChange={handleChange} placeholder="Daily Maintenance Fluids (mL)" />
      <input name="flowRate" type="number" onChange={handleChange} placeholder="Fluids Flow Rate (mL/hr)" />
      <input name="bolus" type="number" onChange={handleChange} placeholder="Fluids Bolus (mL)" />
      <button onClick={handleCalculate}>Calculate</button>
      <button onClick={() => setFormData({ weight: '', dailyMaintenance: '', flowRate: '', bolus: '' })}>Reload</button>
    </div>
  );
};

export default FluidCalculatorForm;