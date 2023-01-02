import { useCallback, useEffect, useRef, useState } from 'react'
import './App.scss'

console.log('[App.tsx]', `Hello world from Electron ${process.versions.electron}!`)

function App() {
  const canvasRef = useRef(null);
  const [width, setWidth] = useState(400);
  const [height, setHeight] = useState(400);
  const [margin, setMargin] = useState(20);
  const [distance, setDistance] = useState(50);
  useEffect(() => {
    if (canvasRef.current === null) return;
    const canvas = canvasRef.current as HTMLCanvasElement;
    [canvas.width, canvas.height] = [width, height];
  }, []);

  const getRandomPoint = useCallback((): Point => {
    return {
      x: Math.round(Math.max(margin, Math.random() * Math.max(0, width - margin))),
      y: Math.round(Math.max(margin, Math.random() * Math.max(0, height - margin)))
    }
  }, [width, height]);

  const getTwoPoint = useCallback((): [Point, Point] => {
    const [begin, end] = [0, 0].map(item => getRandomPoint());
    if ((begin.x - end.x) ** 2 + (begin.y - end.y) ** 2 < distance ** 2) return getTwoPoint();
    else return [begin, end];
  }, [getRandomPoint, distance]);

  const drawImage = useCallback(() => {
    if (canvasRef.current === null) return;
    const canvas = canvasRef.current as HTMLCanvasElement;
    [canvas.width, canvas.height] = [width, height];
    const context = canvas.getContext("2d");
    if (context === null) return;
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, width, height);
    const [begin, end] = getTwoPoint();
    context.beginPath();
    context.moveTo(begin.x, begin.y);
    context.closePath();
    context.lineWidth = 5;
    context.lineCap = 'round';
    context.strokeStyle = "black";
    context.lineTo(end.x, end.y);
    context.stroke();
  }, [width, height, getTwoPoint]);

  return (
    <div className="App">
      <div className="title">canvas</div>
      <div className="container">
        <canvas ref={canvasRef}></canvas>
      </div>
      <button onClick={drawImage}>new image</button>
    </div>
  )
}

export default App
