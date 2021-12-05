import './App.css';
import { createRef, useEffect, useRef, useState, useContext } from 'react';
import Timer from "./Timer";
import PlayButton from "./PlayButton";
import SlideToggle from "react-slide-toggle";
import { CircularProgressbar } from 'react-circular-progressbar';
import FileSaver from 'file-saver';

function App() {

  const currentWord = String('generated word')

  const canvasRef = useRef(null)
  const contextRef = useRef(null)
  const timerRef = createRef()

  const [isDrawing, setIsDrawing] = useState(false)
  const [isGameStarted, setIsGameStarted] = useState(false)
  const [isGameFinished, setIsGameFinished] = useState(false)

  const [isStarted, setIsStarted] = useState(true)

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = 400;
    canvas.height = 400;
    canvas.style.width = `400px`;
    canvas.style.height = `400px`;
    canvas.style.border = '3px solid gold';
    canvas.style.backgroundColor = '#fff';
    canvas.scale = 1;

    const context = canvas.getContext("2d")
    context.scale(1,1)
    context.lineCap = "round"
    context.strokeStyle = "black"
    context.lineWidth = 10
    contextRef.current = context;
  }, [])

  const startDrawing = ({nativeEvent}) => {
    const {offsetX, offsetY} = nativeEvent;
    contextRef.current.beginPath()
    contextRef.current.moveTo(offsetX, offsetY)
    setIsDrawing(true)
  }

  const finishDrawing = () => {
    contextRef.current.closePath()
    setIsDrawing(false)
  }

  const draw = ({nativeEvent}) => {
    if(!isDrawing) {
      return
    }
    const {offsetX, offsetY} = nativeEvent;
    contextRef.current.lineTo(offsetX, offsetY)
    contextRef.current.stroke()
  }

  const clear = () => {
    contextRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
    contextRef.current.beginPath();
  }

  const hideStart = () => {
    setIsStarted(false)
  }

  const startRound = () => {
    setIsGameStarted(false)
    setIsGameFinished(false)
    clear();
  }

  const stopTimer = () => {
    setIsGameFinished(true)
  }

  const handleDownload = () => {
    var canvas = document.getElementById("my-canvas");
    canvas.toBlob(function(blob) {
      FileSaver.saveAs(blob, "image.png");
    });
  }

  return (
    <main>
      
      <SlideToggle duration={800} collapsed
      render={({ onToggle, setCollapsibleElement, progress }) => (
        <div>
          <div className="my-collapsible">
            <div className="my-collapsible__content" ref={setCollapsibleElement}>
              <div className="my-collapsible__content-inner"
              style={{
                transform: `translateY(${Math.round(20 * (-1 + progress))}px)`
              }}
              >
                <p>
                  Try and draw
                </p>
                <h1>
                    {currentWord}
                </h1>
                <p>
                  in 15 seconds
                </p>

                <PlayButton onClick={ () => { onToggle(); setIsGameStarted(true) }}/>
              </div>
            </div>
            <div style={isStarted ? {height: "100vh"} : { height: "100vh", display: 'none' }}>
              <PlayButton onClick={ () => { onToggle(); hideStart()}}/>
            </div>
          </div>

        <div class='game-container' style={ isGameStarted ? {} : {display: 'none'}}>
          { isGameStarted && <div className="parent timer__content">
            <div/>
            <div class='child inline-block-child'>
              {currentWord}
            </div>
            <div/>
            <div class='child inline-block-child'>
              <Timer stop={stopTimer} ref={timerRef}/>
            </div>
            <div/>
          </div> }

          <div class='canvas-container' style={ !isGameFinished ? {} : { cursor: 'not-allowed', pointerEvents: 'none' }}>
            <canvas id='my-canvas'
              onMouseDown={startDrawing}
              onMouseUp={finishDrawing}
              onMouseMove={draw}
              onDoubleClick={clear}
              ref={canvasRef}
            />
          </div>
          <div style={ isGameFinished ? {} : { display: 'none' }}>
            Time has finished!
            Save your work and continue.
            <button style={{color: 'gold'}} onClick={handleDownload}> Save</button> 
            <PlayButton style={{color: 'gold'}} onClick={ () => { onToggle(); startRound() }}/>
          </div>
        </div>
      </div>
      )}/>
    </main>
  );
}

export default App;
