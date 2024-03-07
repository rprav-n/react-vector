import React, { Component } from 'react';
import { Layer, Rect, Line, Group, Arrow, RegularPolygon, Text } from 'react-konva';
import { degreeToRadian, radianToDegree } from '../util/utils';

class SFGridClass extends Component {
    constructor(props) {
        super(props);

        this.state = {
            horizontalLines: [],
            verticalLines: [],

            horizontalDarkLines: [],
            verticalDarkLines: [],

            /* gridUnitSizeLabel: props.gridUnitSizeLabel,
            gridHeight: props.gridHeight,
            gridWidth: props.gridWidth,
            gridValue: props.gridValue,
            gridColor: props.gridColor,
            showGridLines: props.showGridLines,
            showDarkGridLines: props.showDarkGridLines,
            showCoordinateAxes: props.showCoordinateAxes */
        };
    }

    componentDidMount() {
        this.drawHorizontalAndVerticalLines();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.gridUnitSizeLabel !== this.props.gridUnitSizeLabel ||
            prevProps.gridHeight !== this.props.gridHeight ||
            prevProps.gridWidth !== this.props.gridWidth ||
            prevProps.gridColor !== this.props.gridColor ||
            prevProps.showDarkGridLines !== this.props.showDarkGridLines) {
            this.drawHorizontalAndVerticalLines();
        }
    }

    drawHorizontalAndVerticalLines = () => {
        let horizontalLines = [];
        let horizontalDarkLines = [];
        let darkLineDivider = 2;

        if (this.props.gridHeight < 10) {
            darkLineDivider = 4;
            if (this.props.gridHeight > 4 && this.props.gridHeight <= 6) {
                darkLineDivider = 3;
            } else if (this.props.gridHeight <= 4) {
                darkLineDivider = 2;
            }
        } else {
            darkLineDivider = 5;
        }

        // h-lines
        for (let i = Math.floor(this.props.gridHeight / 2); i <= this.props.gridHeight; i++) {
            let strokeWidth = 2;
            let strokeColor = this.props.gridColor;
            if (i % darkLineDivider === 0) {
                strokeColor = this.props.showDarkGridLines ? "#000" : this.props.gridColor
                horizontalDarkLines.push(
                    <Line
                        key={i}
                        strokeWidth={strokeWidth}
                        stroke={strokeColor}
                        points={[0, i * this.props.gridValue,
                            this.props.gridWidth * this.props.gridValue, i * this.props.gridValue]}
                    />
                )
                continue
            }
            horizontalLines.push(
                <Line
                    key={i}
                    strokeWidth={strokeWidth}
                    stroke={strokeColor}
                    points={[0, i * this.props.gridValue,
                        this.props.gridWidth * this.props.gridValue, i * this.props.gridValue]}
                />
            )
        }
        for (let i = 0; i < Math.floor(this.props.gridHeight / 2); i++) {
            let strokeWidth = 2;
            let strokeColor = this.props.gridColor;
            if (i % darkLineDivider === 0) {
                strokeColor = this.props.showDarkGridLines ? "#000" : this.props.gridColor
                 horizontalDarkLines.push(
                     <Line
                         key={i}
                         strokeWidth={strokeWidth}
                         stroke={strokeColor}
                         points={[0, i * this.props.gridValue,
                             this.props.gridWidth * this.props.gridValue, i * this.props.gridValue]}
                     />
                 )
                continue
            }
            horizontalLines.push(
                <Line
                    key={i}
                    strokeWidth={strokeWidth}
                    stroke={strokeColor}
                    points={[0, i * this.props.gridValue,
                        this.props.gridWidth * this.props.gridValue, i * this.props.gridValue]}
                />
            )
        }

        let verticalLines = [];
        let verticalDarkLines = [];
        if (this.props.gridWidth < 10) {
            darkLineDivider = 4;
            if (this.props.gridWidth > 4 && this.props.gridWidth <= 6) {
                darkLineDivider = 3;
            } else if (this.props.gridWidth <= 4) {
                darkLineDivider = 2;
            }
        } else {
            darkLineDivider = 5;
        }
        // v-lines
        for (let i = Math.floor(this.props.gridWidth / 2); i <= this.props.gridWidth; i++) {
            let strokeWidth = 2;
            let strokeColor = this.props.gridColor;
            if (i % darkLineDivider === 0) {
                strokeColor = this.props.showDarkGridLines ? "#000" : this.props.gridColor
                verticalDarkLines.push(
                    <Line
                        key={i}
                        strokeWidth={strokeWidth}
                        stroke={strokeColor}
                        points={[i * this.props.gridValue, 0,
                        i * this.props.gridValue, this.props.gridHeight * this.props.gridValue]}
                    />
                )
                continue
            }

            verticalLines.push(
                <Line
                    key={i}
                    strokeWidth={strokeWidth}
                    stroke={strokeColor}
                    points={[i * this.props.gridValue, 0,
                    i * this.props.gridValue, this.props.gridHeight * this.props.gridValue]}
                />
            )
        }
        for (let i = 0; i < Math.floor(this.props.gridWidth / 2); i++) {
            let strokeWidth = 2;
            let strokeColor = this.props.gridColor;
            if (i % darkLineDivider === 0) {
                strokeColor = this.props.showDarkGridLines ? "#000" : this.props.gridColor
                verticalDarkLines.push(
                    <Line
                        key={i}
                        strokeWidth={strokeWidth}
                        stroke={strokeColor}
                        points={[i * this.props.gridValue, 0,
                        i * this.props.gridValue, this.props.gridHeight * this.props.gridValue]}
                    />
                )
                continue
            }

            verticalLines.push(
                <Line
                    key={i}
                    strokeWidth={strokeWidth}
                    stroke={strokeColor}
                    points={[i * this.props.gridValue, 0,
                    i * this.props.gridValue, this.props.gridHeight * this.props.gridValue]}
                />
            )
        }


        this.setState({
            horizontalLines: horizontalLines,
            horizontalDarkLines: horizontalDarkLines,
            verticalLines: verticalLines,
            verticalDarkLines: verticalDarkLines,
        })

    }


    render() {
        const { gridWidth, gridHeight, gridValue, xAxisOrigin, yAxisOrigin } = this.props;

        let xLinePoints = [0, (xAxisOrigin * gridValue), (gridWidth * gridValue), (xAxisOrigin * gridValue)];
        let yLinePoints = [(yAxisOrigin * gridValue), 0, (yAxisOrigin * gridValue), gridHeight * gridValue];
        
        return (
            <Layer>
                {this.props.showGridLines ? <Group>
                    {this.state.horizontalLines}
                    {this.state.verticalLines}

                    {this.state.horizontalDarkLines}
                    {this.state.verticalDarkLines}
                </Group> : null}

                {this.props.showCoordinateAxes ? <Group>
                    {/* X-Origin */}
                    <Group>
                        <Line
                            points={xLinePoints}
                            fill={"#000"}
                            stroke={"#000"}
                            strokeWidth={3}
                            pointerAtBeginning
                        />
                        <RegularPolygon
                            x={xLinePoints[0]}
                            y={xLinePoints[1]}
                            sides={3}
                            radius={8}
                            offsetY={Math.sin(degreeToRadian(90)) - 10}
                            scaleY={1.2}
                            rotation={-90}
                            fill={"#000"}
                        />
                        <Text 
                            text='x'
                            x={xLinePoints[0]}
                            y={xLinePoints[1]}
                            fontSize={20}
                            offsetX={-10}
                            offsetY={35}
                            fontFamily='serif'
                            fontVariant='italic'
                        />
                        <RegularPolygon
                            x={xLinePoints[2]}
                            y={xLinePoints[3]}
                            sides={3}
                            offsetY={Math.sin(degreeToRadian(90)) - 10}
                            radius={8}
                            scaleY={1.2}
                            rotation={90}
                            fill={"#000"}
                        />
                        <Text 
                            text='-x'
                            x={xLinePoints[2]}
                            y={xLinePoints[3]}
                            fontSize={20}
                            offsetX={25}
                            offsetY={35}
                            fontFamily='serif'
                            fontVariant='italic'
                        />
                    </Group>
                    {/* Y-Origin */}

                    <Group>

                        <Line
                            points={yLinePoints}
                            fill={"#000"}
                            stroke={"#000"}
                            strokeWidth={3}
                        />
                        <RegularPolygon
                            x={yLinePoints[0]}
                            y={yLinePoints[1]}
                            sides={3}
                            radius={8}
                            offsetY={Math.sin(degreeToRadian(90)) - 10}
                            scaleY={1.2}
                            fill={"#000"}
                        />
                        <Text 
                            text='y'
                            x={yLinePoints[0]}
                            y={yLinePoints[1]}
                            fontSize={20}
                            offsetX={-10}
                            fontFamily='serif'
                            fontVariant='italic'
                        />
                        <RegularPolygon
                            x={yLinePoints[2]}
                            y={yLinePoints[3]}
                            sides={3}
                            offsetY={Math.sin(degreeToRadian(90)) - 10}
                            radius={8}
                            scaleY={1.2}
                            rotation={180}
                            fill={"#000"}
                        />
                        <Text 
                            text='-y'
                            x={yLinePoints[2]}
                            y={yLinePoints[3]}
                            fontSize={20}
                            offsetX={-10}
                            offsetY={25}
                            fontFamily='serif'
                            fontVariant='italic'
                        />
                    </Group>



                </Group> : null}


                <Rect
                    x={0}
                    y={0}
                    width={gridWidth * gridValue}
                    height={gridHeight * gridValue}
                    stroke={"000"}
                    strokeWidth={4}
                />
            </Layer>
        );
    }
}

export default SFGridClass;
