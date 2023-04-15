import { render } from "@testing-library/react";
import renderMatrix from "../src/Matrix";
import "@testing-library/jest-dom/extend-expect";

describe("renderMatrix", () => {
  it("should render the matrix with correct class names and content", () => {
    const matrixSize = 3;
    // eslint-disable-next-line no-unused-vars
    const moCoord = [1, 1];
    const boCoords = [
      [0, 0],
      [2, 2],
    ];
    // eslint-disable-next-line no-unused-vars
    const startCoord = [0, 1];
    // eslint-disable-next-line no-unused-vars
    const endCoord = [2, 1];

    const { container } = render(renderMatrix());

    const cells = container.querySelectorAll(".cell");
    expect(cells.length).toBe(matrixSize * matrixSize);

    const moCell = container.querySelector(".mo");
    expect(moCell).toHaveTextContent("MO");

    const boCells = container.querySelectorAll(".bo");
    expect(boCells.length).toBe(boCoords.length);

    const startCell = container.querySelector(".start");
    expect(startCell).toHaveTextContent("");
    const endCell = container.querySelector(".end");
    expect(endCell).toHaveTextContent("");
  });
});
