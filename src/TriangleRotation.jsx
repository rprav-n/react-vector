import React, { useState } from 'react';
import { Stage, Layer, RegularPolygon } from 'react-konva';
import Victor from 'victor';

const TriangleRotation = () => {
  const [angle, setAngle] = useState(0);

  const handleAngleChange = (event) => {
    setAngle(parseInt(event.target.value));
  };

  const trianglePoints = [
    new Victor(0, -50), // Top
    new Victor(43.3, 25), // Bottom right
    new Victor(-43.3, 25), // Bottom left
  ];

  const rotatedTrianglePoints = trianglePoints.map((point) => {
    const rotatedPoint = point.clone();
    rotatedPoint.rotateDeg(angle);
    return rotatedPoint;
  });

  return (
    <div>
      <input
        type="range"
        min="0"
        max="360"
        value={angle}
        onChange={handleAngleChange}
      />
      <Stage width={window.innerWidth} height={window.innerHeight}>
        <Layer>
          <RegularPolygon
            x={window.innerWidth / 2}
            y={window.innerHeight / 2}
            sides={3}
            radius={50}
            fill="blue"
            rotation={angle}
            draggable
            onClick={() => {
              // do nothing
            }}
          />
        </Layer>
      </Stage>
    </div>
  );
};

export default TriangleRotation;