import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import '/src/css/PaymentCalender.css'; // Make sure this path is correct

const fixedDeadlines = {
  5: "Bill Payment",
  10: "Loan Repayment"
};

const ReportAndAnalysis = () => {
  const [paidDates, setPaidDates] = useState({});
  const [monthlySummary, setMonthlySummary] = useState({});

  const markPaid = (date) => {
    const dateStr = date.toDateString();
    setPaidDates((prev) => ({ ...prev, [dateStr]: true }));
  };

  const handleDateClick = (date) => {
    const day = date.getDate();
    const dateStr = date.toDateString();

    if (fixedDeadlines[day]) {
      const confirm = window.confirm(`Mark ${fixedDeadlines[day]} as Paid on ${dateStr}?`);
      if (confirm) markPaid(date);
    } else {
      alert("This is not a deadline date.");
    }
  };

  useEffect(() => {
    const today = new Date();
    const day = today.getDate();
    const todayStr = today.toDateString();

    if (fixedDeadlines[day] && !paidDates[todayStr]) {
      alert(`⚠ Reminder: Your ${fixedDeadlines[day]} is due today!`);
    }
  }, [paidDates]);

  // Fetch data from backend and compute monthly summary
  useEffect(() => {
    fetch("http://localhost:8080/api/income-bills")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then((data) => {
        const monthly = {};

        data.forEach(entry => {
          const createdAt = new Date(entry.createdAt || entry.timestamp || Date.now()); // fallback
          const month = createdAt.toLocaleString('default', { month: 'long' });
          const year = createdAt.getFullYear();
          const key = `${month} ${year}`;

          const totalExpenses = 
            entry.rent + entry.groceries + entry.entertainment + entry.travel +
            entry.education + entry.food + entry.shopping +
            (entry.electricity || 0) + (entry.investmentInsurance || 0);

          const income = entry.income;
          const savings = income - totalExpenses;

          if (!monthly[key]) {
            monthly[key] = { income: 0, expenses: 0, savings: 0, count: 0 };
          }

          monthly[key].income += income;
          monthly[key].expenses += totalExpenses;
          monthly[key].savings += savings;
          monthly[key].count += 1;
        });

        setMonthlySummary(monthly);
      })
      .catch((error) => {
        console.error("There was an error fetching data: ", error);
      });
  }, []);

  const tileContent = ({ date }) => {
    const day = date.getDate();
    const dateStr = date.toDateString();

    return (
      <div style={{ textAlign: "center", fontSize: "0.7rem" }}>
        {fixedDeadlines[day] && (
          <div style={{ color: paidDates[dateStr] ? "green" : "red" }}>
            ● {fixedDeadlines[day].split(" ")[0]}
          </div>
        )}
      </div>
    );
  };

  // Convert monthlySummary object to array for rendering the BarChart
  const chartData = Object.entries(monthlySummary).map(([month, summary]) => ({
    month,
    income: summary.income,
    expenses: summary.expenses,
    savings: summary.savings,
  }));

  return (
    <div style={{ padding: "2rem" }}>
      <h2>📅 Payment Calendar</h2>
      <p>🟥 = Upcoming or unpaid deadline | 🟩 = Paid</p>
      <Calendar onClickDay={handleDateClick} tileContent={tileContent} />

      <h2 style={{ marginTop: "2rem" }}>📊 Monthly Summary</h2>
      {Object.keys(monthlySummary).length === 0 ? (
        <p>No data yet.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ borderBottom: "1px solid gray" }}>Month</th>
              <th style={{ borderBottom: "1px solid gray" }}>Income</th>
              <th style={{ borderBottom: "1px solid gray" }}>Expenses</th>
              <th style={{ borderBottom: "1px solid gray" }}>Savings</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(monthlySummary).map(([month, summary]) => (
              <tr key={month}>
                <td>{month}</td>
                <td>₹{summary.income.toFixed(2)}</td>
                <td>₹{summary.expenses.toFixed(2)}</td>
                <td style={{ color: summary.savings < 0 ? "red" : "green" }}>
                  ₹{summary.savings.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Bar Chart */}
      <h2 style={{ marginTop: "2rem" }}>📊 Income, Expenses & Savings Overview</h2>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="income" fill="#8884d8" />
          <Bar dataKey="expenses" fill="#82ca9d" />
          <Bar dataKey="savings" fill="#ffc658" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ReportAndAnalysis;
