import React, { useState } from 'react'
import { Stage } from "react-konva";
import SFVector from './components/SFVector';
import SFGrid from './components/SFGrid';
import SFOrigin from './components/SFOrigin';

function App() {

  const [gridSize, setGridSize] = useState({
    width: 800,
    height: 600,
  });
  const [gridCount, setGridCount] = useState(20);
  const [showAngle, setShowAngle] = useState(false);
  const [showGrid, setShowGrid] = useState(true);

  const [points, setPoints] = useState([300, 300, 300, 200])
  const [pointActive, setPointActive] = useState(false);

  const [points2, setPoints2] = useState([500, 500, 500, 400])
  const [point2Active, setPoint2Active] = useState(false);

  const updatePoints = (newPoints) => {
    setPoints(newPoints)
  }

  const updatePoints2 = (newPoints) => {
    setPoints2(newPoints)
  }


  const updateActive = (val) => {
    setPointActive(val)
    setPoint2Active(false)
  }

  const updateActive2 = (val) => {
    setPoint2Active(val)
    setPointActive(false)
  }

  return (
    <div
      style={{ width: '100%', height: '95vh', display: "flex", flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}
    >
      {/* Settings to control */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
        <div>
          <label htmlFor='angle'>Show Angle</label>
          <input type="checkbox" name='angle' id="angle" checked={showAngle}
            onChange={() => setShowAngle(!showAngle)}
          />
        </div>
        <div>
          <label htmlFor='gird'>Show Grid</label>
          <input type="checkbox" name='gird' id="gird" checked={showGrid}
            onChange={() => setShowGrid(!showGrid)}
          />
        </div>
      </div>

      <Stage width={gridSize.width} height={gridSize.height}
        style={{ border: '2px solid #d7d9d9', borderRadius: '4px' }}
      >

        {/* Draw the grid first */}
        {showGrid &&
          <SFGrid
            gridSize={gridSize}
            gridCount={gridCount}
          />
        }

        {/* Draw the x and y axis origin */}
        <SFOrigin 
          gridSize={gridSize}
          gridCount={gridCount}
          snap={true}
          clamp={true}
        />

        <SFVector
          active={pointActive}
          showAngle={showAngle}
          arrowStorke={'#bb0000'}
          gridSize={gridSize}
          gridCount={gridCount}
          points={points}
          snap={true}
          clamp={true}
          updatePoints={updatePoints}
          updateActive={updateActive}
          text={"a"}
        />

        {/* <SFVector
          active={point2Active}
          showAngle={showAngle}
          arrowStorke={'#0aaafa'}
          gridSize={gridSize}
          gridCount={gridCount}
          points={points2}
          snap={true}
          clamp={true}
          updatePoints={updatePoints2}
          updateActive={updateActive2}
          text={"b"}
        /> */}
      </Stage>
    </div>
  )
}

export default App