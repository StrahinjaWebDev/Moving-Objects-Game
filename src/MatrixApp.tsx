import React, { useEffect, useState } from "react";

function MatrixApp() {
  const matrixSize = import.meta.env.VITE_MATRIX_SIZE || 5;
  const numBlockingObjects = import.meta.env.VITE_BLOCKING_OBJECTS || 1;
  const [startCoord, setStartCoord] = useState([import.meta.env.VITE_START_X || 0, import.meta.env.VITE_START_Y || 0]);
  const [endCoord, setEndCoord] = useState([import.meta.env.VITE_END_X || matrixSize - 1, import.meta.env.VITE_END_Y || matrixSize - 1]);
  const [moCoord, setMoCoord] = useState([startCoord[0], startCoord[1]]);
  const [boCoords, setBoCoords] = useState([]);
  const [executionTime, setExecutionTime] = useState(0);

  useEffect(() => {
    // Function to generate BOs
    const generateBlockingObjects = () => {
      const boCoords = [];
      const maxAttempts = matrixSize * matrixSize;
      let attempts = 0;
      while (boCoords.length < numBlockingObjects && attempts < maxAttempts) {
        const boX = Math.floor(Math.random() * matrixSize);
        const boY = Math.floor(Math.random() * matrixSize);
        if ((boX !== startCoord[0] || boY !== startCoord[1]) && (boX !== endCoord[0] || boY !== endCoord[1])) {
          boCoords.push([boX, boY]);
        }
        attempts++;
      }
      if (attempts >= maxAttempts) {
        setBoCoords([]);
      } else {
        setBoCoords(boCoords);
      }
    };

    const moveMO = () => {
      if (moCoord[0] === endCoord[0] && moCoord[1] === endCoord[1]) {
        return;
      }

      const newMoCoord = [...moCoord];
      const direction = Math.floor(Math.random() * 4);
      const boCoordCheck = (coord, x, y) => coord[0] === x && coord[1] === y;
      switch (direction) {
        case 0: // Move up
          if (newMoCoord[0] > 0 && !boCoords.some((coord) => boCoordCheck(coord, newMoCoord[0] - 1, newMoCoord[1]))) {
            newMoCoord[0]--;
          }
          break;
        case 1: // Move right
          if (newMoCoord[1] < matrixSize - 1 && !boCoords.some((coord) => boCoordCheck(coord, newMoCoord[0], newMoCoord[1] + 1))) {
            newMoCoord[1]++;
          }
          break;
        case 2: // Move down
          if (newMoCoord[0] < matrixSize - 1 && !boCoords.some((coord) => boCoordCheck(coord, newMoCoord[0] + 1, newMoCoord[1]))) {
            newMoCoord[0]++;
          }
          break;
        case 3: // Move left
          if (newMoCoord[1] > 0 && !boCoords.some((coord) => coord[0] === newMoCoord[0] && coord[1] === newMoCoord[1] - 1)) {
            newMoCoord[1]--;
          }
          break;
        default:
          break;
      }
      setMoCoord(newMoCoord);
    };
    const startTime = performance.now();
    generateBlockingObjects();
    const intervalId = setInterval(moveMO, 500);
    const endTime = performance.now();
    const elapsedTime = endTime - startTime;
    setExecutionTime(elapsedTime);
    return () => {
      clearInterval(intervalId);
    };
  }, [moCoord, matrixSize, numBlockingObjects, startCoord, endCoord]);

  // Render the matrix and MO/BOs
  const renderMatrix = () => {
    const matrix = [];
    for (let i = 0; i < matrixSize; i++) {
      const row = [];
      for (let j = 0; j < matrixSize; j++) {
        const isMo = i === moCoord[0] && j === moCoord[1];
        const isBo = boCoords.some((coord) => coord[0] === i && coord[1] === j);
        const isStart = i === startCoord[0] && j === startCoord[1];
        const isEnd = i === endCoord[0] && j === endCoord[1];
        row.push(
          <div key={`${i}-${j}`} className={`cell ${isMo ? "mo" : ""} ${isBo ? "bo" : ""} ${isStart ? "start" : ""} ${isEnd ? "end" : ""}`}>
            {isMo ? "MO" : isBo ? "BO" : ""}
          </div>
        );
      }
      matrix.push(
        <div key={`row-${i}`} className="row">
          {row}
        </div>
      );
    }
    return matrix;
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 px-6">
      <div className="bg-white shadow-md p-6 rounded-lg">
        {renderMatrix()}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-2">Results</h2>
          <p className="text-gray-700 mb-2">Execution Time: {executionTime.toFixed(2)} ms</p>
          <p className="text-gray-700 mb-2">Moving Object Coordinates: {JSON.stringify(moCoord)}</p>
          <p className="text-gray-700">Blocking Object Coordinates: {JSON.stringify(boCoords)}</p>
        </div>
      </div>
    </div>
  );
}

export default MatrixApp;
