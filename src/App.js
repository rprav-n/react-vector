import React, {useState} from 'react';
import { Stage, Line, Layer, Rect } from 'react-konva';



const App = () => {

  const [line, setLine] = useState({
    x: 100,
    y: 100,
    points: [0, 0, 0, 200],
  })


  const handleDragStart = (e) => {
    
  }

  const handleDragEnd = (e) => {

  }

  return (
    <Stage width={window.innerWidth} height={window.innerHeight} style={{background:'lightgray'}}>
      <Layer >
        {/* Draw the Grid */}


      <Line
          x={line.x}
          y={line.y}
          points={line.points}
          closed
          stroke="black"
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          draggable
          strokeWidth={10}
        />
         <Rect width={50} height={50} fill="red"  />
         
      </Layer>
    </Stage>
  );
};

export default App