import React from 'react'
import { Layer, Rect, Arrow, Line } from 'react-konva'

const SFGrid = (props) => {

    const { width, height } = props.gridSize;
    const count = props.gridCount;
    const cellSize = props.cellSize;

    const linesA = [];
    const linesB = [];


    // X axis
    for (let i = 0; i < (height + count) / count; i++) {
        let stroke = "#e1e1e1";
        let strokeWidth = 1;
        if (i % 5 === 0) {
            stroke = "#d4d4d4";
            strokeWidth = 2.5;
        }
        linesA.push(
            <Line
                key={i}
                strokeWidth={strokeWidth}
                stroke={stroke}
                points={[0, i * count, width, i * count]}
            />
        )
    }


    // Y axis
    for (let j = 0; j < (width + count) / count; j++) {

        let stroke = "#e1e1e1";
        let strokeWidth = 1;
        if (j % 5 === 0) {
            stroke = "#d4d4d4";
            strokeWidth = 2.5;
        }

        linesB.push(
            <Line
                key={j}
                strokeWidth={strokeWidth}
                stroke={stroke}
                points={[j * count, 0, j * count, width]}
            />
        )
    }

    const numLinesX = Math.floor(width / cellSize);
    const numLinesY = Math.floor(height / cellSize);

    // Create arrays to store grid lines
    const linesX = Array.from(Array(numLinesX + 1).keys());
    const linesY = Array.from(Array(numLinesY + 1).keys());

    return (
        <Layer>
            <Rect
                x={0}
                y={0}
                width={width}
                height={height}
                fill={'white'}
            />

            {linesA}
            {linesB}

            {/* {linesX.map((i) => (
                <Line
                    key={`x_${i}`}
                    points={[i * cellSize, 0, i * cellSize, height]}
                    stroke="#ccc"
                    strokeWidth={1}
                />
            ))}
            {linesY.map((j) => (
                <Line
                    key={`y_${j}`}
                    points={[0, j * cellSize, width, j * cellSize]}
                    stroke="#ccc"
                    strokeWidth={1}
                />
            ))} */}
        </Layer>
    )
}

export default SFGrid