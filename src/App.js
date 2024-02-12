import React, { useState } from "react";
import { Stage, Layer, Rect, Line, Arrow, Circle, Text, Arc, Label, Tag, RegularPolygon } from "react-konva";



const App = () => {


  // var ap = [200, 200, 200, 100];
  // const [arrowPoints, setArrowPoints] = useState(ap);

  const [redArrowPoints, setRedArrowPoints] = useState([200, 200, 200, 100]);
  const [redArrowPointsContinuous, setRedArrowPointsContinuous] = useState([200, 200, 200, 100]);
  // const [baseLine, setBaseLine] = useState()
  const [textPoints, setTextPoints] = useState([200, 200, 200, 100]);


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
          setTextPoints([200, 200, 200, 100])
          setScale(1)
        }}>RESET</button>
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


          {/* BLACK rectangle */}
          <Rect
            visible={false}
            onDragMove={(e) => {
              const target = e.target;
              let newX = target.x();
              let newY = target.y();

              if (snap) {
                newX = Math.round(target.x() / grid) * grid;
                newY = Math.round(target.y() / grid) * grid;
              }

              const clampedX = Math.max(0, Math.min(newX, 400 - target.width()));
              const clampedY = Math.max(0, Math.min(newY, 400 - target.height()));

              target.position({ x: clampedX, y: clampedY });
              target.getLayer().batchDraw(); // Optionally force redraw
            }}
            x={0}
            y={0}
            draggable
            width={grid}
            height={grid}
            fill="rgba(0, 0, 0, 1)"
            strokeWidth={5}
          />


          {/* RED Arrow */}
          <Arrow
            _useStrictMode
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



              setTextPoints(updatedPoints)
              setRedArrowPointsContinuous(updatedPoints)

              target.position({ x: 0, y: 0 });
              target.getLayer().batchDraw();

              // console.debug("updatedPoints", updatedPoints, redArrowPoints, newX, newY)

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
              // console.debug("redArrowPoints", redArrowPoints, updatedPoints, target.x(), target.y())
              setRedArrowPoints(updatedPoints)
              setTextPoints(updatedPoints)

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
            strokeWidth={2}
          // shadowForStrokeEnabled={false}

          />

          {/* <RegularPolygon 
            sides={3}
            fill="#bb0000"
            strokeWidth={4}
            offsetY={-10}
            x={redArrowPointsContinuous[2]}
            y={redArrowPointsContinuous[3]}
            radius={10}
          /> */}

          <Line
            points={[redArrowPointsContinuous[0], redArrowPointsContinuous[1], redArrowPointsContinuous[0] + 40, redArrowPointsContinuous[1]]}
            stroke={'black'}
            strokeWidth={2}
          />

          {/* <Arc 
            x={200}
            y={200}
            innerRadius={1}
            outerRadius={10}
            angle={100}
            fill="yellow"
            stroke={'black'}
            strokeWidth={2}
          /> */}
          {/* <Line 
            // points={[5, 70, 140, 23, 250, 60]}
            points={[
                redArrowPointsContinuous[0]+20, redArrowPointsContinuous[1], 
                redArrowPointsContinuous[0]+20, redArrowPointsContinuous[1]-20,
                // redArrowPointsContinuous[2]+20, redArrowPointsContinuous[3]+20,
                redArrowPointsContinuous[0], redArrowPointsContinuous[1]-20,
              ]}
            stroke={'red'}
            strokeWidth={2}
            tension={1}
          /> */}

          {/*  <Text
            // x={(redArrowPoints[0] + redArrowPoints[2]) / 2}
            // y={(redArrowPoints[1] + redArrowPoints[3]) / 2}
            x={(textPoints[0] + textPoints[2]) / 2}
            y={(textPoints[1] + textPoints[3]) / 2}
            offsetX={20}
            // offsetY={20}
            text="a"
            fill="red"
            fontSize={16}
            fontVariant="bold"
          /> */}

          <Label
            x={(redArrowPointsContinuous[0] + redArrowPointsContinuous[2]) / 2}
            y={(redArrowPointsContinuous[1] + redArrowPointsContinuous[3]) / 2}
            // offsetX={20}
            // offsetY={20}
            onMouseEnter={e => {
              const container = e.target.getStage().container();
              container.style.cursor = "all-scroll";
            }}
            onMouseLeave={e => {
              const container = e.target.getStage().container();
              container.style.cursor = "default";
            }}

          >
            <Tag
              fill="yellow"
            />
            <Text
              text="a"
              fill="black"
              fontSize={18}
              padding={2}
            // fontVariant="bold"
            />
          </Label>

          <Circle
            _useStrictMode
            x={redArrowPointsContinuous[2]}
            y={redArrowPointsContinuous[3]}
            // offsetY={-10}
            draggable
            radius={12}
            // stroke={"#666"}
            fill={"transparent"}
            // fill={"#ddd"}
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
              setTextPoints(updatedRedArrowPoints)

              target.position({ x: 0, y: 0 });
              // target.getLayer().batchDraw(); // Optionally force redraw
              // setRedArrowAnchor(x, y)
            }}
          />


          {/* BLUE Arrow */}
          {/* <Arrow 
            x={0}
            y={0}
            points={arrowPoints}
            closed
            stroke="#0aaafa"
            draggable
            strokeWidth={5}
            onDragMove={e => {

            }}
            onMouseDown={e => {
                console.log("Mouse is moving",  e.evt.offsetY)
                let newArrowPoints = [...arrowPoints]
                let newX = e.evt.offsetX;
                let newY = e.evt.offsetY;
    
                newArrowPoints[2] = newX;
                newArrowPoints[3] = newY;
                setArrowPoints(newArrowPoints);
              }}
        /> */}



        </Layer>
      </Stage>
    </div>
  );
};

export default App;
