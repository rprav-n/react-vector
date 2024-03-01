import React, { useState } from 'react'
import { Stage } from "react-konva";
import SFGrid from './components/SFGrid';
import SFOrigin from './components/SFOrigin';
import SFVectorClass from './components/SFVectorClass';
import "./index.css";
import { degreeToRadian } from './util/utils';

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
  const [showComponents2, setShowComponents2] = useState(false);
  const [snap, setSnap] = useState(true);
  const [showValues, setShowValues] = useState(false);
  const [debug, setDebug] = useState(false);

  const [selectedVec, setSelectedVec] = useState(null);

  const [vectors, setVectors] = useState([]);


  const [angleVal, setAngleVal] = useState(90);
  const [lengthVal, setLengthVal] = useState(5.0);

  const handleAddNewVector = () => {
    let newVector = {
      points: [300, 300, 300, 200],
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
    setLengthVal(distance);
    let sv = selectedVec;
    sv.length = distance;
    setSelectedVec(sv);
  }

  const updateVectornAngle = (angleDegrees) => {
    setAngleVal(angleDegrees);
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


  // Input changes
  const handleLengthInputChange = (event) => {
    let val = parseFloat(event.target.value);
    setLengthVal(val);

    let index = vectors.findIndex(v => v.text === selectedVec.text);
    let newVectorArr = [...vectors];
    let points = newVectorArr[index].points;

    let newArrowPoints = calculateEndpoint(points[0], points[1], val*gridCount, selectedVec.degree)
    
    newVectorArr[index] = {
      ...newVectorArr[index],
      points: [points[0], points[1], ...newArrowPoints]
    };

    setVectors(newVectorArr);
  }
  
  const calculateEndpoint = (x1, y1, length, angle) => {
    let radians = degreeToRadian(angle);

    let newX = x1 + (length * Math.cos(radians));
    let newY = y1 - (length * Math.sin(radians));

    return [newX, newY];
  }

  const handleDegreeInputChange = (event) => {
    let val = parseFloat(event.target.value);
    setAngleVal(val); // in degree

    let index = vectors.findIndex(v => v.text === selectedVec.text);
    let newVectorArr = [...vectors];
    let points = newVectorArr[index].points;

    let newArrowPoints = calculateEndpoint(points[0], points[1], lengthVal*gridCount, val)
    
    newVectorArr[index] = {
      ...newVectorArr[index],
      points: [points[0], points[1], ...newArrowPoints]
    };
    setVectors(newVectorArr);
  }



  return (
    <div
      className='main-container'
    >
      {/* Settings to control */}
      <div className='settings-container'>
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
              onChange={() => {
                setShowComponents(!showComponents);
                setShowComponents2(false);
              }}
            />
          </div>
          <div>
            <label htmlFor='components'>Show Components (From Origin)</label>
            <input type="checkbox" name='components2' id="components2" checked={showComponents2}
              onChange={() => {
                setShowComponents2(!showComponents2);
                setShowComponents(false);
              }}
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
        visibility: selectedVec ? 'visible' : 'hidden',
      }}>
        <div className='card' >
          <span className='card-title'>|{selectedVec?.text}|:</span>
          <span className='card-input'>
            <input type="number" name='length' step={0.1} id='length' onChange={handleLengthInputChange} value={lengthVal} />
          </span>
        </div>
        <div className='card'>
          <span className='card-title'>θ:</span>
          <span className='card-input'>
            <input type="number" name='degree' step={10} id='degree' onChange={handleDegreeInputChange} value={angleVal} />
          </span>
        </div>
        <div className='card' style={{
          display: showComponents && showValues ? 'block' : 'none'
        }}>
          <span className='card-title'>{selectedVec?.text}(x):</span>
          <span className='card-input'>
            <input type="number" disabled name='x' id='x' onChange={() => { }} value={selectedVec?.xLength} />
          </span>
        </div>
        <div className='card' style={{
          display: showComponents && showValues ? 'block' : 'none'
        }}>
          <span className='card-title'>{selectedVec?.text}(y):</span>
          <span className='card-input'>
            <input type="number" disabled name='y' id='y' onChange={() => { }} value={selectedVec?.yLength} />
          </span>
        </div>
      </div>

      <Stage width={gridSize.width} height={gridSize.height}
        style={{ border: '2px solid #d7d9d9', borderRadius: '4px', }}
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

        {vectors.map((vec, index) => {
          return <SFVectorClass
            key={index}
            index={index}
            cellSize={cellSize}
            debug={debug}
            active={vec.active}
            showAngle={showAngle}
            showComponents={showComponents}
            showComponents2={showComponents2}
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
      </Stage>
    </div>
  )
}

export default App