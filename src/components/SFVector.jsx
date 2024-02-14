import React, { useState, useEffect, useRef } from 'react'
import { Layer, Arrow, Line, Text, Circle, Arc, Label, Tag } from 'react-konva'
import { clamp, calculateDegree } from '../util/utils';
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
  const [points, setPoints] = useState(props.points);

  const [labelPosition, setLabelPosition] = useState({ x: 0, y: 0 });
  const [degree, setDegree] = useState("90");
  const [degreeTextPosition, setDegreeTextPosition] = useState({ x: 0, y: 0 });
  const degreeTextRef = useRef(null);

  const labelSize = 22;

  useEffect(() => {
    let basePoints = getBasePoints();
    let degree = calculateDegree(...points, ...basePoints);
    setDegree(degree.toFixed(1))

    let newLabelPosition = getLabelPosition();
    setLabelPosition(newLabelPosition)

    let newDegreeTextPosition = getDegreeTextPosition();

    if (props.showAngle) {
      let degreeInt = parseInt(degree, 10);
      if (degreeInt >= 0) {
        newDegreeTextPosition = {
          x: newDegreeTextPosition.x - degreeTextRef.current.textWidth / 2.5,
          y: newDegreeTextPosition.y - degreeTextRef.current.textHeight / 2,
        }
      } else {
        newDegreeTextPosition = {
          x: newDegreeTextPosition.x - degreeTextRef.current.textWidth / 2.5,
          y: newDegreeTextPosition.y - degreeTextRef.current.textHeight / 2,
        }
      }


    }

    setDegreeTextPosition(newDegreeTextPosition)

  }, [points])


  const handleMousePointer = (event, cursor) => {
    const container = event.target.getStage().container();
    container.style.cursor = cursor;
  }


  const getBasePoints = () => {
    return [points[0], points[1], points[0] + 55, points[1]]
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
    if (degreeInt < 0) {
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

      // return if x == points[0] || y == points[1]
    }

    if (x === points[0] && y === points[1]) return;

    // console.debug("xy", x, y);

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

  const getDegreeTextPosition = () => {
    const [x1, y1, x2, y2] = points;

    const midX = (x1 + x2) / 2;
    const midY = (y1 + y2) / 2;

    const directionVector = new Victor(midX - x1, midY - y1);

    const degreeInt = parseInt(degree);
    if (degreeInt >= 0 && degreeInt < 35) {
      return { x: x1, y: y1 + 10 }
    } else if (degreeInt <= 0 && degreeInt > -35) {
      return { x: x1, y: y1 - 10 }
    }
    const angle = degreeInt / 2;
    const perpendicularVector = directionVector.clone().rotateDeg(angle).normalize();

    const desiredLength = 50;
    const x = x1 + perpendicularVector.x * desiredLength;
    const y = y1 + perpendicularVector.y * desiredLength;

    let obj = { x: x, y: y };

    return obj;
  }

  return (
    <Layer key={props.text}>

      {/* The below line is for debug for degree text at the correct position */}
      {/*  <Line 
        points={[
          points[0],
          points[1],
          getDegreeTextPosition().x,
          getDegreeTextPosition().y
        ]}
        stroke={"#bb0000"}
      /> */}

      {/* Arrow */}
      <Arrow
        points={points}
        stroke={props.arrowStorke}
        strokeWidth={4}
        fill={props.arrowStorke}
        /* draggable
        onMouseEnter={(event) => handleMousePointer(event, 'all-scroll')}
        onMouseLeave={(event) => handleMousePointer(event, 'default')}
        onDragMove={(event) => handleArrowOnDrag(event, 'move')}
        onDragEnd={(event) => handleArrowOnDrag(event, 'end')} */
      />

      <Line 
        points={points}
        stroke={props.debug ? '#ddd' :'transparent'}
        strokeWidth={20}
        draggable
        onMouseEnter={(event) => handleMousePointer(event, 'all-scroll')}
        onMouseLeave={(event) => handleMousePointer(event, 'default')}
        onDragMove={(event) => handleArrowOnDrag(event, 'move')}
        onDragEnd={(event) => handleArrowOnDrag(event, 'end')}
      />

      {/* Show Components for x-axis */}

      {props.showComponents &&
        <Arrow
          points={[points[0], points[1], points[2], points[1]]}
          stroke={props.arrowStorke}
          fill={props.arrowStorke}
          dashEnabled
          dash={[6]}
          strokeWidth={4}
        />
      }

      {/* Show Components for x-axis */}
      {props.showComponents &&
        <Arrow
          points={[points[2], points[3], points[2], points[1]]}
          stroke={props.arrowStorke}
          fill={props.arrowStorke}
          dashEnabled
          pointerAtBeginning
          pointerAtEnding={false}
          dash={[6]}
          strokeWidth={4}
        />
      }



      {/* Circle - This is the point where the student can drag the arrow by its TIP */}
      <Circle
        x={points[2]}
        y={points[3]}
        radius={20}
        stroke={props.debug ? '#666' :'transparent'} 
        fill={props.debug ? '#ddd' :'transparent'} 
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
          stroke={'#000'}
          strokeWidth={1.5}
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
          ref={degreeTextRef}
          fontSize={14}
          x={degreeTextPosition.x}
          y={degreeTextPosition.y}
          text={degree + "°"}
          fill="black"
          fontStyle='500'
        />
      }

      {/* Vector letter text as Label + Tag */}
      <Label
        x={labelPosition.x}
        y={labelPosition.y}
        onClick={() => props.updateActive(true)}
      >
        <Tag
          fill={props.active ? "#f3f383" : "#f0f0f0"}
          cornerRadius={4}
          stroke={props.active ? "#e4e4e4" : "#ddd"}
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