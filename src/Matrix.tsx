import React, { useEffect, useState } from "react";
import { SiMatrix } from "react-icons/si";
import { BiObjectsVerticalBottom } from "react-icons/bi";
import { MdOutlineStart } from "react-icons/md";
import { GiFinishLine } from "react-icons/gi";

function Matrix() {
  const matrixSize = import.meta.env.VITE_MATRIX_SIZE || 10; //Can be changed in .env file
  const numBlockingObjects = import.meta.env.VITE_BLOCKING_OBJECTS || 1; //Can be changed in .env file
  const [startCoord, setStartCoord] = useState([import.meta.env.VITE_START_X || 0, import.meta.env.VITE_START_Y || 0]);
  const [endCoord, setEndCoord] = useState([import.meta.env.VITE_END_X || matrixSize - 1, import.meta.env.VITE_END_Y || matrixSize - 1]);
  const [moCoord, setMoCoord] = useState([startCoord[0], startCoord[1]]);
  const [boCoords, setBoCoords] = useState<number[][]>([]);
  const [executionTime, setExecutionTime] = useState(0);

  const random = () => {
    return Math.random();
  };

  const floor = (number: number) => {
    return Math.floor(number);
  };

  useEffect(() => {
    const generateBlockingObjects = () => {
      const boCoords = [];
      const maxAttempts = matrixSize * matrixSize;
      let attempts = 0;

      // Loop until the desired number of blocking objects (numBlockingObjects) is generated
      // or the maximum number of attempts (maxAttempts) is reached

      while (boCoords.length < numBlockingObjects && attempts < maxAttempts) {
        // Generate random coordinates for the blocking object

        const boX = floor(random() * matrixSize);
        const boY = floor(random() * matrixSize);

        // Check if the generated coordinates are not the same as the start and end coordinates

        if ((boX !== startCoord[0] || boY !== startCoord[1]) && (boX !== endCoord[0] || boY !== endCoord[1])) {
          boCoords.push([boX, boY]);
        }

        attempts++;
      }

      // If the maximum number of attempts is reached and the desired number of blocking objects
      // is not generated, set the blocking object coordinates to an empty array

      if (attempts >= maxAttempts) setBoCoords([]);
      else setBoCoords(boCoords); // Otherwise, set the blocking object coordinates to the generated coordinates
    };

    const moveMO = () => {
      // If the current MO (Moving Object) coordinates are the same as the end coordinates, return without making any move

      if (moCoord[0] === endCoord[0] && moCoord[1] === endCoord[1]) return;

      const newMoCoord = [...moCoord]; // Create a new copy of the current MO coordinates
      const direction = floor(random() * 4); // Generate a random direction (0: up, 1: right, 2: down, 3: left)

      // Define a helper function to check if a given coordinate is the same as a blocking object coordinate
      const boCoordCheck = ([coordX, coordY]: number[], x: number, y: number) => coordX === x && coordY === y;

      // Use a switch statement to handle the different directions

      switch (direction) {
        case 0: // Move up
          // Check if the new MO coordinates will be within the matrix bounds and will not overlap with any blocking objects
          if (newMoCoord[0] > 0 && !boCoords.some((coord) => boCoordCheck(coord, newMoCoord[0] - 1, newMoCoord[1]))) {
            newMoCoord[0]--; // Update the new MO coordinates by moving up
          }
          break;

        case 1: // Move right
          // Check if the new MO coordinates will be within the matrix bounds and will not overlap with any blocking objects
          if (newMoCoord[1] < matrixSize - 1 && !boCoords.some((coord) => boCoordCheck(coord, newMoCoord[0], newMoCoord[1] + 1))) {
            newMoCoord[1]++; // Update the new MO coordinates by moving right
          }
          break;

        case 2: // Move down
          // Check if the new MO coordinates will be within the matrix bounds and will not overlap with any blocking objects
          if (newMoCoord[0] < matrixSize - 1 && !boCoords.some((coord) => boCoordCheck(coord, newMoCoord[0] + 1, newMoCoord[1]))) {
            newMoCoord[0]++; // Update the new MO coordinates by moving down
          }
          break;

        case 3: // Move left
          // Check if the new MO coordinates will be within the matrix bounds and will not overlap with any blocking objects
          if (newMoCoord[1] > 0 && !boCoords.some((coord) => boCoordCheck(coord, newMoCoord[0], newMoCoord[1] - 1))) {
            newMoCoord[1]--; // Update the new MO coordinates by moving left
          }
          break;
        default:
          break;
      }

      setMoCoord(newMoCoord); // Update the MO coordinates with the new coordinates
    };

    const startTime = performance.now();
    generateBlockingObjects();
    const intervalId = setInterval(moveMO, 500);
    const endTime = performance.now();
    const elapsedTime = endTime - startTime;
    setExecutionTime(elapsedTime);

    return () => {
      clearInterval(intervalId); // Clear the interval when the component unmounts
    };
  }, [moCoord, matrixSize, numBlockingObjects, startCoord, endCoord]);

  // Render the matrix and MO/BOs
  const renderMatrix = () => {
    const matrix = [];
    for (let i = 0; i < matrixSize; i++) {
      const row = [];
      for (let j = 0; j < matrixSize; j++) {
        const isMo = i === moCoord[0] && j === moCoord[1]; // Check if current cell is MO
        const isBo = boCoords.some((coord) => coord[0] === i && coord[1] === j); // Check if current cell is BO
        const isStart = i === startCoord[0] && j === startCoord[1]; // Check if current cell is start point
        const isEnd = i === endCoord[0] && j === endCoord[1]; // Check if current cell is end point
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
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Matrix App</h1>
        <p className="text-lg mb-2 flex justify-center gap-3">
          <SiMatrix size={"2rem"} />
          Matrix Size: {matrixSize}
        </p>
        <p className="text-lg mb-2 flex justify-center items-center gap-3">
          <BiObjectsVerticalBottom size={"2rem"} /> Number of Blocking Objects: {numBlockingObjects}
        </p>
        <p className="text-lg mb-2 flex justify-center items-center gap-3">
          <MdOutlineStart size={"2rem"} /> Start Coord: [{startCoord[0]}, {startCoord[1]}]
        </p>
        <p className="text-lg mb-2 flex justify-center items-center gap-3">
          <GiFinishLine size={"2rem"} /> End Coord: [{endCoord[0]}, {endCoord[1]}]
        </p>
      </div>

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

export default Matrix;
