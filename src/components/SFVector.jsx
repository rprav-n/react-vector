import React, { useState, useEffect, useRef } from 'react'
import { Layer, Arrow, Line, Text, Circle, Arc, Label, Tag, RegularPolygon, Group } from 'react-konva'
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
  const [points, setPoints] = useState(props.points);
  const [length, setLength] = useState(0);
  const [labelPosition, setLabelPosition] = useState({ x: 0, y: 0 });
  const [degree, setDegree] = useState(90);
  const [degreeTextPosition, setDegreeTextPosition] = useState({ x: 0, y: 0 });
  const degreeTextRef = useRef(null);
  const [angleTrianglePos, setAngleTrianglePos] = useState({ x: 0, y: 0 });

  const labelSize = 22;

  useEffect(() => {
    let basePoints = getBasePoints();
    let degree = calculateDegree(...points, ...basePoints).toFixed(1);
    let degreeInt = parseFloat(degree);
    setDegree(degreeInt);

    let newLabelPosition = getLabelPosition();
    setLabelPosition(newLabelPosition)

    let newDegreeTextPosition = getDegreeTextPosition();

    if (props.showAngle) {
      // if (length >= 40) {
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
      // }

      let newAngleTrianglePos = getAngleTrianglePosition()
      setAngleTrianglePos(newAngleTrianglePos);

    }

    calculateAndSetMagnitude(points)

    setDegreeTextPosition(newDegreeTextPosition)

  }, [points])

  const calculateAndSetMagnitude = (dataPoints) => {
    let vecA = new Victor(dataPoints[0], dataPoints[1])
    let vecB = new Victor(dataPoints[2], dataPoints[3])

    let distance = vecA.distance(vecB)
    setLength(distance);
  }


  const handleMousePointer = (event, cursor) => {
    const container = event.target.getStage().container();
    container.style.cursor = cursor;
  }


  const getBasePoints = () => {
    return [points[0], points[1], points[0] + (length < 40 ? 30 : 50), points[1]]
  }

  const getArcAngel = (isAngle) => {

    let degreeInt = degree;

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

    let degreeInt = degree;

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
      // handleMousePointer(event, 'default')
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


    let previousPoint = [...props.points];
    if (type === 'end') {
      previousPoint = points;
    }

    let newPoints = [previousPoint[0], previousPoint[1], x, y]

    if (type === 'move') {
      handleMousePointer(event, 'pointer')
      setPoints(newPoints);
    } else {
      // handleMousePointer(event, 'default')
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

    const degreeInt = degree;
    if (degreeInt >= 0 && degreeInt < 35) {
      return { x: x1 + 30, y: y1 + 12 }
    } else if (degreeInt < 0 && degreeInt > -35) {
      return { x: x1 + 30, y: y1 - 12 }
    }

    /* let angle = degreeInt / 2;
    if (length < 40) {
      angle = degreeInt / 1.5
    } */

    let angle = degreeInt / 1.75;
    const perpendicularVector = directionVector.clone().rotateDeg(angle).normalize();

    const desiredLength = length < 40 ? 40 : 50;
    const x = x1 + perpendicularVector.x * desiredLength;
    const y = y1 + perpendicularVector.y * desiredLength;

    let obj = { x: x, y: y };

    return obj;
  }

  const getAngleTrianglePosition = () => {
    const [x1, y1, x2, y2] = points;

    const midX = (x1 + x2) / 2;
    const midY = (y1 + y2) / 2;

    const directionVector = new Victor(midX - x1, midY - y1);

    let angle = degree < 0 ? -10 : 10;
    // angle = 0;

    const perpendicularVector = directionVector.clone().rotateDeg(angle).normalize();

    const desiredLength = length < 40 ? 15 : 30;
    const x = x1 + perpendicularVector.x * desiredLength;
    const y = y1 + perpendicularVector.y * desiredLength;

    let obj = { x: x, y: y };

    return obj;
  }

  return (
    <Layer key={props.text}>

      {/* The below line is for debug for degree text at the correct position */}
      {/* <Line
        points={[
          points[0],
          points[1],
          getDegreeTextPosition().x,
          getDegreeTextPosition().y
        ]}
        stroke={"#bb0000"}
      /> */}

      {/* This below line is to debug the angle arrow */}
     {/*  <Line
        points={[
          points[0],
          points[1],
          angleTrianglePos.x,
          angleTrianglePos.y
        ]}
        stroke={"green"}
        strokeWidth={1}
      /> */}


      {/* Arc angle line */}
      {props.showAngle &&
        <Arc
          x={points[0]}
          y={points[1]}
          innerRadius={length < 40 ? 15 : 30}
          outerRadius={length < 40 ? 15 : 30}
          angle={getArcAngel(true)}
          fill="transparent"
          rotation={getArcAngel(false)}
          stroke={'#333'}
          strokeWidth={2}
        />
      }

      <Group

      >
        {/* Arrow */}
        <Arrow
          points={points}
          stroke={props.arrowStorke}
          strokeWidth={length < 40 ? 3 : 4}
          fill={props.arrowStorke}
          // pointerAtEnding={true}
        />

        {/* TODO: Custom arrow tip */}
        {/* <RegularPolygon
          x={points[2]}
          y={points[3]}
          offsetY={Math.sin(degreeToRadian(degree)) - 8}
          sides={3}
          radius={length < 40 ? 7 : 8}
          rotationDeg={((Math.atan2(points[3] - points[1], points[2] - points[0]) * 180) / Math.PI) + 90}
          fill={props.arrowStorke}
        /> */}

        
        {/* <Line
          points={[
            points[2], points[3],   // Vertex 1 (x, y)
            points[2] - 10, points[3] + 20, // Vertex 2 (x, y)
            points[2] + 10, points[3] + 20,  // Vertex 3 (x, y)
          ]}
          closed
          fill={props.arrowStorke}
        /> */}
      </Group>



      <Line
        points={points}
        stroke={props.debug ? '#ddd' : 'transparent'}
        strokeWidth={20}
        draggable
        onMouseEnter={(event) => handleMousePointer(event, 'all-scroll')}
        onMouseLeave={(event) => handleMousePointer(event, 'default')}
        onDragMove={(event) => handleArrowOnDrag(event, 'move')}
        onDragEnd={(event) => handleArrowOnDrag(event, 'end')}
      />

      {/* Show Components for x-axis */}
      {props.showComponents && parseInt(degree) !== 90 && parseInt(degree) !== -90 &&
        <Arrow
          points={[points[0], points[1], points[2], points[1]]}
          stroke={props.arrowStorke}
          fill={props.arrowStorke}
          dashEnabled
          dash={[6]}
          strokeWidth={2}
        />
      }


      {/* Show Components for y-axis */}
      {props.showComponents && degree !== 180 &&
        <Arrow
          points={[points[2], points[1], points[2], points[3]]}
          stroke={props.arrowStorke}
          fill={props.arrowStorke}
          dashEnabled
          dash={[6]}
          strokeWidth={2}
        />
      }


      {/* Base line */}
      {props.showAngle &&
        <Line
          points={getBasePoints()}
          offsetX={1}
          stroke={'#000'}
          strokeWidth={1.5}
        />
      }


      {/* Angle arrow */}
      {props.showAngle &&
        <RegularPolygon
          x={angleTrianglePos.x}
          y={angleTrianglePos.y}
          sides={3}
          radius={length < 40 ? 5 : 6}
          rotation={degree < 0 ? (180 - degree) : (360 - degree)}
          fill={(degree > 15 || degree < -15) ? 'black' : 'transparent'}
        />
      }

      {/* Degree Text */}
      {props.showAngle &&
        <Text
          ref={degreeTextRef}
          fontSize={15}
          x={degreeTextPosition.x}
          y={degreeTextPosition.y}
          text={degree.toFixed(1) + "°"}
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
          text={"→\n"+props.text}
          lineHeight={0.5}
          // text={"\u20D7\na"}
          fill="black"
          fontSize={20}
          width={labelSize}
          height={labelSize}
          align="center"
          fontFamily='sans'
          fontVariant='italic'
        />
      </Label>


      {/* Circle - This is the point where the student can drag the arrow by its TIP */}
      <Circle
        x={points[2]}
        y={points[3]}
        radius={length < 40 ? 10 : 20}
        stroke={props.debug ? '#666' : 'transparent'}
        fill={props.debug ? '#ddd' : 'transparent'}
        draggable
        onMouseEnter={(event) => handleMousePointer(event, 'pointer')}
        onMouseLeave={(event) => handleMousePointer(event, 'default')}
        onDragMove={(event) => handleCircleOnDrag(event, 'move')}
        onDragEnd={(event) => handleCircleOnDrag(event, 'end')}
      />

    </Layer>
  )
}

export default SFVector