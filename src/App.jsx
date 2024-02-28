import React, { useState, useEffect } from 'react'
import { Stage } from "react-konva";
// import SFVector from './components/SFVector';
import SFGrid from './components/SFGrid';
import SFOrigin from './components/SFOrigin';
import SFVectorClass from './components/SFVectorClass';
import "./index.css";

const alphabets = "abcdefghijklmnopqrstuvwxyz";

function App() {

  const [gridSize, setGridSize] = useState({
    // width: window.innerWidth,
    // height: window.innerHeight / 2,
    width: 600,
    height: 600,
  });
  const [gridCount, setGridCount] = useState(20);
  // const [cellSize, setCellSize] = useState(5);
  const cellSize = 5;
  const [showAngle, setShowAngle] = useState(true);
  const [showGrid, setShowGrid] = useState(true);
  const [showComponents, setShowComponents] = useState(false);
  const [snap, setSnap] = useState(true);
  const [showValues, setShowValues] = useState(false);
  const [debug, setDebug] = useState(false);

  const [selectedVec, setSelectedVec] = useState(null);

  const [vectors, setVectors] = useState([]);


  const [angleVal, setAngleVal] = useState('');
  const [lengthVal, setLengthVal] = useState('');
  const [xlengthVal, setXLengthVal] = useState('');
  const [ylengthVal, setYLengthVal] = useState('');

  const handleAddNewVector = () => {
    let newVector = {
      points: [300, 300, 300, 200],
      // points: [300, 300, 264.1541107096664, 371.51973308804463],
      active: true,
      length: 5.0,
      degree: 90,
      xLength: 0.0,
      yLength: 5.0,
      color: '#0aaafa',
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
      setSelectedVec(null);
    }

  }

  const updateVectorLength = (index, distance) => {
    // setLengthVal(distance);
    let sv = selectedVec;
    sv.length = distance;
    setSelectedVec(sv);
  }

  const updateVectornAngle = (angleDegrees) => {
    // setAngleVal(angleDegrees);
    let sv = selectedVec;
    sv.degree = angleDegrees;
    setSelectedVec(sv)
  }
  
  const updateVectorXComponentLength = (val) => {
    let sv = selectedVec;
    sv.xLength = val;
    setSelectedVec(sv);
  }

  const updateVectorYComponentLength = (val) => {
    let sv = selectedVec;
    sv.yLength = val;
    setSelectedVec(sv);
  }

  const handleLengthChange = (event) => {
    let val = parseFloat(event.target.value);

    let index = vectors.findIndex(vec => vec.text === selectedVec.text);
    if (index < 0) return;

    let newVectors = [...vectors];

    newVectors[index].length = val;

    setVectors([...newVectors])
  }

  const updateSelectedArrowPoints = (lengthVal) => {
    let index = vectors.findIndex(vec => vec.text === selectedVec.text);
    if (index < 0) return;


    let [x1, y1, x2, y2] = vectors[index].points;

    let angle = parseFloat(angleVal);

    let newX2 = x1 + lengthVal * gridCount * Math.cos(angle);
    let newY2 = y1 + lengthVal * gridCount * Math.sin(angle);

    let newPoints = [x1, y1, newX2, newY2];

    let newVectors = [...vectors];

    newVectors[index] = {
      ...newVectors[index],
      points: newPoints
    }

    console.debug("newVectors", newVectors, x1, y1, x2, y2)

    setVectors([...newVectors])
  }


  return (
    <div
      style={{ width: '100%', display: "flex", flexWrap: 'wrap', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', }}
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
          {/* <div>
            <label htmlFor='count'>Grid Count: {gridCount}</label>
            <input type="range" name='count' id='count' step={20} min={20} max={60} value={gridCount} onChange={e => {
              setGridCount(parseInt(e.target.value, 10));
            }} />
          </div> */}
        </div>

        <div style={{
          display: 'flex',
          justifyContent: 'center',
          // flexDirection:'column',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          width: '400px'
        }}>
          <div>
            <label htmlFor='gird'>Show Grid</label>
            <input type="checkbox" name='gird' id="gird" checked={showGrid}
              onChange={() => setShowGrid(!showGrid)}
            />
          </div>
          <div>
            <label htmlFor='angle'>Show Angle</label>
            <input type="checkbox" name='angle' id="angle" checked={showAngle}
              onChange={() => setShowAngle(!showAngle)}
            />
          </div>
          <div>
            <label htmlFor='snap'>Snap To Grid</label>
            <input type="checkbox" name='snap' id="snap" checked={snap}
              onChange={() => setSnap(!snap)}
            />
          </div>
          <div>
            <label htmlFor='components'>Show Components</label>
            <input type="checkbox" name='components' id="components" checked={showComponents}
              onChange={() => setShowComponents(!showComponents)}
            />
          </div>
          <div>
            <label htmlFor='values'>Show Values</label>
            <input type="checkbox" name='values' id="values" checked={showValues}
              onChange={() => setShowValues(!showValues)}
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
                height: window.innerHeight / 2,
              });
              setSelectedVec(null);
            }}>RESET ALL</button>
          </div>
        </div>
      </div>

      {/* Selected Vector values */}
      <div className='card-container' style={{
        display: selectedVec ? 'flex' : 'none'
      }}>
        <div className='card' >
          <span className='card-title'>|{selectedVec?.text}|:</span>
          <span className='card-input'>
            <input type="number" name='length' id='length' onChange={() => { }} value={selectedVec?.length} />
          </span>
        </div>
        <div className='card'>
          <span className='card-title'>θ:</span>
          <span className='card-input'>
            <input type="number" name='degree' id='degree' onChange={() => { }} value={selectedVec?.degree} />
          </span>
        </div>
        <div className='card'>
          <span className='card-title'>{selectedVec?.text}(x):</span>
          <span className='card-input'>
            <input type="number" name='x' id='x' onChange={() => { }} value={selectedVec?.xLength} />
          </span>
        </div>
        <div className='card'>
          <span className='card-title'>{selectedVec?.text}(y):</span>
          <span className='card-input'>
            <input type="number" name='y' id='y' onChange={() => { }} value={selectedVec?.yLength} />
          </span>
        </div>
      </div>

      <Stage width={gridSize.width} height={gridSize.height}
        style={{ border: '2px solid #d7d9d9', borderRadius: '4px',  }}
        scaleX={1}
        scaleY={1}
      >

        {/* Draw the grid first */}
        {showGrid &&
          <SFGrid
            gridSize={gridSize}
            gridCount={gridCount}
            cellSize={cellSize}
          />
        }

        {/* Draw the x and y axis origin */}
        <SFOrigin
          gridSize={gridSize}
          gridCount={gridCount}
          snap={true}
          clamp={true}
          cellSize={cellSize}
        />

        {/* {vectors.map((vec, index) => {
          return <SFVector
            key={index}
            cellSize={cellSize}
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
        })} */}
        {vectors.map((vec, index) => {
          return <SFVectorClass
            key={index}
            index={index}
            cellSize={cellSize}
            debug={debug}
            active={vec.active}
            showAngle={showAngle}
            showComponents={showComponents}
            showValues={showValues}
            strokeColor={vec.color}
            strokeWidth={5}
            gridSize={gridSize}
            gridCount={gridCount}
            points={vec.points}
            length={vec.length}
            snap={snap}
            clamp={true}
            updateVectorLength={updateVectorLength}
            updateVectornAngle={updateVectornAngle}
            updateVectorXComponentLength={updateVectorXComponentLength}
            updateVectorYComponentLength={updateVectorYComponentLength}
            updatePoints={(newPoints) => {
              let newVecArr = [...vectors];
              newVecArr[index].points = newPoints;
              setVectors(newVecArr);
            }}
            updateActive={(val) => {
              let newVecArr = vectors.map(v => ({ ...v, active: false }));
              newVecArr[index].active = val;

              setSelectedVec({
                ...newVecArr[index],
                ...selectedVec,

              });

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