import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '/src/css/FinancelInsurence.css';

function FinanceInsurance() {
  const [investments, setInvestments] = useState([]);
  const [investmentData, setInvestmentData] = useState({
    type: '',
    name: '',
    investedAmount: '',
    returnAmount: '',
    canSell: false,
  });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setInvestmentData({
      ...investmentData,
      [name]: name === 'canSell' ? e.target.checked : value,
    });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    axios.post('http://localhost:8080/api/investments', investmentData)
      .then((response) => {
        setInvestments([...investments, response.data]);
        setInvestmentData({
          type: '',
          name: '',
          investedAmount: '',
          returnAmount: '',
          canSell: false,
        });
      })
      .catch((error) => {
        console.error('Error adding investment:', error);
      });
  };

  // Fetch investments on initial load
  useEffect(() => {
    axios.get('http://localhost:8080/api/investments')
      .then((response) => {
        setInvestments(response.data);
      })
      .catch((error) => {
        console.error('Error fetching investments:', error);
      });
  }, []);

  // Handle the delete (sell) action
  const handleSell = (id) => {
    axios.delete(`http://localhost:8080/api/investments/${id}`)
      .then(() => {
        setInvestments(investments.filter((investment) => investment.id !== id));
      })
      .catch((error) => {
        console.error('Error deleting investment:', error);
      });
  };

  return (
    <div>
      <h2>Financial & Insurance Overview</h2>

      {/* Investment Form */}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="type">Type:</label>
          <input
            type="text"
            id="type"
            name="type"
            value={investmentData.type}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={investmentData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="investedAmount">Invested Amount:</label>
          <input
            type="number"
            id="investedAmount"
            name="investedAmount"
            value={investmentData.investedAmount}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="returnAmount">Return Amount:</label>
          <input
            type="number"
            id="returnAmount"
            name="returnAmount"
            value={investmentData.returnAmount}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="canSell">Can Sell:</label>
          <input
            type="checkbox"
            id="canSell"
            name="canSell"
            checked={investmentData.canSell}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Add Investment</button>
      </form>

      {/* Display Investments */}
      <table>
        <thead>
          <tr>
            <th>Type</th>
            <th>Name</th>
            <th>Invested</th>
            <th>Returns</th>
            <th>Sell?</th>
          </tr>
        </thead>
        <tbody>
          {investments.map((inv) => (
            <tr key={inv.id}>
              <td>{inv.type}</td>
              <td>{inv.name}</td>
              <td>₹{inv.investedAmount}</td>
              <td>₹{inv.returnAmount}</td>
              <td>
                {inv.canSell ? (
                  <button className='sellbutton' onClick={() => handleSell(inv.id)}>Sell</button>
                ) : (
                  'No'
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default FinanceInsurance;
