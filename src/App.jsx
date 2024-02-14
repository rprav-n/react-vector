import React, { useState } from 'react'
import { Stage } from "react-konva";
import SFVector from './components/SFVector';
import SFGrid from './components/SFGrid';
import SFOrigin from './components/SFOrigin';

const alphabets = "abcdefghijklmnopqrstuvwxyz";

function App() {

  const [gridSize, setGridSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight / 2,
  });
  const [gridCount, setGridCount] = useState(20);
  const [showAngle, setShowAngle] = useState(true);
  const [showGrid, setShowGrid] = useState(true);
  const [showComponents, setShowComponents] = useState(false);
  const [debug, setDebug] = useState(false);

  const [selectedVec, setSelectedVec] = useState(null);

  const [vectors, setVectors] = useState([]);

  const handleAddNewVector = () => {
    let newVector = {
      points: [300, 300, 300, 200],
      active: true,
      color: '#bb0000',
      text: alphabets.charAt(vectors.length),
    }

    let oldVectors = vectors.map(v => ({ ...v, active: false }))
    setVectors([...oldVectors, newVector])
    setSelectedVec(newVector);
  }

  const handleDeleteVector = () => {
    if (vectors.length) {
      let newVecArr = vectors.filter(v => !v.active);
      setVectors(newVecArr);
    }

  }

  return (
    <div
      style={{ width: '100%', display: "flex", flexWrap: 'wrap', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}
    >
      {/* Settings to control */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: '1rem', paddingBottom: '1rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label htmlFor='width'>Grid Width: {gridSize.width}</label>
            <input type="range" name='width' id='width' step={20} min={200} max={1000} value={gridSize.width} onChange={e => {
              setGridSize({
                height: gridSize.height,
                width: parseInt(e.target.value, 10),
              })
            }} />
          </div>
          <div>
            <label htmlFor='height'>Grid Height: {gridSize.height}</label>
            <input type="range" name='height' id='height' step={20} min={200} max={1000} value={gridSize.height} onChange={e => {
              setGridSize({
                width: gridSize.width,
                height: parseInt(e.target.value, 10),
              })
            }} />
          </div>
          <div>
            <label htmlFor='count'>Grid Count: {gridCount}</label>
            <input type="range" name='count' id='count' step={10} min={10} max={60} value={gridCount} onChange={e => {
              setGridCount(parseInt(e.target.value, 10));
            }} />
          </div>
        </div>

        <div style={{
          display: 'flex',
          justifyContent: 'center',
          // flexDirection:'column',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
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
          <div>
            <label htmlFor='components'>Show Components</label>
            <input type="checkbox" name='components' id="components" checked={showComponents}
              onChange={() => setShowComponents(!showComponents)}
            />
          </div>
          <div>
            <label htmlFor='debug'>Debug Mode</label>
            <input type="checkbox" name='debug' id="debug" checked={debug}
              onChange={() => setDebug(!debug)}
            />
          </div>
          <div>
            <label htmlFor='color'>Color: </label>
            <input type="color" name='color' id="color" value={selectedVec?.color || "#bb0000"} onChange={(e) => {
              let color = e.target.value;
              let index = vectors.findIndex(v => v.active);
              if (index < 0) return;
              let newVectorArr = [...vectors];
              newVectorArr[index].color = color;
              setVectors(newVectorArr);
            }} />
          </div>
        </div>
        <div 
        style={{
          display: 'flex',
          justifyContent: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div>
            <button onClick={handleAddNewVector} disabled={vectors.length >= 3}>Add new vector</button>
          </div>
          <div>
            <button onClick={handleDeleteVector}>Delete Vector</button>
          </div>
          <div>
            <button onClick={() => {
              setVectors([]);
              setShowAngle(false);
              setShowComponents(false);
              setShowGrid(true);
              setGridCount(20);
              setGridSize({
                width: window.innerWidth,
                height: window.innerHeight/2,
              });
              setSelectedVec(null);
            }}>RESET ALL</button>
          </div>
        </div>
      </div>

      <Stage width={gridSize.width} height={gridSize.height}
        style={{ border: '2px solid #d7d9d9', borderRadius: '4px' }}
        scaleX={1}
        scaleY={1}
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

        {vectors.map((vec, index) => {
          return <SFVector
            key={index}
            debug={debug}
            active={vec.active}
            showAngle={showAngle}
            showComponents={showComponents}
            arrowStorke={vec.color}
            gridSize={gridSize}
            gridCount={gridCount}
            points={vec.points}
            snap={true}
            clamp={true}
            updatePoints={(newPoints) => {
              let newVecArr = [...vectors];
              newVecArr[index].points = newPoints;
              setVectors(newVecArr);
            }}
            updateActive={(val) => {
              let newVecArr = vectors.map(v => ({ ...v, active: false }));
              newVecArr[index].active = val;

              setSelectedVec(newVecArr[index]);

              setVectors(newVecArr);
            }}
            text={vec.text}
          />
        })}

        {/* <SFVector
          active={pointActive}
          showAngle={showAngle}
          arrowStorke={color}
          gridSize={gridSize}
          gridCount={gridCount}
          points={points}
          snap={true}
          clamp={true}
          updatePoints={updatePoints}
          updateActive={updateActive}
          text={"a"}
        /> */}

      </Stage>
    </div>
  )
}

export default App