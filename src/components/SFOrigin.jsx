import React, { useState, useEffect } from 'react'
import { Layer, Circle, Line, Arrow } from 'react-konva'
import { clamp } from '../util/utils';

const SFOrigin = (props) => {

    const { width, height } = props.gridSize;
    const count = props.gridCount;

    const [position, setPosition] = useState({ x: 0, y: 0 })

    useEffect(() => {
        setPosition({
            x: 100,
            y: height - 100,
        })
    }, [width, height]);

    const handleMousePointer = (event, cursor) => {
        const container = event.target.getStage().container();
        container.style.cursor = cursor;
    }

    const handleOnDragMove = (event) => {
        let target = event.target;

        let x = target.x();
        let y = target.y();

        if (props.snap) {
            x = Math.round(x / count) * count;
            y = Math.round(y / count) * count;
        }

        if (props.clamp) {
            let gap = count * 5;
            x = clamp(x, gap, width - gap)
            y = clamp(y, gap, height - gap)
        }

        let newPosition = {
            x: x,
            y: y,
        }
        setPosition(newPosition);

        target.position({ x: x, y: y })
    }


    return (
        <Layer>

            {/* X - axis line from origin */}
            <Arrow
                points={[
                    0,
                    position.y,
                    width,
                    position.y,
                ]}
                pointerAtBeginning
                fill='black'
                stroke={"black"}
                strokeWidth={2}
            />

            <Arrow
                points={[
                    position.x,
                    height,
                    position.x,
                    0,
                ]}
                pointerAtBeginning
                fill='black'
                stroke={"black"}
                strokeWidth={2}
            />

            <Circle
                x={position.x}
                y={position.y}
                radius={8}
                stroke={"#666"}
                fill={"#ddd"}
                strokeWidth={2}
                onMouseEnter={(event) => handleMousePointer(event, 'all-scroll')}
                onMouseLeave={(event) => handleMousePointer(event, 'default')}
                draggable
                onDragMove={handleOnDragMove}
            // fillLinearGradientStartPoint={{ x: 0, y: 0 }}
            // fillLinearGradientEndPoint={{ x: 2, y: 2 }}
            // fillLinearGradientColorStops={[0, 'red', 1, 'green']}
            />


        </Layer>
    )
}

export default SFOrigin