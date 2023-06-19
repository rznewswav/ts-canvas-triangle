function isCanvasCast(c: any): c is HTMLCanvasElement {
    return 'getContext' in c
}

const c = document.getElementById("canvas");
if (!isCanvasCast(c)) throw new Error()
const {width: actualWidth, height: actualHeight} = c

type x = number
type y = number
type Vertex = [x, y]


const middle: Vertex = [actualWidth / 2, actualHeight / 2]
const marginTopRel = 0.2
const marginTop = marginTopRel * middle[1]
const scale = 1
const middleHeight = middle[0] * scale
const vertex1Origin: Vertex = [0, -middleHeight]
const vertex2Angle = 2 * Math.PI / 3
const vertex2Origin: Vertex = [
    vertex1Origin[0] * Math.cos(vertex2Angle) - vertex1Origin[1] * Math.sin(vertex2Angle),
    vertex1Origin[0] * Math.sin(vertex2Angle) + vertex1Origin[1] * Math.cos(vertex2Angle)
]
const vertex3Angle = 4 * Math.PI / 3
const vertex3Origin: Vertex = [
    vertex1Origin[0] * Math.cos(vertex3Angle) - vertex1Origin[1] * Math.sin(vertex3Angle),
    vertex1Origin[0] * Math.sin(vertex3Angle) + vertex1Origin[1] * Math.cos(vertex3Angle)
]

const vertex1: Vertex = [vertex1Origin[0] + middle[0], vertex1Origin[1] + middle[1] + marginTop]
const vertex2: Vertex = [vertex2Origin[0] + middle[0], vertex2Origin[1] + middle[1] + marginTop]
const vertex3: Vertex = [vertex3Origin[0] + middle[0], vertex3Origin[1] + middle[1] + marginTop]
const ctx = c.getContext("2d");
if (!ctx) throw new Error()
ctx.fillStyle = "#264653";
ctx.fillRect(0, 0, actualWidth, actualHeight);

const triangle = new Path2D()
triangle.moveTo(vertex1[0], vertex1[1]);
triangle.lineTo(vertex2[0], vertex2[1]);
triangle.lineTo(vertex3[0], vertex3[1]);
triangle.lineTo(vertex1[0], vertex1[1]);
triangle.closePath()
ctx.fillStyle = "#e9c46a";
ctx.fill(triangle)

function isInsideTriangle(point: Vertex): boolean {
    // from: https://stackoverflow.com/questions/2049582/how-to-determine-if-a-point-is-in-a-2d-triangle
    function triangleContains(ax: number, ay: number, bx: number, by: number, cx: number, cy: number, x: number, y: number) {

        let det = (bx - ax) * (cy - ay) - (by - ay) * (cx - ax)

        return  det * ((bx - ax) * (y - ay) - (by - ay) * (x - ax)) >= 0 &&
            det * ((cx - bx) * (y - by) - (cy - by) * (x - bx)) >= 0 &&
            det * ((ax - cx) * (y - cy) - (ay - cy) * (x - cx)) >= 0

    }

    return triangleContains(vertex1[0], vertex1[1], vertex2[0], vertex2[1], vertex3[0], vertex3[1], point[0], point[1])
}

const currentPoint: Vertex = [0, 0]
let i = 0
while(!isInsideTriangle(currentPoint)) {
    currentPoint[0] = Math.random() * actualWidth
    currentPoint[1] = Math.random() * actualHeight
    i += 1
    if (i > 500) {
        throw new Error("too many iterations")
    }
}
const startingPoint: Vertex = [...currentPoint]

ctx.beginPath();
ctx.arc(startingPoint[0]-1, startingPoint[1]-1, 2, 0, 2 * Math.PI);
ctx.fillStyle = "maroon"
ctx.fill();

const points = 100000
let currentPoints = 0

const vertices: Vertex[] = [vertex1, vertex2, vertex3]

function drawPoint() {
    if (!ctx) throw new Error()
    for (let j = 0; j < 50 * Math.random() * 150 && currentPoints < points; j++) {
        const selectedVertex = vertices[Math.floor(Math.random() * vertices.length)]
        const midpoint: Vertex = [(selectedVertex[0] + currentPoint[0]) / 2, (selectedVertex[1] + currentPoint[1]) / 2 ]
        currentPoint[0] = midpoint[0]
        currentPoint[1] = midpoint[1]
        ctx.beginPath();
        ctx.arc(currentPoint[0], currentPoint[1], 2, 0, 2 * Math.PI);
        ctx.fillStyle = "#e76f51"
        ctx.fill();
        currentPoints += 1
    }

    ctx.beginPath();
    ctx.arc(startingPoint[0]-1, startingPoint[1]-1, 2, 0, 2 * Math.PI);
    ctx.fillStyle = "maroon"
    ctx.fill();
    let counterDOM = document.getElementById("counter");
    if (counterDOM) {
        counterDOM.textContent = `Iterations: ${currentPoints} points drawn`
    }
    if (currentPoints < points) {
        requestAnimationFrame(drawPoint)
    }
}

drawPoint()
