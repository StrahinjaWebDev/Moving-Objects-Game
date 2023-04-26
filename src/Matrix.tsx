import React, { useEffect, useState } from "react";
import { SiMatrix } from "react-icons/si";
import { BiObjectsVerticalBottom } from "react-icons/bi";
import { MdOutlineStart } from "react-icons/md";
import { GiFinishLine } from "react-icons/gi";

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
  const [movementHistory, setMovementHistory] = useState<number[][]>([]);
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
      clearInterval(intervalId);
    };
  }, [movingObjectCoordinates, matrixSize, numberOfBlockingObjects, startCoordinates, endCoordinates]);

  console.log({ movingObjectCoordinates, blockingObjectCoordinates });
  return (
    <div className="flex flex-col items-center w-screen h-[200vh] gap-12  bg-gray-300">
      <h1 className="text-4xl font-semibold">Matrix Visualization</h1>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${matrixSize}, 30px)`, gap: "5px" }}>
        {Array.from({ length: matrixSize * matrixSize }).map((_, index) => {
          const [row, col] = [Math.floor(index / matrixSize), index % matrixSize];
          const isCellOccupied =
            startCoordinates[0] === row && startCoordinates[1] === col
              ? "green"
              : endCoordinates[0] === row && endCoordinates[1] === col
              ? "red"
              : movingObjectCoordinates[0] === row && movingObjectCoordinates[1] === col
              ? "blue"
              : blockingObjectCoordinates.some(([x, y]) => x === row && y === col)
              ? "gray"
              : "transparent";

          const isMovementHistory = movementHistory.some(([x, y]) => x === row && y === col);
          const boxStyle = {
            width: "30px",
            height: "30px",
            border: isMovementHistory ? "2px solid blue" : "1px solid #000",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: isCellOccupied,
            color: isCellOccupied === "blue" ? "#fff" : "#000",
          };

          return <div key={index} style={boxStyle}></div>;
        })}
      </div>
      <div className="flex flex-row gap-12">
        <div className="flex flex-col gap-3">
          <p className="font-bold text-2xl flex gap-3">
            <SiMatrix size={"1.4em"} /> Matrix Size
          </p>
          <input
            className="border-2 rounded-xl border-black hover:border-blue-500"
            type="number"
            value={matrixSize}
            onChange={(e) => setMatrixSize(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-3">
          <p className="font-bold text-xl flex gap-3">
            <BiObjectsVerticalBottom size={"2em"} /> Number of Blocking Objects
          </p>
          <input
            className="border-2 rounded-xl border-black hover:border-blue-500 w-[70%] "
            type="number"
            value={numberOfBlockingObjects}
            onChange={(e) => setNumberOfBlockingObjects(parseInt(e.target.value))}
          />
        </div>
        <div className="flex flex-col gap-3">
          <p className="text-xl flex font-bold gap-3">
            <MdOutlineStart size={"1.3em"} /> Start Coordinates:
          </p>
          <p className="font-semibold flex gap-3">
            Start X:
            <input
              className="border-2 rounded-xl border-black hover:border-blue-500"
              type="number"
              value={startCoordinates[0]}
              onChange={handleStartXChange}
            />
          </p>
          <p className="font-semibold flex gap-3">
            Start Y:
            <input
              className="border-2 rounded-xl border-black hover:border-blue-500"
              type="number"
              value={startCoordinates[1]}
              onChange={handleStartYChange}
            />
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <p className="text-xl font-bold flex gap-3">
            <GiFinishLine size={"1.8em"} /> End Coordinates:
          </p>
          <p className="font-semibold flex gap-3">
            End X:
            <input
              className="border-2 rounded-xl border-black hover:border-blue-500"
              type="number"
              value={endCoordinates[0]}
              onChange={handleEndXChange}
            />
          </p>
          <p className="font-semibold flex gap-3">
            End Y:
            <input
              className="border-2 rounded-xl border-black hover:border-blue-500 "
              type="number"
              value={endCoordinates[1]}
              onChange={handleEndYChange}
            />
          </p>
        </div>
      </div>
      <div className="flex flex-row gap-12">
        <div className="flex flex-col justify-center gap-3">
          <button className="border-black border-2 rounded-full bg-blue-500 hover:opacity-75" onClick={handleButtonClick5x5}>
            5x5
          </button>
          <p className="animate-bounce text-red-500 font-medium"> (Works only if matrix is 5x5)</p>
        </div>
        <div className="flex flex-col justify-center gap-3">
          <button className="border-black border-2 rounded-full bg-blue-500 hover:opacity-75" onClick={handleButtonClick10x10}>
            10x10{" "}
          </button>
          <p className="animate-bounce text-red-500 font-medium">(Works only if matrix is 10x10)</p>
        </div>
        <div className="flex flex-col justify-center gap-3">
          <button className="border-black border-2 rounded-full bg-blue-500 hover:opacity-75" onClick={handleButtonClick20x20}>
            20x20
          </button>
          <p className="animate-bounce text-red-500 font-medium">(Works only if matrix is 20x20)</p>
        </div>
      </div>
    </div>
  );
}

export default Matrix;
