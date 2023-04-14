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

    generateBlockingObjects();
  }, []);

  return (
    <div className="max-w-3xl mx-auto mt-10 px-6">
      <div className="bg-white shadow-md p-6 rounded-lg">
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
