import './App.css';
import { createRef, useEffect, useRef, useState, useContext } from 'react';
import Timer from "./Timer";
import PlayButton from "./PlayButton";
import SlideToggle from "react-slide-toggle";
import { CircularProgressbar } from 'react-circular-progressbar';
import FileSaver from 'file-saver';

function App() {

  const listOfCategories = ['cookie', 'smartphone', 'carrot', 'broccoli', 'floor lamp', 'grass', 'moon', 'mug', 'sword', 'sun']
  const [index, setIndex] = useState(0)

  const canvasRef = useRef(null)
  const contextRef = useRef(null)
  const timerRef = createRef()

  const [isDrawing, setIsDrawing] = useState(false)
  const [isGameStarted, setIsGameStarted] = useState(false)
  const [isGameFinished, setIsGameFinished] = useState(false)

  const [isStarted, setIsStarted] = useState(true)
  const [isFinished, setIsFinished] = useState(false)

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

  const getWord = () => { return listOfCategories[index]}

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
    if(isGameFinished) {
      var i = index;
      setIndex(i + 1)
    }
    if(index == 9) {
      setIsFinished(true)
    }

    setIsGameStarted(false)
    setIsGameFinished(false)
    changeCanvasBorder('3px solid gold');
    clear();

  }

  const stopTimer = () => {
    setIsGameFinished(true)
    changeCanvasBorder('3px solid lightgray');
  }

  const handleDownload = () => {
    var canvas = document.getElementById("my-canvas");
    canvas.toBlob(function(blob) {
      FileSaver.saveAs(blob, getWord + ".png");
    });
  }

  const changeCanvasBorder = (style) => {
    const canvas = canvasRef.current;
    canvas.style.border = style;
  }

  const Emoji = props => (
    <span
      className="emoji"
      role="img"
      aria-label={props.label ? props.label : ""}
      aria-hidden={props.label ? "false" : "true"}
    >
      {props.symbol}
    </span>
  )

  function DrawText(props) {
    console.log("draw");
    return (<div>
      <p>Try and draw</p>
      <h1>{getWord()}</h1>
      <p style={{marginBottom: '5vh'}}>in 15 seconds</p>
      <PlayButton onClick={ () => { props.on(); setIsGameStarted(true) }}/>
    </div>);
  }
  
  function FinishedText(props) {
    console.log("finished");
    let url = "https://drive.google.com/drive/folders/1EDM_9kNhp_OL_SH8GiF8XVE2j_hH2Qjm?usp=sharing";
    return (<div>
      <p>{`
      To wszystko!
      
      Zapisane obrazki mozesz przeslac mi na discordzie (Supernova#6608)
      lub wrzucić do tego dysku Google:`}</p> <a href={url}> klik </a> <p style={{marginBottom: '5vh'}}>{`

      Za około miesiąc powinna zaś powstać nowa wersja tego oto frontu - juz w formie zabawy z siecia neuronowa. ;)

      `}</p>
      <p><b>{`Dziękuję za pomoc! `}</b><Emoji symbol="💛"/></p> 
      <p style={{marginBottom: '5vh'}}>{`Jezeli chcesz zagrac ponownie - kliknij przycisk.`}</p>
      <PlayButton onClick={ () => window.location.reload(true) }/>
    </div>);
  }

  function CollapsibleText(props) {
    const isFinished = props.isFinished;
    if (!isFinished) {
      return <DrawText on={() => props.on()}/>
    }
    return <FinishedText />;
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
                <CollapsibleText isFinished={isFinished} on={() => onToggle()}/>
              </div>
            </div>
            <div style={isStarted ? {height: "100vh"} : { height: "100vh", display: 'none' }}>
              
              <div className="welcome">
              <p><b>{`Hej! `}</b><Emoji symbol="👋"/></p> 
              <p style={{marginBottom: '5vh'}}>{`
                Skoro tutaj jesteś, zdecydował*ś się pomóc mi w pracy inzynierskiej. Dziękuję! :)

                Celem mojej pracy jest odtworzenie gry Quick, Draw!, którą stworzyło Google. Będę tworzyć sieć neurnonową, czyli AI, które spróbuje rozpoznać, czy narysowano obrazek zgodny z wylosowanym tematem. Ale bazę danych zbieram sama - i dlatego właśnie potrzebuję pomocy!

                Ta strona jest stworzona właśnie po to - twoim zadaniem będzie dziesięć razy w przeciągu 15 sekund narysować otrzymane hasło, zapisać je lokalnie na komputerze, a potem mi je przesłać. Zabawa na razie na tym się kończy - ale za to za miesiąc powinnam zarzucić stroną, na której po kazdym rysunku sieć będzie próbowała go odgadnąć, a do nauczenia jej tego uzyte były obrazki was wszystkich!
                
                Gotów?
                `}</p>
                <PlayButton onClick={ () => { onToggle(); hideStart(); startRound()}}/>
              </div>
            </div>
          </div>

        <div className='game-container' style={ isGameStarted ? {} : {display: 'none'}}>
          { isGameStarted && <div className="parent timer__content">
            <div/>
            <div className='child inline-block-child'>
              <h1>{getWord()}</h1>
            </div>
            <div/>
            <div className='child inline-block-child'>
              <Timer stop={stopTimer} ref={timerRef}/>
            </div>
            <div/>
          </div> }
          
          <div className='game-container-inner'>
            <h1>Draw here!</h1>
          </div>
          <div className='game-container-inner'>
            <div className='canvas-container' style={ !isGameFinished ? {} : { cursor: 'not-allowed', pointerEvents: 'none' }}>
              <canvas id='my-canvas'
                onMouseDown={startDrawing}
                onMouseUp={finishDrawing}
                onMouseMove={draw}
                onDoubleClick={clear}
                ref={canvasRef}
              />
            </div>
          </div>
            <div style={ isGameFinished ? {} : { display: 'none' }}>
              <div className='game-container-inner'>
                <p>{`Time's up'!
                Save your work and continue`}</p>
              </div>
              <div className='game-container-inner'>
                <button style={{color: 'gold'}} onClick={handleDownload}> Save</button> 
              </div>
              <div className='game-container-inner'>
                <PlayButton style={{color: 'gold', width: 60, height: 60}} onClick={ () => { onToggle(); startRound() }}/>
              </div>
            </div>
        </div>

      </div>
      )}/>
    </main>
  );
}

export default App;
