import React, { useState } from "react";
import "/src/css/ChatBot.css"; // You can create a basic CSS file to style the chatbot

const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");

  // Suggestions for Budget Management
  const budgetTips = {
    savings: "💡 To save money, consider setting aside a fixed percentage of your income each month. Even small amounts can add up over time.",
    expenses: "💡 Track your expenses to find unnecessary costs. Reducing impulsive spending is key to saving more.",
    debt: "💡 Pay off high-interest debts first. It will save you more money in the long run.",
    emergencyFund: "💡 Aim to have an emergency fund that covers 3-6 months of expenses for unexpected situations.",
    investment: "💡 Start investing early, even with small amounts. Consider low-cost index funds for steady growth.",
    budget: "💡 Create a monthly budget to track income and expenses. Allocate funds for savings, debt repayment, and essentials first."
  };

  const handleSendMessage = () => {
    if (userInput.trim() === "") return;

    const newMessages = [...messages, { sender: "user", text: userInput }];
    setMessages(newMessages);

    // Get the bot response based on the user input
    const botResponse = getBotResponse(userInput);
    setMessages([...newMessages, { sender: "bot", text: botResponse }]);
    setUserInput(""); // Clear input field
  };

  const getBotResponse = (input) => {
    const lowerCaseInput = input.toLowerCase();

    if (lowerCaseInput.includes("save money")) {
      return budgetTips.savings;
    } else if (lowerCaseInput.includes("cut expenses")) {
      return budgetTips.expenses;
    } else if (lowerCaseInput.includes("debt")) {
      return budgetTips.debt;
    } else if (lowerCaseInput.includes("emergency fund")) {
      return budgetTips.emergencyFund;
    } else if (lowerCaseInput.includes("investment")) {
      return budgetTips.investment;
    } else if (lowerCaseInput.includes("budget")) {
      return budgetTips.budget;
    } else {
      return "💬 I'm here to help! Ask me about budget planning or managing your money.";
    }
  };

  return (
    <div className="chatbot-container">
      <div className="chatbot-header">
        <h2>💬 Budget Planner Bot</h2>
      </div>
      <div className="chatbot-body">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message ${msg.sender === "bot" ? "bot-message" : "user-message"}`}
          >
            <p>{msg.text}</p>
          </div>
        ))}
      </div>
      <div className="chatbot-footer">
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Ask about budgeting or saving money..."
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatBot;
