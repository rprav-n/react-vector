import React, { useState } from 'react'
import { Stage } from "react-konva";
import SFGrid from './components/SFGrid';
import SFOrigin from './components/SFOrigin';
import SFVectorClass from './components/SFVectorClass';
import "./index.css";
import { degreeToRadian } from './util/utils';
import SFGridClass from './components/SFGridClass';

const alphabets = "abcdefghijklmnopqrstuvwxyz";

const gridUnitSizes = [
  {
    label: "Very small",
    gridValues: "20x20",
    value: 15
  },
  {
    label: "Small",
    gridValues: "10x10",
    value: 24
  },
  {
    label: "Medium",
    gridValues: "10x10",
    value: 38
  },
  {
    label: "Large",
    gridValues: "6x6",
    value: 72
  },
  {
    label: "Very large",
    gridValues: "2x2",
    value: 100
  },
];

const gridLinesColors = { dark: '#000000', medium: '#BAC4C8', light: '#D4D4D4' };

function App() {


  // Grid Settings
  const [gridUnitSizeLabel, setGridUnitSizeLabel] = useState("Small");
  const [gridHeight, setGridHeight] = useState(10);
  const [gridWidth, setGridWidth] = useState(10);
  const [gridValue, setGridValue] = useState(24);
  const [gridColor, setGridColor] = useState("#cccccc");
  const [showGridLines, setShowGridLines] = useState(true);
  const [showDarkGridLines, setShowDarkGridLines] = useState(true);
  const [showCoordinateAxes, setShowCoordinateAxes] = useState(false);
  const [xAxisOrigin, setXAxisOrigin] = useState(5);
  const [yAxisOrigin, setYAxisOrigin] = useState(5);

  const [gridSize, setGridSize] = useState({
    width: 600,
    height: 600,
  });
  const [gridCount, setGridCount] = useState(20);
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
    let originPoints = [
      (gridWidth * gridValue) / 2,
      (gridHeight * gridValue) / 2,
      (gridWidth * gridValue) / 2,
      gridValue * 2
    ]
    let newVector = {
      points: originPoints,
      active: true,
      length: 5.0,
      degree: 90,
      xLength: 0.0,
      yLength: 5.0,
      color: '#0aaafa',
      text: alphabets.charAt(vectors.length),

      //settings
      showAngle: false,
      snap: true,
      showComponents: false,
      showComponents2: false,
      showValues: false,
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

    let newArrowPoints = calculateEndpoint(points[0], points[1], val * gridCount, selectedVec.degree)

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

    let newArrowPoints = calculateEndpoint(points[0], points[1], lengthVal * gridCount, val)

    newVectorArr[index] = {
      ...newVectorArr[index],
      points: [points[0], points[1], ...newArrowPoints]
    };
    setVectors(newVectorArr);
  }

  const handleGridUnitSizeChange = (event) => {
    let val = event.target.value;
    let newGridUnitSize = gridUnitSizes.find(ele => ele.label === val);

    let newGridUnitSizeValues = newGridUnitSize.gridValues.split("x");

    setGridUnitSizeLabel(val);
    setGridHeight(parseInt(newGridUnitSizeValues[0], 10))
    setGridWidth(parseInt(newGridUnitSizeValues[1], 10))
    setGridValue(newGridUnitSize.value);
  }

  const handleGridHeightChange = (event) => {
    let val = parseInt(event.target.value, 10);
    if (val > 0) {
      setGridHeight(val);
    }

  }

  const handleGridWidtheChange = (event) => {
    let val = parseInt(event.target.value, 10);
    if (val > 0) {
      setGridWidth(val);
    }

  }

  const handleGridColorChange = (event) => {
    let val = event.target.value;
    setGridColor(val);
  }

  const handleShowGridLines = (event) => {
    let val = event.target.checked;
    if (val === false) {
      setShowDarkGridLines(false);
    }
    setShowGridLines(val);
  }

  const handleShowDarkGridLines = (event) => {
    let val = event.target.checked;
    setShowDarkGridLines(val);
  }

  const handleShowCoordAxes = (event) => {
    let val = event.target.checked;
    setShowCoordinateAxes(val);
  }

  const handleXAxisOrigin = (event) => {
    let val = parseInt(event.target.value, 10);
    setXAxisOrigin(val);
  }

  const handleYAxisOrigin = (event) => {
    let val = parseInt(event.target.value, 10);
    setYAxisOrigin(val);
  }

  return (
    <div
      className='main-container'
    >

      {/* Grid Settings */}
      <div className="grid-settings" >
        <div className='grid-settings-title'>Grid Settings</div>
        <div className='grid-setting'>
          <label htmlFor="grid-unit-size">Grid Unit Size</label>
          <select id='grid-unit-size' value={gridUnitSizeLabel} onChange={handleGridUnitSizeChange}>
            {gridUnitSizes.map(gridUnitSize => {
              return <option key={gridUnitSize.label} value={gridUnitSize.label}>{gridUnitSize.label}</option>
            })}
          </select>
        </div>
        <div className='grid-setting'>
          <div>Grid Value: </div>
          <div>{gridValue}</div>
        </div>
        <div className='grid-setting'>
          <label htmlFor="grid-height">Grid Height:</label>
          <input type="number" step={1} min={1} id='grid-height' onChange={handleGridHeightChange} value={gridHeight} />
        </div>
        <div className='grid-setting'>
          <label htmlFor="grid-width">Grid Width:</label>
          <input type="number" step={1} min={1} id='grid-width' onChange={handleGridWidtheChange} value={gridWidth} />
        </div>
        <div className='grid-setting'>
          <label htmlFor="grid-color">Grid Color:</label>
          <input type="color" id='grid-color' onChange={handleGridColorChange} value={gridColor} />
        </div>
        <div className='grid-setting'>
          <label htmlFor="show-grid-lines">Show Grid Lines:</label>
          <input type="checkbox" id='show-grid-lines' onChange={handleShowGridLines} checked={showGridLines} />
        </div>
        {showGridLines ?
          <div className='grid-setting'>
            <label htmlFor="show-dark-grid-lines">Show Dark Grid Lines:</label>
            <input type="checkbox" id='show-dark-grid-lines' onChange={handleShowDarkGridLines} checked={showDarkGridLines} />
          </div>
          : null}
        <div className='grid-setting'>
          <label htmlFor="show-coord-axes">Show Coord. Axes:</label>
          <input type="checkbox" id='show-coord-axes' onChange={handleShowCoordAxes} checked={showCoordinateAxes} />
        </div>
        {showCoordinateAxes ?
          <div className='grid-settings border'>
            <div className='grid-setting'>
              <label htmlFor="xaxisorigin">X Axis Origin</label>
              <input type="number" id='xaxisorigin' onChange={handleXAxisOrigin} value={xAxisOrigin} />
            </div>
            <div className='grid-setting'>
              <label htmlFor="yaxisorigin">Y Axis Origin</label>
              <input type="number" id='yaxisorigin' onChange={handleYAxisOrigin} value={yAxisOrigin} />
            </div>
          </div>
          : null}

        <div className='grid-setting'>
          <button onClick={handleAddNewVector}>Add New Vector</button>
          <button disabled={vectors.length === 0 || selectedVec === null || selectedVec === undefined} onClick={handleDeleteVector}>Delete Vector</button>
        </div>
      </div>

      {/* Vector Settings */}
      <div className="grid-settings" style={{
        display: vectors.length && selectedVec ? 'flex' : 'none'
      }}>
        <div className='grid-settings-title'> "{selectedVec?.text}" Vector Settings</div>
        <div className='grid-setting'>
          <label htmlFor='angle'>Show Angle</label>
          <input type="checkbox" name='angle' id="angle" checked={selectedVec?.showAngle}
            onChange={(event) => {
              let index = vectors.findIndex(v => v.active);
              if (index < 0) return;
              let newVectors = [...vectors];
              newVectors[index].showAngle = event.target.checked;
              setVectors(newVectors);
              setSelectedVec({...newVectors[index]});
            }}
          />
        </div>
        <div className='grid-setting'>
          <label htmlFor='snap'>Snap To Grid</label>
          <input type="checkbox" name='snap' id="snap" checked={selectedVec?.snap}
            onChange={(event) => {
              let index = vectors.findIndex(v => v.active);
              if (index < 0) return;
              let newVectors = [...vectors];
              newVectors[index].snap = event.target.checked;
              setVectors(newVectors);
              setSelectedVec({...newVectors[index]});
            }}
          />
        </div>
        <div className='grid-setting'>
          <label htmlFor='components'>Show Components</label>
          <input type="checkbox" name='components' id="components" checked={selectedVec?.showComponents}
            onChange={(event) => {
              let index = vectors.findIndex(v => v.active);
              if (index < 0) return;
              let newVectors = [...vectors];
              newVectors[index].showComponents = event.target.checked;
              newVectors[index].showComponents2 = false;
              setVectors(newVectors);
              setSelectedVec({...newVectors[index]});
            }}
          />
        </div>
        <div className='grid-setting'>
          <label htmlFor='components'>Show Components (From Origin)</label>
          <input type="checkbox" name='components2' id="components2" checked={selectedVec?.showComponents2}
            onChange={(event) => {
              let index = vectors.findIndex(v => v.active);
              if (index < 0) return;
              let newVectors = [...vectors];
              newVectors[index].showComponents2 = event.target.checked;
              newVectors[index].showComponents = false;
              setVectors(newVectors);
              setSelectedVec({...newVectors[index]});
            }}
          />
        </div>
        <div className='grid-setting'>
          <label htmlFor='values'>Show Values</label>
          <input type="checkbox" name='values' id="values" checked={selectedVec?.showValues}
            onChange={(event) => {
              let index = vectors.findIndex(v => v.active);
              if (index < 0) return;
              let newVectors = [...vectors];
              newVectors[index].showValues = event.target.checked;
              setVectors(newVectors);
              setSelectedVec({...newVectors[index]});
            }}
          />
        </div>
        <div className='grid-setting'>
          <label htmlFor='color'>Color: </label>
          <input type="color" name='color' id="color" value={selectedVec?.color || "#bb0000"} onChange={(e) => {
            let color = e.target.value;
            let index = vectors.findIndex(v => v.active);
            if (index < 0) return;
            let newVectorArr = [...vectors];
            newVectorArr[index].color = color;
            setVectors([...newVectorArr]);
          }} />
        </div>
        <div className='grid-setting'>
          <label htmlFor='debug'>Debug Mode</label>
          <input type="checkbox" name='debug' id="debug" checked={debug}
            onChange={() => setDebug(!debug)}
          />
        </div>
      </div>

      {/* Settings to control */}
      <div className='settings-container d-none'>
        {/* <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: '1rem' }}>
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
        </div> */}

        <div style={{
          display: 'flex',
          justifyContent: 'flex-start',
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
      {/* <div className='card-container' style={{
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
        </div> */}

      <Stage width={(gridWidth * gridValue)} height={(gridHeight * gridValue)}
        // style={{ border: '2px solid #d7d9d9', borderRadius: '4px' }}
        scaleX={1}
        scaleY={1}
      >

        <SFGridClass
          gridUnitSizeLabel={gridUnitSizeLabel}
          gridHeight={gridHeight}
          gridWidth={gridWidth}
          gridValue={gridValue}
          gridColor={gridColor}
          showGridLines={showGridLines}
          showDarkGridLines={showDarkGridLines}
          showCoordinateAxes={showCoordinateAxes}
          xAxisOrigin={xAxisOrigin}
          yAxisOrigin={yAxisOrigin}
        />
        {/* Draw the grid first */}
        {/*  {showGrid &&
            <SFGrid
              gridSize={gridSize}
              gridCount={gridCount}
              cellSize={cellSize}
            />
          } */}

        {/* Draw the x and y axis origin */}
        {/*  <SFOrigin
            gridSize={gridSize}
            gridCount={gridCount}
            snap={true}
            clamp={true}
            cellSize={cellSize}
          /> */}

        {vectors.map((vec, index) => {
          return <SFVectorClass
            key={index}
            index={index}
            cellSize={cellSize}
            debug={debug}
            active={vec.active}
            showAngle={vec.showAngle}
            showComponents={vec.showComponents}
            showComponents2={vec.showComponents2}
            showValues={vec.showValues}
            strokeColor={vec.color}
            strokeWidth={5}
            gridWidth={gridWidth * gridValue}
            gridHeight={gridHeight * gridValue}
            gridValue={gridValue}
            points={vec.points}
            length={vec.length}
            snap={vec.snap}
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