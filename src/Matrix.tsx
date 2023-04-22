import React, { useEffect, useState } from "react";
import { SiMatrix } from "react-icons/si";
import { BiObjectsVerticalBottom } from "react-icons/bi";
import { MdOutlineStart } from "react-icons/md";
import { GiFinishLine } from "react-icons/gi";

function Matrix() {
  const matrixSize = import.meta.env.VITE_MATRIX_SIZE || 10; //Can be changed in .env file
  const numberOfBlockingObjects = import.meta.env.VITE_BLOCKING_OBJECTS || 1; //Can be changed in .env file
  const [startCoordinates, setStartCoordinates] = useState([import.meta.env.VITE_START_X || 0, import.meta.env.VITE_START_Y || 0]);
  const [endCoordinates, setEndCoordinates] = useState([
    import.meta.env.VITE_END_X || matrixSize - 1,
    import.meta.env.VITE_END_Y || matrixSize - 1,
  ]);
  const [movingObjectCoordinates, setMovingObjectCoordinates] = useState([startCoordinates[0], startCoordinates[1]]);
  const [blockingObjectCoordinates, setBlockingObjectCoordinates] = useState<number[][]>([]);
  const [executionTime, setExecutionTime] = useState(0);

  const random = () => {
    return Math.random();
  };

  const floor = (number: number) => {
    return Math.floor(number);
  };

  useEffect(() => {
    const generateBlockingObjects = () => {
      const blockingObjectCoordinates = [];
      const maxAttempts = matrixSize * matrixSize;
      let attempts = 0;

      // Loop until the desired number of blocking objects (numberOfBlockingObjects) is generated
      // or the maximum number of attempts (maxAttempts) is reached

      while (blockingObjectCoordinates.length < numberOfBlockingObjects && attempts < maxAttempts) {
        // Generate random coordinates for the blocking object

        const blockingObjectX = floor(random() * matrixSize);
        const blockingObjectY = floor(random() * matrixSize);

        // Check if the generated coordinates are not the same as the start and end coordinates

        if (
          (blockingObjectX !== startCoordinates[0] || blockingObjectY !== startCoordinates[1]) &&
          (blockingObjectX !== endCoordinates[0] || blockingObjectY !== endCoordinates[1])
        ) {
          blockingObjectCoordinates.push([blockingObjectX, blockingObjectY]);
        }

        attempts++;
      }

      // If the maximum number of attempts is reached and the desired number of blocking objects
      // is not generated, set the blocking object coordinates to an empty array

      if (attempts >= maxAttempts) setBlockingObjectCoordinates([]);
      else setBlockingObjectCoordinates(blockingObjectCoordinates); // Otherwise, set the blocking object coordinates to the generated coordinates
    };

    const moveMovingObject = () => {
      // If the current MO (Moving Object) coordinates are the same as the end coordinates, return without making any move

      if (movingObjectCoordinates[0] === endCoordinates[0] && movingObjectCoordinates[1] === endCoordinates[1]) return;

      const newMovingObjectCoordinates = [...movingObjectCoordinates]; // Create a new copy of the current MO coordinates
      const direction = floor(random() * 4); // Generate a random direction (0: up, 1: right, 2: down, 3: left)

      // Define a helper function to check if a given coordinate is the same as a blocking object coordinate
      const blockingObjectCoordinatesCheck = ([coordinatesX, coordinatesY]: number[], x: number, y: number) =>
        coordinatesX === x && coordinatesY === y;

      // Use a switch statement to handle the different directions

      switch (direction) {
        case 0: // Move up
          // Check if the new MO coordinates will be within the matrix bounds and will not overlap with any blocking objects
          if (
            newMovingObjectCoordinates[0] > 0 &&
            !blockingObjectCoordinates.some((coordinates) =>
              blockingObjectCoordinatesCheck(coordinates, newMovingObjectCoordinates[0] - 1, newMovingObjectCoordinates[1])
            )
          ) {
            newMovingObjectCoordinates[0]--; // Update the new MO coordinates by moving up
          }
          break;

        case 1: // Move right
          // Check if the new MO coordinates will be within the matrix bounds and will not overlap with any blocking objects
          if (
            newMovingObjectCoordinates[1] < matrixSize - 1 &&
            !blockingObjectCoordinates.some((coordinates) =>
              blockingObjectCoordinatesCheck(coordinates, newMovingObjectCoordinates[0], newMovingObjectCoordinates[1] + 1)
            )
          ) {
            newMovingObjectCoordinates[1]++; // Update the new MO coordinates by moving right
          }
          break;

        case 2: // Move down
          // Check if the new MO coordinates will be within the matrix bounds and will not overlap with any blocking objects
          if (
            newMovingObjectCoordinates[0] < matrixSize - 1 &&
            !blockingObjectCoordinates.some((coordinates) =>
              blockingObjectCoordinatesCheck(coordinates, newMovingObjectCoordinates[0] + 1, newMovingObjectCoordinates[1])
            )
          ) {
            newMovingObjectCoordinates[0]++; // Update the new MO coordinates by moving down
          }
          break;

        case 3: // Move left
          // Check if the new MO coordinates will be within the matrix bounds and will not overlap with any blocking objects
          if (
            newMovingObjectCoordinates[1] > 0 &&
            !blockingObjectCoordinates.some((coordinates) =>
              blockingObjectCoordinatesCheck(coordinates, newMovingObjectCoordinates[0], newMovingObjectCoordinates[1] - 1)
            )
          ) {
            newMovingObjectCoordinates[1]--; // Update the new MO coordinates by moving left
          }
          break;
        default:
          break;
      }

      setMovingObjectCoordinates(newMovingObjectCoordinates); // Update the MO coordinates with the new coordinates
    };

    const startTime = performance.now();
    generateBlockingObjects();
    const intervalId = setInterval(moveMovingObject, 500);
    const endTime = performance.now();
    const elapsedTime = endTime - startTime;
    setExecutionTime(elapsedTime);

    return () => {
      clearInterval(intervalId); // Clear the interval when the component unmounts
    };
  }, [movingObjectCoordinates, matrixSize, numberOfBlockingObjects, startCoordinates, endCoordinates]);

  // Render the matrix and MO/BOs
  const renderMatrix = () => {
    const matrix = [];
    for (let i = 0; i < matrixSize; i++) {
      const row = [];
      for (let j = 0; j < matrixSize; j++) {
        const isMovingObject = i === movingObjectCoordinates[0] && j === movingObjectCoordinates[1]; // Check if current cell is MO
        const isBlockingObject = blockingObjectCoordinates.some((coordinates) => coordinates[0] === i && coordinates[1] === j); // Check if current cell is BO
        const isStart = i === startCoordinates[0] && j === startCoordinates[1]; // Check if current cell is start point
        const isEnd = i === endCoordinates[0] && j === endCoordinates[1]; // Check if current cell is end point
        row.push(
          <div
            key={`${i}-${j}`}
            className={`${isMovingObject ? "Moving Object" : ""} ${isBlockingObject ? "Blocking Object" : ""} ${isStart ? "Start" : ""} ${
              isEnd ? "End" : ""
            }`}
          >
            {isMovingObject ? "Moving Object" : isBlockingObject ? "Blocking Object" : ""}
          </div>
        );
      }
      matrix.push(<div key={`${i}`}>{row}</div>);
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
          <BiObjectsVerticalBottom size={"2rem"} /> Number of Blocking Objects: {numberOfBlockingObjects}
        </p>
        <p className="text-lg mb-2 flex justify-center items-center gap-3">
          <MdOutlineStart size={"2rem"} /> Start Coordinates: [{startCoordinates[0]}, {startCoordinates[1]}]
        </p>
        <p className="text-lg mb-2 flex justify-center items-center gap-3">
          <GiFinishLine size={"2rem"} /> End Coordinates: [{endCoordinates[0]}, {endCoordinates[1]}]
        </p>
      </div>

      <div className="bg-white shadow-md p-6 rounded-lg">
        {renderMatrix()}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-2">Results</h2>
          <p className="text-gray-700 mb-2">Execution Time: {executionTime.toFixed(2)} ms</p>
          <p className="text-gray-700 mb-2">Moving Object Coordinates: {JSON.stringify(movingObjectCoordinates)}</p>
          <p className="text-gray-700">Blocking Object Coordinates: {JSON.stringify(blockingObjectCoordinates)}</p>
        </div>
      </div>
    </div>
  );
}

export default Matrix;
