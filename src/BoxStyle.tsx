import React from 'react'

const BoxStyle = () => {
  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${matrixSize}, 30px)`, gap: "5px" }}>
    {Array.from({ length: matrixSize * matrixSize }).map((_, index) => {
      const row = Math.floor(index / matrixSize);
      const col = index % matrixSize;
      const isStart = startCoordinates[0] === row && startCoordinates[1] === col;
      const isEnd = endCoordinates[0] === row && endCoordinates[1] === col;
      const isMO = movingObjectCoordinates[0] === row && movingObjectCoordinates[1] === col;
      const isBO = blockingObjectCoordinates.some(([x, y]) => x === row && y === col);
      const isMovementHistory = movementHistory.some(([x, y]) => x === row && y === col); // Check if current cell is in movement history

      const boxStyle = {
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
  )
}

export default BoxStyle