import React, { useState } from "react";
import { Stage, Layer, Rect, Line, Arrow, Circle, Text, Arc, Label, Tag, RegularPolygon } from "react-konva";
import Victor from "victor";


const App = () => {


  // var ap = [200, 200, 200, 100];
  // const [arrowPoints, setArrowPoints] = useState(ap);

  const [redArrowPoints, setRedArrowPoints] = useState([200, 200, 200, 100]);
  const [redArrowPointsContinuous, setRedArrowPointsContinuous] = useState([200, 200, 200, 100]);

  const [snap, setSnap] = useState(true);
  const [clamp, setClamp] = useState(false);
  const [scale, setScale] = useState(1);


  const handleClamp = (value) => {
    return Math.min(Math.max(value, 0), 400);
  }

  const grid = 20;
  const gridWidth = 400;
  const linesA = [];
  const linesB = [];

  for (let i = 0; i < gridWidth / grid; i++) {
    if (i === 2) {
      linesA.push(
        <Arrow
          key={i}
          strokeWidth={2}
          stroke={'black'}
          fill="black"
          pointerAtBeginning
          pointerAtEnding
          points={[i * grid, 0, i * grid, gridWidth]}
        />
      );
    } else {
      linesA.push(
        <Line
          key={i}
          strokeWidth={(i % 5 === 0 ? 1 : 0.7)}
          stroke={(i % 5 === 0 ? "#d4d4d4" : '#e4e4e4')}
          pointerAtEnding={true}
          points={[i * grid, 0, i * grid, gridWidth]}
        />
      );
    }

    if (i === 18) {
      linesB.push(
        <Arrow
          key={i}
          fill="black"
          strokeWidth={2}
          stroke={'black'}
          pointerAtBeginning
          pointerAtEnding
          points={[0, i * grid, gridWidth, i * grid]}
        />
      )
    } else {
      linesB.push(
        <Line
          key={i}
          strokeWidth={(i % 5 === 0 ? 1 : 0.7)}
          stroke={(i % 5 === 0 ? "#d4d4d4" : '#e4e4e4')}
          points={[0, i * grid, gridWidth, i * grid]}
        />
      );
    }
  }


  const degreeToRad = (deg) => {
    return deg * (Math.PI / 180)
  }

  const radianToDeg = (rad) => {
    return rad * (180 / Math.PI)
  }

  const calculateDegree = (x1, y1, x2, y2, x3, y3, x4, y4) => {

    let vecA = new Victor(x2 - x1, y2 - y1).normalize();
    let vecB = new Victor(x4 - x3, y4 - y3).normalize();

    let angleRadians = Math.atan2(vecB.y, vecB.x) - Math.atan2(vecA.y, vecA.x);

    let angleDegrees = radianToDeg(angleRadians);

    if (angleDegrees >= 180) {
      angleDegrees -= 360;
    } else if (angleDegrees <= -180) {
      angleDegrees += 360;
    }

    return angleDegrees.toFixed(1);
  }



  // TODO: calculate red arrow center point and draw a line 90deg to the red arrow point
  const getPoints = (continuousPoints) => {

    const x1 = redArrowPointsContinuous[0];
    const y1 = redArrowPointsContinuous[1];
    const x2 = redArrowPointsContinuous[2];
    const y2 = redArrowPointsContinuous[3];

    const centerPoint = new Victor((x1 + x2) / 2, (y1 + y2) / 2);

    const directionVector = new Victor(x2 - x1, y2 - y1);
    const perpendicularVector = directionVector.clone().rotate(Math.PI / 2).normalize();

    const desiredLength = 20;
    const endPoint = centerPoint.clone().add(perpendicularVector.clone().multiplyScalar(desiredLength));

    return [centerPoint.x, centerPoint.y, endPoint.x, endPoint.y];
  };

  return (
    <div
      style={{ width: '100%', display: "flex", justifyContent: 'center', alignItems: 'center' }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: '1rem' }}>
        <button onClick={() => {
          setSnap(!snap)
        }}>Snap: {snap ? 'true' : 'false'}</button>

        <button onClick={() => {
          setClamp(!clamp)
        }}>Clamp: {clamp ? 'true' : 'false'}</button>

        <button onClick={() => {
          setScale(scale + 1)
        }}>ZOOM +</button>
        <button onClick={() => {
          setScale(scale - 1)
        }}>ZOOM -</button>

        <button onClick={() => {
          setRedArrowPoints([200, 200, 200, 100])
          setRedArrowPointsContinuous([200, 200, 200, 100])
          setScale(1)
        }}>RESET</button>

        <small>Degree: {calculateDegree(...redArrowPointsContinuous, redArrowPointsContinuous[0], redArrowPointsContinuous[1], redArrowPointsContinuous[0] + 40, redArrowPointsContinuous[1])}</small>

      </div>


      <Stage width={400} height={400} style={{ background: "lightblue", display: "flex", justifyContent: "center", padding: '1rem' }}
        onWheel={e => {

        }}
        scaleX={scale}
        scaleY={scale}

      >
        <Layer>
          <Rect
            x={0}
            y={0}
            width={400}
            height={400}
            fill={'white'}

          />

          {linesA}
          {linesB}
        </Layer>

        <Layer>

          {/* RED Arrow */}
          <Arrow
            onDragMove={e => {
              const target = e.target;
              let newX = target.x();
              let newY = target.y();
              if (snap) {
                newX = Math.round(target.x() / grid) * grid;
                newY = Math.round(target.y() / grid) * grid;
              }
              let defaultPos = redArrowPoints;

              let updatedPoints = [];

              if (clamp) {
                updatedPoints = [
                  handleClamp(defaultPos[0] + newX),
                  handleClamp(defaultPos[1] + newY),
                  handleClamp(defaultPos[2] + newX),
                  handleClamp(defaultPos[3] + newY)
                ];
              } else {
                updatedPoints = [
                  defaultPos[0] + newX,
                  defaultPos[1] + newY,
                  defaultPos[2] + newX,
                  defaultPos[3] + newY
                ];
              }

              setRedArrowPointsContinuous(updatedPoints)

              target.position({ x: 0, y: 0 });


              const container = e.target.getStage().container();
              container.style.cursor = "all-scroll";
            }}
            onMouseEnter={e => {
              const container = e.target.getStage().container();
              container.style.cursor = "all-scroll";
            }}
            onMouseLeave={e => {
              const container = e.target.getStage().container();
              container.style.cursor = "default";
            }}
            onDragEnd={(e) => {
              const target = e.target;
              let newX = target.x();
              let newY = target.y();
              if (snap) {
                newX = Math.round(target.x() / grid) * grid;
                newY = Math.round(target.y() / grid) * grid;
              }

              let defaultPos = [200, 200, 200, 300];
              defaultPos = redArrowPointsContinuous;

              const updatedPoints = [
                defaultPos[0] + newX,
                defaultPos[1] + newY,
                defaultPos[2] + newX,
                defaultPos[3] + newY
              ];
              setRedArrowPoints(updatedPoints)

              target.position({ x: 0, y: 0 });

              const container = e.target.getStage().container();
              container.style.cursor = "default";
            }}


            x={0}
            y={0}
            points={redArrowPointsContinuous}
            lineJoin="miter"
            // pointerAtEnding={false}
            pointerAtEnding
            fillEnabled
            pointerLength={10}
            pointerWidth={10}
            closed
            stroke="#bb0000"
            draggable
            fill="#bb0000"
            strokeWidth={3}
          // shadowForStrokeEnabled={false}

          />


          <Line
            points={[redArrowPointsContinuous[0], redArrowPointsContinuous[1], redArrowPointsContinuous[0] + 40, redArrowPointsContinuous[1]]}
            stroke={'#7a7a7a'}
            strokeWidth={2}
          />

          {/* <Line
            points={getPoints()}
            stroke="red"
            strokeWidth={1}
          /> */}
          <Label
            _useStrictMode
            x={getPoints()[2] - 10}
            y={getPoints()[3] - 10}
            onClick={e => {
              let target = e.target;
              console.debug(target)
            }}
            onMouseEnter={e => {
              const container = e.target.getStage().container();
              container.style.cursor = "all-scroll";
            }}
            onMouseLeave={e => {
              const container = e.target.getStage().container();
              container.style.cursor = "default";
            }}

            onDragMove={e => {
              const target = e.target;
              let newX = target.x();
              let newY = target.y();
              if (snap) {
                newX = Math.round(target.x() / grid) * grid;
                newY = Math.round(target.y() / grid) * grid;
              }
              let defaultPos = redArrowPoints;

              let updatedPoints = [];

              if (clamp) {
                updatedPoints = [
                  handleClamp(defaultPos[0] + newX),
                  handleClamp(defaultPos[1] + newY),
                  handleClamp(defaultPos[2] + newX),
                  handleClamp(defaultPos[3] + newY)
                ];
              } else {
                updatedPoints = [
                  defaultPos[0] + newX,
                  defaultPos[1] + newY,
                  defaultPos[2] + newX,
                  defaultPos[3] + newY
                ];
              }

              setRedArrowPointsContinuous(updatedPoints)

              const container = e.target.getStage().container();
              container.style.cursor = "all-scroll";
            }}

            draggable
          >
            <Tag
              fill="#f3f383"
            />
            <Text
              text="ā"
              fill="black"
              fontSize={18}
              padding={2}
              width={20}
              height={20}
              align="center"
            // fontVariant="bold"
            />
          </Label>

          <Circle
          _useStrictMode
            x={redArrowPointsContinuous[2]}
            y={redArrowPointsContinuous[3]}
            draggable
            radius={12}
            stroke={"#666"}
            // fill={"transparent"}
            fill={"#ddd"}
            strokeWidth={1}
            onMouseEnter={e => {
              const container = e.target.getStage().container();
              container.style.cursor = "pointer";
            }}
            onMouseLeave={e => {
              const container = e.target.getStage().container();
              container.style.cursor = "default";
            }}
            onDragMove={e => {
              const target = e.target;

              let x = target.x();
              let y = target.y();

              if (snap) {
                x = Math.round(target.x() / grid) * grid;
                y = Math.round(target.y() / grid) * grid;
              }

              if (clamp) {
                x = handleClamp(x)
                y = handleClamp(y)
              }

              let updatedRedArrowPoints = [redArrowPoints[0], redArrowPoints[1], x, y]

              setRedArrowPoints(updatedRedArrowPoints)
              setRedArrowPointsContinuous(updatedRedArrowPoints)

              // target.position({ x: 0, y: 0 });
            }}
          />

        </Layer>
      </Stage>
    </div>
  );
};

export default App;
