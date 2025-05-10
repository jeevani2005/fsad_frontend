// src/Calculator.jsx
import { useState } from "react";
import '/src/css/Caluculator.css';

const Calculator = () => {
  const [input, setInput] = useState("");

  const append = (value) => setInput((prev) => prev + value);
  const clear = () => setInput("");
  const deleteLast = () => setInput((prev) => prev.slice(0, -1));
  const calculate = () => {
    try {
      const result = eval(input.replace("%", "/100"));
      setInput(result.toString());
    } catch {
      setInput("Error");
    }
  };

  return (
    <div className="calc-container">
      <input className="calc-display" type="text" value={input} disabled />
      <div className="calc-buttons">
        <button onClick={clear} className="calc-button calc-operator">C</button>
        <button onClick={deleteLast} className="calc-button calc-operator">⌫</button>
        <button onClick={() => append('%')} className="calc-button calc-operator">%</button>
        <button onClick={() => append('/')} className="calc-button calc-operator">÷</button>

        <button onClick={() => append('7')} className="calc-button">7</button>
        <button onClick={() => append('8')} className="calc-button">8</button>
        <button onClick={() => append('9')} className="calc-button">9</button>
        <button onClick={() => append('*')} className="calc-button calc-operator">×</button>

        <button onClick={() => append('4')} className="calc-button">4</button>
        <button onClick={() => append('5')} className="calc-button">5</button>
        <button onClick={() => append('6')} className="calc-button">6</button>
        <button onClick={() => append('-')} className="calc-button calc-operator">−</button>

        <button onClick={() => append('1')} className="calc-button">1</button>
        <button onClick={() => append('2')} className="calc-button">2</button>
        <button onClick={() => append('3')} className="calc-button">3</button>
        <button onClick={() => append('+')} className="calc-button calc-operator">+</button>

        <button onClick={() => append('0')} className="calc-button calc-zero">0</button>
        <button onClick={() => append('.')} className="calc-button">.</button>
        <button onClick={calculate} className="calc-button calc-equals">=</button>
      </div>
    </div>
  );
};

export default Calculator;
