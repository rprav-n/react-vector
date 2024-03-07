import Victor from "victor";

const _gridUnitSizes = [
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
  

const clamp = (value, min, max) => {
    return Math.min(Math.max(value, min), max);
}

const degreeToRadian = (deg) => {
    return deg * (Math.PI / 180)
}

const radianToDegree = (rad) => {
    return rad * (180 / Math.PI)
}


const calculateDegree = (x1, y1, x2, y2, x3, y3, x4, y4) => {

    let vecA = new Victor(x2 - x1, y2 - y1).normalize();
    let vecB = new Victor(x4 - x3, y4 - y3).normalize();

    let angleRadians = Math.atan2(vecB.y, vecB.x) - Math.atan2(vecA.y, vecA.x);

    let angleDegrees = radianToDegree(angleRadians);

    if (angleDegrees >= 180) {
        angleDegrees -= 360;
    } else if (angleDegrees <= -180) {
        angleDegrees += 360;
    }

    return angleDegrees;
}


export { clamp, radianToDegree, degreeToRadian, calculateDegree };