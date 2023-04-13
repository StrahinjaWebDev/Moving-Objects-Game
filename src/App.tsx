import React from "react";
import { useState } from "react";
import "./App.css";
import MatrixApp from "./MatrixApp";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="App">
      <MatrixApp />
    </div>
  );
}

export default App;
