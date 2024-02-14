import React, { useState, useEffect } from 'react'
import { Layer, Arrow, Line, Text, Circle, Arc, Label, Tag, Shape } from 'react-konva'
import { clamp, calculateDegree, degreeToRadian, radianToDegree } from '../util/utils';
import Victor from "victor";

/* 
    To draw a one complete vector, we need the following
        - arrow - draggable body, draggable by arrow tip
        - base line
        - text
        - angle
        - degree
*/
const SFVector = (props) => {

  const { width, height } = props.gridSize;
  const count = props.gridCount;

  // state variable
  const [points, setPoints] = useState([0, 0, 0, 0]);

  const [labelPosition, setLabelPosition] = useState({ x: 0, y: 0 });
  const [degree, setDegree] = useState(0);
  const [degreeTextPosition, setDegreeTextPosition] = useState({ x: 0, y: 0 });
  const labelSize = 22;

  useEffect(() => {
    if (props.points) {
      setPoints(props.points)
    }
  }, [props.points])

  useEffect(() => {
    let basePoints = getBasePoints();
    let degree = calculateDegree(...points, ...basePoints);
    setDegree(degree.toFixed(1))

    let newLabelPosition = getLabelPosition();
    setLabelPosition(newLabelPosition)

    let newDegreeTextPosition = getDegreeTextPosition();
    setDegreeTextPosition(newDegreeTextPosition)

  }, [points])


  const handleMousePointer = (event, cursor) => {
    const container = event.target.getStage().container();
    container.style.cursor = cursor;
  }


  const getBasePoints = () => {
    return [points[0], points[1], points[0] + 40, points[1]]
  }

  const getArcAngel = (isAngle) => {

    let degreeInt = parseInt(degree, 10);

    if (isAngle) {
      if (degreeInt < 0) {
        degreeInt = -degreeInt
      }
      return degreeInt
    } else {
      if (degreeInt < 0) {
        return 0
      }
      return -degreeInt
    }

  }

  const getLabelPosition = () => {
    const [x1, y1, x2, y2] = points;

    const centerPoint = new Victor((x1 + x2) / 2, (y1 + y2) / 2);
    const directionVector = new Victor(x2 - x1, y2 - y1);

    let degreeInt = parseInt(degree);

    let pdeg = -90;
    if (degreeInt < 0 || degreeInt === 180 || degreeInt === 0) {
      pdeg = 90
    }

    const perpendicularVector = directionVector.clone().rotateDeg(pdeg).normalize();

    const desiredLength = 20; // this is the padding/spacing b/w the vector line and the label
    const endPoint = centerPoint.clone().add(perpendicularVector.clone().multiplyScalar(desiredLength));

    // here pointDiff is considered as the label width/2 and height/2
    let pointDiff = labelSize / 2;

    return { x: endPoint.x - pointDiff, y: endPoint.y - pointDiff };
  }

  // All Arrow related functions
  const handleArrowOnDrag = (event, type) => {
    props.updateActive(true)
    let target = event.target;
    let x = target.x();
    let y = target.y();

    if (props.snap) {
      x = Math.round(x / count) * count;
      y = Math.round(y / count) * count;
    }


    let previousPoint = [...props.points];
    if (type === 'end') {
      previousPoint = points;
    }

    let newPoints = [
      previousPoint[0] + x,
      previousPoint[1] + y,
      previousPoint[2] + x,
      previousPoint[3] + y,
    ];

    if (props.clamp) {
      newPoints = [
        clamp(newPoints[0], 0, width),
        clamp(newPoints[1], 0, height),
        clamp(newPoints[2], 0, width),
        clamp(newPoints[3], 0, height),
      ]
    }

    if (type === 'move') {
      handleMousePointer(event, 'all-scroll')
      setPoints(newPoints);
    } else {
      handleMousePointer(event, 'default')
      // Update the points on the parent element ie props.points
      props.updatePoints(newPoints);
    }

    target.position({ x: 0, y: 0 })


  }


  // All circle related functions
  const handleCircleOnDrag = (event, type) => {
    props.updateActive(true)

    let target = event.target;

    let x = target.x();
    let y = target.y();

    if (props.snap) {
      x = Math.round(x / count) * count;
      y = Math.round(y / count) * count;
    }

    if (props.clamp) {
      x = clamp(x, 0, width)
      y = clamp(y, 0, height)
    }

    let previousPoint = [...props.points];
    if (type === 'end') {
      previousPoint = points;
    }

    let newPoints = [previousPoint[0], previousPoint[1], x, y]

    if (type === 'move') {
      handleMousePointer(event, 'pointer')
      setPoints(newPoints);
    } else {
      handleMousePointer(event, 'default')
      // Update the points on the parent element ie props.points
      props.updatePoints(newPoints);
    }

    target.position({ x: x, y: y })
  }

  // TODO: Calculate the degree text position
  const getDegreeTextPosition = () => {
    let x = points[0];
    let y = points[1];



    return { x: x, y: y }
  }

  // TODO: Add triangle to angle end and calculate its rotation and position

  return (
    <Layer>

    
      {/* Arrow */}
      <Arrow
        _useStrictMode
        points={points}
        stroke={props.arrowStorke}
        strokeWidth={3}
        fill={props.arrowStorke}
        draggable
        onMouseEnter={(event) => handleMousePointer(event, 'all-scroll')}
        onMouseLeave={(event) => handleMousePointer(event, 'default')}
        onDragMove={(event) => handleArrowOnDrag(event, 'move')}
        onDragEnd={(event) => handleArrowOnDrag(event, 'end')}
      />


      {/* Circle - This is the point where the student can drag the arrow by its TIP */}
      <Circle
        x={points[2]}
        y={points[3]}
        radius={12}
        // stroke={"#666"} // for debug
        // fill={"#ddd"} // for debug
        fill={"transparent"}
        draggable
        onMouseEnter={(event) => handleMousePointer(event, 'pointer')}
        onMouseLeave={(event) => handleMousePointer(event, 'default')}
        onDragMove={(event) => handleCircleOnDrag(event, 'move')}
        onDragEnd={(event) => handleCircleOnDrag(event, 'end')}
      />


      {/* Base line */}
      {props.showAngle &&
        <Line
          points={getBasePoints()}
          offsetX={1}
          stroke={'black'}
          strokeWidth={2}
        />
      }

      {/* Arc angle line */}
      {props.showAngle &&
        <Arc
          x={points[0]}
          y={points[1]}
          innerRadius={30}
          outerRadius={30}
          angle={getArcAngel(true)}
          fill="transparent"
          rotation={getArcAngel(false)}
          stroke={'#333'}
          strokeWidth={2}
        />
      }

      {/* Degree Text */}
      {props.showAngle &&
        <Text
          fontSize={14}
          x={degreeTextPosition.x}
          y={degreeTextPosition.y}
          offsetY={degree < 0 ? 15 : -5}
          text={degree + "°"}
          fill="black"
          fontStyle='500'
        />
      }

      {/* Vector letter text as Label + Tag */}
      <Label
        x={labelPosition.x}
        y={labelPosition.y}
      >
        <Tag
          fill={props.active ? "#f3f383" : "#f0f0f0"}
          cornerRadius={4}
          stroke={props.active ? "#333" : "#ddd"}
          strokeWidth={1}
        />
        <Text
          text={props.text}
          fill="black"

          fontSize={22}
          width={labelSize}
          height={labelSize}
          align="center"
          fontFamily='sans'
          fontVariant='italic'
        />
      </Label>


    </Layer>
  )
}

export default SFVector