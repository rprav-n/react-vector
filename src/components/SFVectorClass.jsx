import React, { Component } from 'react'
import { Layer, Arrow, Line, Text, Circle, Arc, Label, Tag, RegularPolygon, Group } from 'react-konva'
import { clamp, calculateDegree, degreeToRadian, radianToDegree } from '../util/utils';
import Victor from "victor";

class SFVectorClass extends Component {

    labelSize = 22;

    constructor(props) {
        super(props)

        this.degreeTextRef = React.createRef();
        this.xLengthTextRef = React.createRef();
        this.yLengthTextRef = React.createRef();

        this.state = {
            points: this.props.points,
            length: this.props.length * this.props.gridValue,
            labelPosition: { x: 0, y: 0 },
            degree: 90,
            degreeTextPosition: { x: 325, y: 261 },
            angleTrianglePos: { x: 0, y: 0 },

            xComponentLength: 0,
            xComponentLablePos: { x: 0, y: 0 },

            yComponentLength: 0,
            yComponentLablePos: { x: 0, y: 0 },
            yComponentOriginLablePos: { x: 0, y: 0 },
        }

    }

    componentDidMount() {
        let basePoints = this.calculateAndReturnBasePoints();
        this.calculateDegree(...this.state.points, ...basePoints);


        this.calculateLength(this.state.points);
        this.calculateAngleTrianglePosition(this.state.points);
        this.calculateDegreeTextPosition(this.state.points);

        let points = this.state.points;
        let xComponentPoints = [points[0], points[1], points[2], points[1]];
        let yComponentPoints = [points[2], points[1], points[2], points[3]];
        let yComponentOriginPoints = [points[0], points[1], points[0], points[3]];

        this.calculateLabelPositionFor("vector", points);
        this.calculateLabelPositionFor("x", xComponentPoints);
        this.calculateLabelPositionFor("y", yComponentPoints);
        this.calculateLabelPositionFor("y-origin", yComponentOriginPoints);

    }


    componentDidUpdate(prevProps, prevState) {
        
        if (prevProps.points !== this.props.points) {
            this.setState({
                points: this.props.points
            })
        } 

        if (prevState.points !== this.state.points) {

            let basePoints = this.calculateAndReturnBasePoints();
            this.calculateDegree(...this.state.points, ...basePoints);

            this.calculateLength(this.state.points);
            this.calculateAngleTrianglePosition(this.state.points);
            this.calculateDegreeTextPosition(this.state.points);

            let points = this.state.points;
            let xComponentPoints = [points[0], points[1], points[2], points[1]];
            let yComponentPoints = [points[2], points[1], points[2], points[3]];
            let yComponentOriginPoints = [points[0], points[1], points[0], points[3]];
            
            this.calculateComponentLength("x", xComponentPoints)
            this.calculateComponentLength("y", yComponentPoints)

            this.calculateLabelPositionFor("vector", points);
            this.calculateLabelPositionFor("x", xComponentPoints);
            this.calculateLabelPositionFor("y", yComponentPoints);
            this.calculateLabelPositionFor("y-origin", yComponentOriginPoints);
        }

        if (prevState.degree !== this.state.degree) {
            this.props.updateVectornAngle(this.state.degree.toFixed(1));
        }


        /* if (prevProps.length !== this.props.length) {
            this.props.updateVectorLength(this.props.index, (this.props.length / this.props.gridValue));
        }  */

        if (prevState.length !== this.state.length) {
            this.props.updateVectorLength(this.props.index, (this.state.length / this.props.gridValue).toFixed(1));
        }
    }

    calculatePointsBasedOnNewLength(newLength) {
        let [x1, y1, x2, y2] = this.state.points;

        let angleInRad = degreeToRadian(this.state.degree);

        let newX2 = x1 + newLength * this.props.gridValue * Math.cos(angleInRad);
        let newY2 = y1 + newLength * this.props.gridValue * Math.sin(angleInRad);

        let newPoints = [x1, y1, newX2, newY2];

        this.setState({
            points: newPoints
        })

    }

    calculateAngleTrianglePosition(dataPoints) {
        const [x1, y1, x2, y2] = dataPoints;

        const midX = (x1 + x2) / 2;
        const midY = (y1 + y2) / 2;

        const directionVector = new Victor(midX - x1, midY - y1);

        let angle = parseInt(this.state.degree, 10) < 0 ? -10 : 10;

        const perpendicularVector = directionVector.clone().rotateDeg(angle).normalize();

        const desiredLength = this.state.length < 40 ? 12 : 30;
        const x = x1 + perpendicularVector.x * desiredLength;
        const y = y1 + perpendicularVector.y * desiredLength;

        let obj = { x: x, y: y };

        this.setState({
            angleTrianglePos: obj
        })

    }

    calculateLength(dataPoints) {
        let vecA = new Victor(dataPoints[0], dataPoints[1])
        let vecB = new Victor(dataPoints[2], dataPoints[3])

        let distance = vecA.distance(vecB);
        this.setState({
            length: distance
        })
    }

    calculateDegreeTextPosition(dataPoints) {
        const [x1, y1, x2, y2] = dataPoints;

        const midX = (x1 + x2) / 2;
        const midY = (y1 + y2) / 2;

        const directionVector = new Victor(midX - x1, midY - y1);

        const degreeInt = parseInt(this.state.degree, 10);
        if (degreeInt >= 0 && degreeInt < 35) {
            this.setState({
                degreeTextPosition: { x: x1 + 30, y: y1 + 12 }
            })
            return
        } else if (degreeInt < 0 && degreeInt > -35) {
            this.setState({
                degreeTextPosition: { x: x1 + 30, y: y1 - 12 }
            })
            return
        }

        let angle = degreeInt / 1.7;
        if (this.state.length < 40) {
            angle = degreeInt / 1.5;
        }
        // let angle = degreeInt / 2;
        const perpendicularVector = directionVector.clone().rotateDeg(angle).normalize();

        const desiredLength = this.state.length < 40 ? 40 : (degreeInt < 0 ? 55 : 50);
        // console.debug("desiredLength", desiredLength)
        const x = x1 + perpendicularVector.x * desiredLength;
        const y = y1 + perpendicularVector.y * desiredLength;

        let newPos = { x: x, y: y };

        /* if (degreeInt >= 0) {
            newPos = {
                x: newPos.x - this.degreeTextRef.current.textWidth / 2,
                y: newPos.y - this.degreeTextRef.current.textHeight / 2,
            }
        } else {
            newPos = {
                x: newPos.x - this.degreeTextRef.current.textWidth / 2,
                y: newPos.y - this.degreeTextRef.current.textHeight / 2,
            }
        } */

        this.setState({
            degreeTextPosition: newPos,
        })

    }

    calculateAndReturnBasePoints = () => {
        const points = this.state.points;
        return [points[0], points[1], points[0] + (this.state.length < 40 ? 30 : 50), points[1]]
    }

    calculateDegree(x1, y1, x2, y2, x3, y3, x4, y4) {

        let vecA = new Victor(x2 - x1, y2 - y1).normalize();
        let vecB = new Victor(x4 - x3, y4 - y3).normalize();

        let angleRadians = Math.atan2(vecB.y, vecB.x) - Math.atan2(vecA.y, vecA.x);

        let angleDegrees = radianToDegree(angleRadians);

        if (angleDegrees >= 180) {
            angleDegrees -= 360;
        } else if (angleDegrees <= -180) {
            angleDegrees += 360;
        }

        this.setState({
            degree: angleDegrees
        })

    }

    calculateLabelPositionFor = (type, dataPoints) => {
        const [x1, y1, x2, y2] = dataPoints;

        const centerPoint = new Victor((x1 + x2) / 2, (y1 + y2) / 2);
        const directionVector = new Victor(x2 - x1, y2 - y1);

        let degreeInt = parseInt(this.state.degree, 10);

        let pdeg = -90;
        let desiredLength = 20; // this is the padding/spacing b/w the vector line and the label
        if (degreeInt < 0) {
            pdeg = 90
        }


        if (type === "x" || type === "y") {
            desiredLength = -10;
            if (Math.abs(degreeInt) > 90) {
                desiredLength = 10;
            }
        }

        const perpendicularVector = directionVector.clone().rotateDeg(pdeg).normalize();

        let endPoint = centerPoint.clone().add(perpendicularVector.clone().multiplyScalar(desiredLength));

        // here pointDiff is considered as the label width/2 and height/2
        let pointDiff = this.labelSize / 2;

        if (type === "x" || type === "y") {
            pointDiff = 0;
        }

        let pos = { x: endPoint.x - pointDiff, y: endPoint.y - pointDiff };


        if (type === 'vector') {
            this.setState({
                labelPosition: pos,
            })
        } else if (type === 'x') {
            let updatedPos = {...pos};
            if (this.xLengthTextRef.current) {
                updatedPos.x -= this.xLengthTextRef.current.textWidth / 2
            }
            if (this.state.degree < 0) {
                updatedPos.y -= this.xLengthTextRef.current.textHeight
            }
            
            this.setState({
                xComponentLablePos: updatedPos,
            })
        } else if (type === 'y') {

            let absDegree = Math.abs(this.state.degree);
            let updatedPos = {...pos};
            
            if (absDegree > 90 && this.yLengthTextRef.current) {
                updatedPos = {
                    x: pos.x - this.yLengthTextRef.current.textWidth,
                    y: pos.y - this.yLengthTextRef.current.textHeight / 2,
                }
            } else if (absDegree < 90 && this.yLengthTextRef.current) {
                updatedPos = {
                    x: pos.x ,
                    y: pos.y - this.yLengthTextRef.current.textHeight / 2,
                }
            }        

            this.setState({
                yComponentLablePos: updatedPos
            })
        } else if (type === 'y-origin') {

            let updatedPos = {...pos};
            if (this.yLengthTextRef.current) {
                updatedPos.x -= this.yLengthTextRef.current.textWidth / 2
            }
            if (this.state.degree < 0) {
                updatedPos.y -= this.yLengthTextRef.current.textHeight
            }

            this.setState({
                yComponentOriginLablePos: updatedPos
            })
        }


    }

    calculateComponentLength = (axis, dataPoints) => {
        const [x1, y1, x2, y2] = dataPoints;

        let vecA = new Victor(x1, y1);
        let vecB = new Victor(x2, y2);

        let componentLength = vecA.distance(vecB);

        if (axis === "x") {
            this.props.updateVectorXComponentLength((componentLength / this.props.gridValue).toFixed(2))
            this.setState({
                xComponentLength: componentLength
            })
        } else {
            this.props.updateVectorYComponentLength((componentLength / this.props.gridValue).toFixed(2))
            this.setState({
                yComponentLength: componentLength
            })
        }
    }

    modifiedPoints = (dataPoints) => {
        const [x1, y1, x2, y2] = dataPoints;

        const dx = x2 - x1;
        const dy = y2 - y1;

        let vectorLength = Math.sqrt(dx * dx + dy * dy);

        if (vectorLength === 0) {
            vectorLength = 1;
        }

        const unitDx = dx / vectorLength;
        const unitDy = dy / vectorLength;

        const newX2 = x1 + (vectorLength - 10) * unitDx;
        const newY2 = y1 + (vectorLength - 10) * unitDy;

        return [x1, y1, newX2, newY2]
    }

    getArcAngel = (isAngle) => {

        let degreeInt = this.state.degree;

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

    handleMousePointer(event, cursor) {
        const container = event.target.getStage().container();
        container.style.cursor = cursor;
    }

    handleArrowOnDrag(event, type) {

        this.props.updateActive(true)

        let target = event.target;
        let x = target.x();
        let y = target.y();

        if (this.props.snap) {
            x = Math.round(x / this.props.gridValue) * this.props.gridValue;
            y = Math.round(y / this.props.gridValue) * this.props.gridValue;
        }


        let previousPoint = [...this.props.points];
        if (type === 'end') {
            previousPoint = this.state.points;
        }

        let newPoints = [
            Math.round((previousPoint[0] + x) / this.props.gridValue) * this.props.gridValue,
            Math.round((previousPoint[1] + y) / this.props.gridValue) * this.props.gridValue,
            Math.round((previousPoint[2] + x) / this.props.gridValue) * this.props.gridValue,
            Math.round((previousPoint[3] + y) / this.props.gridValue) * this.props.gridValue,
        ];


        if (this.props.clamp) {
            newPoints = [
                clamp(newPoints[0], 0, this.props.gridWidth),
                clamp(newPoints[1], 0, this.props.gridHeight),
                clamp(newPoints[2], 0, this.props.gridWidth),
                clamp(newPoints[3], 0, this.props.gridHeight),
            ]
        }

        if (type === 'move') {
            this.handleMousePointer(event, 'all-scroll')
            this.setState({
                points: newPoints
            })
        } else {
            this.props.updatePoints(newPoints);
        }

        target.position({ x: 0, y: 0 })
    }


    handleCircleOnDrag(event, type) {
        this.props.updateActive(true)

        let target = event.target;

        let x = target.x();
        let y = target.y();

        if (this.props.snap) {
            x = Math.round(x / this.props.gridValue) * this.props.gridValue;
            y = Math.round(y / this.props.gridValue) * this.props.gridValue;
        }

        if (this.props.clamp) {
            x = clamp(x, 0, this.props.gridWidth)
            y = clamp(y, 0, this.props.gridHeight)
        }

        if (x === this.state.points[0] && y === this.state.points[1]) return;


        let previousPoint = [...this.props.points];
        if (type === 'end') {
            previousPoint = this.state.points;
        }

        let newPoints = [previousPoint[0], previousPoint[1], x, y]

        if (type === 'move') {
            this.handleMousePointer(event, 'pointer')
            this.setState({
                points: newPoints
            })
        } else {
            this.props.updatePoints(newPoints);
        }

        target.position({ x: x, y: y })
    }

    render() {

        let { points, length, xComponentLength, xComponentLablePos, yComponentLablePos, yComponentLength, yComponentOriginLablePos, degree, angleTrianglePos } = this.state;

        return (
            <Layer key={this.props.text}>

                {/* The below first group is for debugging purpose ONLY */}
                <Group visible={this.props.debug}>
                    <Line
                        points={[
                            points[0],
                            points[1],
                            this.state.degreeTextPosition.x,
                            this.state.degreeTextPosition.y
                        ]}
                        stroke={"#bb0000"}
                    />

                    <Line
                        points={[
                            points[0],
                            points[1],
                            angleTrianglePos.x,
                            angleTrianglePos.y
                        ]}
                        stroke={"green"}
                        strokeWidth={1}
                    />

                    <Line
                        points={[
                            points[0],
                            points[1],
                            xComponentLablePos.x,
                            xComponentLablePos.y
                        ]}
                        stroke={"red"}
                        strokeWidth={1}
                    />

                    <Line
                        points={[
                            points[0],
                            points[1],
                            yComponentLablePos.x,
                            yComponentLablePos.y
                        ]}
                        stroke={"blue"}
                        strokeWidth={1}
                    />
                </Group>

                {/* Main Vector Arrow = Line + Regular Polygon + Other components */}
                <Group>
                    <Line
                        points={this.modifiedPoints(points)}
                        stroke={this.props.strokeColor}
                        strokeWidth={length < 40 ? 3 : this.props.strokeWidth}
                        fill={this.props.strokeColor}
                    />

                    <RegularPolygon
                        x={points[2]}
                        y={points[3]}
                        offsetY={Math.sin(degreeToRadian(degree)) - 8}
                        sides={3}
                        radius={length < 40 ? 7 : 8}
                        scaleX={length < 40 ? 1 : 1.1}
                        scaleY={length < 40 ? 1 : 1.6}
                        rotation={((Math.atan2(points[3] - points[1], points[2] - points[0]) * 180) / Math.PI) + 90}
                        fill={this.props.strokeColor}
                    />

                    {/* Show X-Axis Components Group */}
                    <Group visible={(this.props.showComponents || this.props.showComponents2) && Math.abs(parseInt(degree, 10)) !== 90 &&  Math.abs(parseInt(degree, 10)) !== 180}>
                        <Arrow
                            points={this.modifiedPoints([points[0], points[1], points[2], points[1]])}
                            stroke={this.props.strokeColor}
                            fill={this.props.strokeColor}
                            dashEnabled
                            dash={[7, 4]}
                            strokeWidth={length < 40 ? 3 : 4}
                            pointerAtBeginning={false}
                            pointerAtEnding={false}
                        />
                        <RegularPolygon
                            x={points[2]}
                            y={points[1]}
                            offsetY={Math.sin(degreeToRadian(degree)) - 8}
                            sides={3}
                            radius={xComponentLength < 40 ? 7 : 8}
                            scaleX={xComponentLength < 40 ? 1 : 1.1}
                            scaleY={xComponentLength < 40 ? 1 : 1.6}
                            rotation={Math.abs(degree) > 90 ? -90 : 90}
                            fill={this.props.strokeColor}
                        />
                        <Label
                            visible={this.props.showValues}
                            x={xComponentLablePos.x}
                            y={xComponentLablePos.y}
                            onClick={() => this.props.updateActive(true)}
                        >
                            <Tag
                                fill={this.props.active ? "#f3f383" : "#f0f0f0"}
                                cornerRadius={4}
                                stroke={this.props.active ? "#e4e4e4" : "#ddd"}
                                strokeWidth={1}
                            />
                            <Text
                                ref={this.xLengthTextRef}
                                text={(xComponentLength / 20).toFixed(1)}
                                fill="black"
                                fontSize={21}
                                height={this.labelSize}
                                align="center"
                                fontFamily='sans'
                            />
                        </Label>
                    </Group>

                    {/* Show Y-Axis Components Group */}
                    <Group visible={this.props.showComponents && (Math.abs(degree) !== 0 && Math.abs(degree) !== 90 && Math.abs(degree) !== 180)}>
                        <Arrow
                            points={this.modifiedPoints([points[2], points[1], points[2], points[3]])}
                            stroke={this.props.strokeColor}
                            fill={this.props.strokeColor}
                            dashEnabled
                            dash={[7, 4]}
                            strokeWidth={length < 40 ? 3 : 4}
                            pointerAtBeginning={false}
                            pointerAtEnding={false}
                        />
                        <RegularPolygon
                            x={points[2]}
                            y={points[3]}
                            offsetY={Math.sin(degreeToRadian(degree)) - 8}
                            sides={3}
                            radius={yComponentLength < 40 ? 7 : 8}
                            scaleX={yComponentLength < 40 ? 1 : 1.1}
                            scaleY={yComponentLength < 40 ? 1 : 1.6}
                            rotation={degree < 0 ? 180 : 0}
                            fill={this.props.strokeColor}
                        />
                        <Label
                            visible={this.props.showValues}
                            x={yComponentLablePos.x}
                            y={yComponentLablePos.y}
                            onClick={() => this.props.updateActive(true)}
                        >
                            <Tag
                                fill={this.props.active ? "#f3f383" : "#f0f0f0"}
                                cornerRadius={4}
                                stroke={this.props.active ? "#e4e4e4" : "#ddd"}
                                strokeWidth={1}
                            />
                            <Text
                                ref={this.yLengthTextRef}
                                text={(yComponentLength / 20).toFixed(1)}
                                fill="black"
                                fontSize={21}
                                height={this.labelSize}
                                align="center"
                                fontFamily='sans'
                            />
                        </Label>
                    </Group>

                     {/* Show Y-Axis Components From Origin Point Group */}
                     <Group visible={this.props.showComponents2 && (Math.abs(degree) !== 0 && Math.abs(degree) !== 90 && Math.abs(degree) !== 180)}>
                        <Arrow
                            points={this.modifiedPoints([points[0], points[1], points[0], points[3]])}
                            stroke={this.props.strokeColor}
                            fill={this.props.strokeColor}
                            dashEnabled
                            dash={[7, 4]}
                            strokeWidth={length < 40 ? 3 : 4}
                            pointerAtBeginning={false}
                            pointerAtEnding={false}
                        />
                        <RegularPolygon
                            x={points[0]}
                            y={points[3]}
                            offsetY={Math.sin(degreeToRadian(degree)) - 8}
                            sides={3}
                            radius={yComponentLength < 40 ? 7 : 8}
                            scaleX={yComponentLength < 40 ? 1 : 1.1}
                            scaleY={yComponentLength < 40 ? 1 : 1.6}
                            rotation={degree < 0 ? 180 : 0}
                            fill={this.props.strokeColor}
                        />
                        <Label
                            visible={this.props.showValues}
                            x={yComponentOriginLablePos.x}
                            y={yComponentOriginLablePos.y}
                            onClick={() => this.props.updateActive(true)}
                        >
                            <Tag
                                fill={this.props.active ? "#f3f383" : "#f0f0f0"}
                                cornerRadius={4}
                                stroke={this.props.active ? "#e4e4e4" : "#ddd"}
                                strokeWidth={1}
                            />
                            <Text
                                ref={this.yLengthTextRef}
                                text={(yComponentLength / 20).toFixed(1)}
                                fill="black"
                                fontSize={21}
                                height={this.labelSize}
                                align="center"
                                fontFamily='sans'
                            />
                        </Label>
                    </Group>

                    {/* Degree text */}
                    <Text
                        visible={this.props.showAngle}
                        ref={this.degreeTextRef}
                        fontSize={16}
                        x={this.state.degreeTextPosition.x - (this.degreeTextRef.current ? (this.degreeTextRef.current?.textWidth / 2.5) : 0)}
                        y={this.state.degreeTextPosition.y - (this.degreeTextRef.current ? (this.degreeTextRef.current?.textHeight / 2) : 0)}
                        text={degree.toFixed(1) + "°"}
                        fill="black"
                        fontStyle='500'
                    />

                    {/* Vector text */}
                    <Label
                        x={this.state.labelPosition.x}
                        y={this.state.labelPosition.y}
                        // rotation={360 - degree}
                        onClick={() => this.props.updateActive(true)}
                    >
                        <Tag
                            fill={this.props.active ? "#f3f383" : "#f0f0f0"}
                            cornerRadius={4}
                            stroke={this.props.active ? "#e4e4e4" : "#ddd"}
                            strokeWidth={1}
                        />

                        <Text
                            text={"→\n" + this.props.text}
                            lineHeight={0.5}
                            // text='|a| = 11.2'
                            // text={"\u2299\n"}
                            fill="black"
                            fontSize={21}
                            width={this.labelSize}
                            height={this.labelSize}
                            align="center"
                            fontFamily='sans'
                        />
                    </Label>

                    {/* Angle Arc and its arrow */}
                    <Group visible={this.props.showAngle}>
                        <Arc
                            x={points[0]}
                            y={points[1]}
                            innerRadius={length < 40 ? 12 : 30}
                            outerRadius={length < 40 ? 12 : 30}
                            angle={this.getArcAngel(true)}
                            fill="transparent"
                            rotation={this.getArcAngel(false)}
                            stroke={'#333'}
                            strokeWidth={length < 40 ? 1 : 2}
                        />
                        <RegularPolygon
                            x={angleTrianglePos.x}
                            y={angleTrianglePos.y}
                            sides={3}
                            radius={length < 40 ? 5 : 6}
                            rotation={degree < 0 ? (180 - degree) : (360 - degree)}
                            fill={(degree > 15 || degree < -15) ? 'black' : 'transparent'}
                        />
                    </Group>

                    {/* Base Line */}
                    <Line
                        visible={this.props.showAngle}
                        points={this.calculateAndReturnBasePoints()}
                        offsetX={1}
                        stroke={'#000'}
                        strokeWidth={1.5}
                    />

                    {/* Below is the line and circle ie draggable */}
                    <Line
                        points={points}
                        stroke={this.props.debug ? '#ddd' : 'transparent'}
                        // stroke={'transparent'}
                        strokeWidth={20}
                        draggable
                        onMouseEnter={(event) => this.handleMousePointer(event, 'all-scroll')}
                        onMouseLeave={(event) => this.handleMousePointer(event, 'default')}
                        onDragMove={(event) => this.handleArrowOnDrag(event, 'move')}
                        onDragEnd={(event) => this.handleArrowOnDrag(event, 'end')}
                        onClick={() => this.props.updateActive(true)}
                    />
                    <Circle
                        x={points[2]}
                        y={points[3]}
                        radius={length < 40 ? 10 : 20}
                        stroke={this.props.debug ? '#666' : 'transparent'}
                        fill={this.props.debug ? '#ddd' : 'transparent'}
                        draggable
                        onMouseEnter={(event) => this.handleMousePointer(event, 'pointer')}
                        onMouseLeave={(event) => this.handleMousePointer(event, 'default')}
                        onDragMove={(event) => this.handleCircleOnDrag(event, 'move')}
                        onDragEnd={(event) => this.handleCircleOnDrag(event, 'end')}
                        onClick={() => this.props.updateActive(true)}
                    />
                </Group>

            </Layer>
        )
    }
}


export default SFVectorClass