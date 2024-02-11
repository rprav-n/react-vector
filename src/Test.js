import React, {useState} from "react";
import { Stage, Layer, Rect, Line, Arrow, Circle, Text } from "react-konva";



const Test = () => {


// var ap = [200, 200, 200, 100];
// const [arrowPoints, setArrowPoints] = useState(ap);
const [redArrowPoints, setRedArrowPoints] = useState([200, 200, 200, 300])

const [snap, setSnap] = useState(false);
const [clamp, setClamp] = useState(false);
const [scale, setScale] = useState(1);
const [gridTheme, setGridTheme] = useState('l');


  const handleClamp = (value) => {
    return Math.min(Math.max(value, 0), 400);
  }

  const grid = 20;
  const gridWidth = 400;
  const linesA = [];
  const linesB = [];
  
  for (let i = 0; i < gridWidth / grid; i++) {
    linesA.push(
      <Line
          key={i}
        strokeWidth={1}
        stroke={gridTheme === 'l' ? "#dbdbdb" :'#000'}
        points={[i * grid, 0, i * grid, gridWidth]}
      />
    );
  
    linesB.push(
      <Line
      key={i}
        strokeWidth={1}
        stroke={gridTheme === 'l' ? "#dbdbdb" :'#000'}
        points={[0, i * grid, gridWidth, i * grid]}
      />
    );
  }
  

  return (
    <div 
    style={{ width:'100%', display:"flex", justifyContent:'center', alignItems:'center'}}
    >

        
        <div style={{display:"flex", flexDirection:"column", gap:'1rem'}}>

        <button onClick={() => {
              setGridTheme(gridTheme === 'l' ? 'd' : 'l')
          }}>Grid: {gridTheme === 'l' ? 'dark' :'light'}</button>

          <button onClick={() => {
              setSnap(!snap)
          }}>Snap: {snap ? 'true' :'false'}</button>

          <button onClick={() => {
              setClamp(!clamp)
          }}>Clamp: {clamp ? 'true' :'false'}</button>

          <button onClick={() => {
              setScale(scale+1)
          }}>ZOOM +</button>
          <button onClick={() => {
              setScale(scale-1)
          }}>ZOOM -</button>
    
          <button onClick={() => {
              setRedArrowPoints([100, 100, 100, 200])
              setScale(1)
              setGridTheme('l')
          }}>RESET</button>
        </div>

        <Stage width={400} height={400} style={{background:"lightblue", display:"flex", justifyContent:"center", padding:'1rem' }} 
        onWheel={e => {
          
        }}
        scaleX={scale}
        scaleY={scale}
        onMouseMove={e => {
           /*  console.log("Mouse is moving",  e.evt.offsetY)
            let newArrowPoints = [...arrowPoints]
            let newX = e.evt.offsetX;
            let newY = e.evt.offsetY;

            newArrowPoints[2] = newX;
            newArrowPoints[3] = newY;
            setArrowPoints(newArrowPoints); */
          }}
        >
      <Layer 
    //   onMouseMove={e => {
    //     console.log("click e",  e.evt.offsetY)
    //     let newArrowPoints = [...arrowPoints]
    //     newArrowPoints[2] = e.evt.offsetX
    //     newArrowPoints[3] = e.evt.offsetY
    //     setArrowPoints(newArrowPoints);
    //   }}
      >
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
              const newX = Math.round(target.x() / grid) * grid;
              const newY = Math.round(target.y() / grid) * grid;

              target.position({ x: newX, y: newY });
              target.getLayer().batchDraw(); // Optionally force redraw
            }}
            onDragEnd={(e) => {
                const target = e.target;
                
                const newX = Math.round(target.x() / grid) * grid;
                const newY = Math.round(target.y() / grid) * grid;
                
                // Default points: [100, 100, 100, 200]
                let defaultPos = [100, 100, 100, 200]
                defaultPos = redArrowPoints

                const updatedPoints = [
                  defaultPos[0] + newX,
                  defaultPos[1] + newY,
                  defaultPos[2] + newX,
                  defaultPos[3] + newY
                ];


                setRedArrowPoints(updatedPoints)

              }}
          x={0}
          y={0}
          points={redArrowPoints}
          lineJoin="miter"
          pointerAtEnding
          closed
          stroke="#bb0000"
          // draggable
          fill="#bb0000"
          tension={1}
          strokeWidth={2}

        />

        <Text 
          x={(redArrowPoints[0] + redArrowPoints[2])/2}
          y={(redArrowPoints[1] + redArrowPoints[3])/2}
          offsetX={20}
          offsetY={20}
          text="a"
          fill="red"
          fontSize='16'
          fontVariant="bold"
        />

        <Circle 
        _useStrictMode
          x={redArrowPoints[2]}
          y={redArrowPoints[3]}
          // offsetY={-10}
          draggable
          radius={10}
          // stroke={"#666"}
          fill={"transparent"}
          strokeWidth={1}
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

            target.position({ x: x, y: y });
            target.getLayer().batchDraw(); // Optionally force redraw
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

export default Test;
