import React from 'react'
import { Layer, Rect, Arrow, Line } from 'react-konva'

const SFGrid = (props) => {

    const { width, height } = props.gridSize;
    const count = props.gridCount;
    const cellSize = props.gridCellSize;

    const linesA = [];
    const linesB = [];


    // X axis
    for (let i = 0; i < (height + 20) / count; i++) {
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
    for (let j = 0; j < (width + 20) / count; j++) {

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
        </Layer>
    )
}

export default SFGrid