import React, { useEffect, useState } from "react";

function MatrixApp() {
  const [matrixSize, setMatrixSize] = useState(import.meta.env.MATRIX_SIZE || 5);
  const [startCoord, setStartCoord] = useState([import.meta.env.VITE_START_X || 0, import.meta.env.START_Y || 0]);
  const [endCoord, setEndCoord] = useState([import.meta.env.END_X || matrixSize - 1, import.meta.env.END_Y || matrixSize - 1]);
  const [numBlockingObjects, setNumBlockingObjects] = useState(import.meta.env.BLOCKING_OBJECTS || 1);
  const [moCoord, setMoCoord] = useState([0, 0]);
  const [boCoords, setBoCoords] = useState([]);
  const [executionTime, setExecutionTime] = useState(0);

  const measureExecutionTime = () => {
    const start = performance.now();
    //TODO: HERE I NEED TO SETUP CODE TO BE MEASURED
    const end = performance.now();
    const timeTaken = end - start;
    setExecutionTime(timeTaken);
  };

  return (
    <div>
      <p>Execution time: {executionTime} ms</p>
      <button onClick={measureExecutionTime}>Measure Execution Time</button>
    </div>
  );
}

export default MatrixApp;
