import React, { useEffect, useState } from "react";
import { SiMatrix } from "react-icons/si";
import { BiObjectsVerticalBottom } from "react-icons/bi";
import { MdOutlineStart } from "react-icons/md";
import { GiFinishLine } from "react-icons/gi";

//! TODO: SET START CORRECTLY in input  !!!

function Matrix() {
  const [matrixSize, setMatrixSize] = useState(import.meta.env.VITE_MATRIX_SIZE || 5); //Can be changed in .env file
  const [numberOfBlockingObjects, setNumberOfBlockingObjects] = useState(import.meta.env.VITE_BLOCKING_OBJECTS || 3); //Can be changed in .env file
  const [startCoordinates, setStartCoordinates] = useState([import.meta.env.VITE_START_X || 0, import.meta.env.VITE_START_Y || 0]);
  const [endCoordinates, setEndCoordinates] = useState([
    import.meta.env.VITE_END_X || matrixSize - 1,
    import.meta.env.VITE_END_Y || matrixSize - 1,
  ]);
  const [movingObjectCoordinates, setMovingObjectCoordinates] = useState([startCoordinates[0], startCoordinates[1]]);
  const [blockingObjectCoordinates, setBlockingObjectCoordinates] = useState<number[][]>([]);
  const [executionTime, setExecutionTime] = useState(0);
  const [movementHistory, setMovementHistory] = useState<number[][]>([]); // Store movement history
  const [clickCount, setClickCount] = useState(0);

  const random = () => {
    return Math.random();
  };

  const floor = (number: number) => {
    return Math.floor(number);
  };

  const handleButtonClick5x5 = () => {
    if (matrixSize === "5") {
      setClickCount((prevClickCount) => prevClickCount + 1);
      switch (clickCount) {
        case 0:
          setNumberOfBlockingObjects(1);
          break;
        case 1:
          setNumberOfBlockingObjects(2);
          break;
        case 2:
          setNumberOfBlockingObjects(3);
          break;
        default:
          setNumberOfBlockingObjects(0);
          setNumberOfBlockingObjects(import.meta.env.VITE_BLOCKING_OBJECTS || 3);
      }
    }
  };

  const handleButtonClick10x10 = () => {
    if (matrixSize === "10") {
      setClickCount((prevClickCount) => prevClickCount + 1);
      switch (clickCount) {
        case 0:
          setNumberOfBlockingObjects(2);
          break;
        case 1:
          setNumberOfBlockingObjects(3);
          break;
        case 2:
          setNumberOfBlockingObjects(4);
          break;
        default:
          setNumberOfBlockingObjects(0);
          setNumberOfBlockingObjects(import.meta.env.VITE_BLOCKING_OBJECTS || 3);
      }
    }
  };

  const handleButtonClick20x20 = () => {
    if (matrixSize === "20") {
      setClickCount((prevClickCount) => prevClickCount + 1);
      switch (clickCount) {
        case 0:
          setNumberOfBlockingObjects(3);
          break;
        case 1:
          setNumberOfBlockingObjects(4);
          break;
        case 2:
          setNumberOfBlockingObjects(5);
          break;
        default:
          setNumberOfBlockingObjects(0);
          setNumberOfBlockingObjects(import.meta.env.VITE_BLOCKING_OBJECTS || 3);
      }
    }
  };

  const handleStartXChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newX = parseInt(event.target.value);
    setStartCoordinates((prevCoords) => [newX, prevCoords[1]]);
  };

  const handleStartYChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newY = parseInt(event.target.value);
    setStartCoordinates((prevCoords) => [prevCoords[0], newY]);
  };

  const handleEndXChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newX = parseInt(event.target.value);
    setEndCoordinates((prevCoords) => [newX, prevCoords[1]]);
  };

  const handleEndYChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newY = parseInt(event.target.value);
    setEndCoordinates((prevCoords) => [prevCoords[0], newY]);
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
      setMovementHistory((prevMovementHistory) => [...prevMovementHistory, [...newMovingObjectCoordinates]]);
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

  // console.log({
  //   movingObjectCoordinates: movementHistory, //! SEE IF IT IS HISTORY OR OLNLY MOVMENT!
  //   blockingObjectCoordinates: blockingObjectCoordinates,
  // }); //! IF The result should be an array of objects containing movingObjectCoordinates and blockingObjetsCoordinates keys, this should be in the log !!!DONE!!!

  return (
    <div className="flex flex-col justify-center items-center w-screen h-[80vh] gap-12">
      <h1 className="text-4xl font-semibold">Matrix Visualization</h1>
      <div className="flex flex-row gap-12">
        <div>
          <p className="font-bold text-xl">Matrix Size</p>
          <input type="number" value={matrixSize} onChange={(e) => setMatrixSize(e.target.value)} />
        </div>
        <div>
          <p className="font-bold text-xl">Number of Blocking Objects</p>
          <input type="number" value={numberOfBlockingObjects} onChange={(e) => setNumberOfBlockingObjects(parseInt(e.target.value))} />
        </div>
        <div className="flex flex-row">
          <label>
            Start X:
            <input type="number" value={startCoordinates[0]} onChange={handleStartXChange} />
          </label>
          <label>
            Start Y:
            <input type="number" value={startCoordinates[1]} onChange={handleStartYChange} />
          </label>
        </div>

        <div>
          <label>
            End X:
            <input type="number" value={endCoordinates[0]} onChange={handleEndXChange} />
          </label>
          <label>
            End Y:
            <input type="number" value={endCoordinates[1]} onChange={handleEndYChange} />
          </label>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${matrixSize}, 30px)`, gap: "5px" }}>
        {Array.from({ length: matrixSize * matrixSize }).map((_, index) => {
          const row = Math.floor(index / matrixSize);
          const col = index % matrixSize;
          const isStart = startCoordinates[0] === row && startCoordinates[1] === col;
          const isEnd = endCoordinates[0] === row && endCoordinates[1] === col;
          const isMO = movingObjectCoordinates[0] === row && movingObjectCoordinates[1] === col;
          const isBO = blockingObjectCoordinates.some(([x, y]) => x === row && y === col);
          const isMovementHistory = movementHistory.some(([x, y]) => x === row && y === col); // Check if current cell is in movement history

          let boxStyle = {
            width: "30px",
            height: "30px",
            border: isMovementHistory ? "2px solid blue" : "1px solid #000", // Apply style for movement history
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: isStart ? "green" : isEnd ? "red" : isMO ? "blue" : isBO ? "gray" : "transparent",
            color: isMO ? "#fff" : "#000",
          };

          return <div key={index} style={boxStyle}></div>;
        })}
      </div>
      <button onClick={handleButtonClick5x5}>5x5</button>
      //! Works only if matrix is 5x5
      <button onClick={handleButtonClick10x10}>10x10</button>
      //! Works only if matrix is 10x10
      <button onClick={handleButtonClick20x20}>20x20</button>
      //! Works only if matrix is 20x20
    </div>
  );
}

export default Matrix;
