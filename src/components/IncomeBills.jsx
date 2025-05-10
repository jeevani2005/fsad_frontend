import React, { useState, useEffect } from 'react';
import '../css/IncomeBills.css';
import axios from 'axios';

const IncomeBills = () => {
  const [infoVisible, setInfoVisible] = useState({});
  const [formData, setFormData] = useState({
    income: '',
    rent: '',
    groceries: '',
    entertainment: '',
    travel: '',
    education: '',
    food: '',
    shopping: ''
  });
  const [submittedData, setSubmittedData] = useState(null);
  const [remaining, setRemaining] = useState(null);
  const [allData, setAllData] = useState([]);

  const toggleInfo = (key) => {
    setInfoVisible(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post('http://localhost:8080/api/income-bills', formData);
      setSubmittedData(response.data);

      const income = parseFloat(formData.income) || 0;
      const total = ['rent', 'groceries', 'entertainment', 'travel', 'education', 'food', 'shopping']
        .reduce((sum, key) => sum + (parseFloat(formData[key]) || 0), 0);
      setRemaining(income - total);
      fetchData();
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };

  const fetchData = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/income-bills');
      setAllData(res.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const renderInputRow = (label, name) => (
    <div className="input-row" key={name}>
      <label>{label}</label>
      <div className="input-container">
        <span className="currency">₹</span>
        <input
          type="number"
          name={name}
          value={formData[name]}
          onChange={handleChange}
        />
      </div>
      <button className="more-info" onClick={() => toggleInfo(name)}>
        {infoVisible[name] ? "▾ Hide" : "▸ More info"}
      </button>
      {infoVisible[name] && <p className="info-text">More info about {label}</p>}
    </div>
  );

  return (
    <div className="income-bills-container">
      <div className="form-section">
        <h2>Income & Bills</h2>
        {renderInputRow("Income (after tax)", "income")}
        {renderInputRow("Rent", "rent")}
        {renderInputRow("Groceries", "groceries")}
        {renderInputRow("Entertainment", "entertainment")}
        {renderInputRow("Travel", "travel")}
        {renderInputRow("Education", "education")}
        {renderInputRow("Food (Dining Out)", "food")}
        {renderInputRow("Shopping", "shopping")}
        <button className="submit-btn" onClick={handleSubmit}>Submit</button>
      </div>

      {submittedData && (
        <div className="data-section">
          <h3>Last Submitted Entry</h3>
          <ul>
            {Object.entries(submittedData).map(([key, value]) => (
              key !== 'id' && <li key={key}>{key}: ₹{value}</li>
            ))}
          </ul>
          <h4>Remaining: ₹{remaining}</h4>
          {remaining < 0 && (
            <div className="warning">
              ⚠️ Your expenses exceed your income! Please review your budget.
            </div>
          )}
        </div>
      )}

      <div className="all-data-section">
        <h3>All Submissions</h3>
        {allData.map((entry) => (
          <div key={entry.id} className="entry">
            <p><strong>ID:</strong> {entry.id}</p>
            <ul>
              {Object.entries(entry).map(([k, v]) =>
                k !== 'id' && <li key={k}>{k}: ₹{v}</li>
              )}
            </ul>
            <hr />
          </div>
        ))}
      </div>
    </div>
  );
};

export default IncomeBills;
