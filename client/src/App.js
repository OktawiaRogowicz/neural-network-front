import './App.css';
import { createRef, useEffect, useRef, useState, useContext } from 'react';
import Timer from "./Timer";
import PlayButton from "./PlayButton";
import SlideToggle from "react-slide-toggle";
import { CircularProgressbar } from 'react-circular-progressbar';
import FileSaver from 'file-saver';
import update from 'immutability-helper';
import JSZip from 'jszip';
import Axios from 'axios';

function App() {

  const listOfCategories = ['cookie', 'smartphone', 'carrot', 'broccoli', 'floor lamp', 'grass', 'moon', 'mug', 'sword', 'sun']
  const listOfCategoriesPolish = ['ciasteczko', 'smartfon', 'marchewka', 'brokul', 'lampa stojaca', 'trawa', 'ksiezyc', 'kubek', 'miecz', 'slonce']
  const [index, setIndex] = useState(0)

  const canvasRef = useRef(null)
  const contextRef = useRef(null)
  const timerRef = createRef()

  const [isDrawing, setIsDrawing] = useState(false)
  const [isGameStarted, setIsGameStarted] = useState(false)
  const [isGameFinished, setIsGameFinished] = useState(false)

  const [isStarted, setIsStarted] = useState(true)
  const [isFinished, setIsFinished] = useState(false)

  const [data, setData] = useState([]);
  const zipRef = useRef(null)

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

    var zip = new JSZip();
    zipRef.current = zip;
  }, [])

  const startDrawing = ({nativeEvent}) => {
    const {offsetX, offsetY} = nativeEvent;
    contextRef.current.beginPath()
    contextRef.current.moveTo(offsetX, offsetY)
    setIsDrawing(true)
  }

  const getWord = () => { return listOfCategories[index]}

  const getWordPolish = () => { return listOfCategoriesPolish[index]}

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
      var canvas = document.getElementById("my-canvas");
    
      canvas.toBlob(function(blob) {
        var file = new File([blob], getWord() + ".png");
        setData(oldData => [...oldData, file] )
        uploadImage(file, getWord());
        //const zip = zipRef.current;
        //zip.file(getWord() + ".png", blob, {base64: true}); 
      });
      console.log(data);

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
      FileSaver.saveAs(blob, getWord() + ".png");
      console.log(data);
    });
  }

  const handleZipDownload = () => {
    var zip = new JSZip();
    for (var i = 0; i < data.length; i++) {
      var f = data[i];
      zip.file(f.name, f);
  }
    zip.generateAsync({type:"blob"})
    .then(function(content) {
        FileSaver.saveAs(content, "set.zip");
    });
  }

  const uploadImage = (f, categoryname) => {
    const reader = new FileReader();
    reader.readAsDataURL(f);
    reader.onloadend = () => {
      upload(reader.result, categoryname);
    }
  }

  const upload = async (base64EncodedImage, categoryname) => {
    console.log(base64EncodedImage);
    var cn = "neural_" + categoryname;
    console.log(cn);
    try {
      await fetch('/api/upload', {
        method: 'POST',
        body: JSON.stringify({data: base64EncodedImage, name: cn}),
        headers: { 'Content-Type': 'application/json'},
      });
    } catch (error) {
      console.log(error);
    }
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
      <p>Spróbuj narysować</p>
      <h1>{getWord()}/{getWordPolish()}</h1>
      <p style={{marginBottom: '5vh'}}>w 15 sekund</p>
      <PlayButton onClick={ () => { props.on(); setIsGameStarted(true) }}/>
    </div>);
  }
  
  function FinishedText(props) {
    let url = "https://drive.google.com/drive/folders/1EDM_9kNhp_OL_SH8GiF8XVE2j_hH2Qjm?usp=sharing";
    return (<div>
      <p>{`
      To wszystko!
      
      Obrazki zapisują się automatycznie na stworzonym przeze mnie serwerze.
      W razie błędów i uwag, skontaktuj się ze mną na Discordzie (Supernova#6608)

      Za około miesiąc powinna zaś powstać nowa wersja tego oto frontu - juz w formie zabawy z siecia neuronowa. ;)

      `}</p>
      <p><b>{`Dziękuję za pomoc! `}</b><Emoji symbol="💛"/></p> 
      <p style={{marginBottom: '5vh'}}>{`Jezeli chcesz zagrac ponownie - kliknij przycisk. Zeby pobrac zipa/paczke swoich plikow, kliknij Save.`}</p>
      <div className='game-container-inner'>
      <button className='button2' onClick={handleZipDownload}> Save</button> 
      </div>
      <div className='game-container-inner'>
      <PlayButton onClick={ () => window.location.reload(true) }/>
      </div>
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

                Ta strona jest stworzona właśnie po to - twoim zadaniem będzie dziesięć razy w przeciągu 15 sekund narysować otrzymane hasło!
                
                Narysowane rysunki AUTOMATYCZNIE lądują na stworzonym przeze mnie serwerze i bazie danych w momencie, w którym klikasz przycisk DALEJ. SAVE istnieje, by zapisac go lokalnie - ale to jeszcze z czasow, gdy serwera nie bylo, ale na razie nie bede go usuwac. :)
                
                Zabawa na razie na rysowaniu się kończy - ale za to za miesiąc powinnam zarzucić stroną, na której po kazdym rysunku sieć będzie próbowała go odgadnąć, a do nauczenia jej tego uzyte były obrazki was wszystkich!
                
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
              <h1>{getWord()}/{getWordPolish()} ({index + 1}/10)</h1>
            </div>
            <div/>
            <div className='child inline-block-child'>
              <Timer stop={stopTimer} ref={timerRef}/>
            </div>
            <div/>
          </div> }
          
          <div className='game-container-inner'>
            <h1>Rysuj tutaj! Kliknij dwukrotnie, by wyczyscic plotno.</h1>
          </div>
          <div className='game-container-inner'>
            <div className='canvas-container' style={ !isGameFinished ? {} : { cursor: 'not-allowed', pointerEvents: 'none' }}
                onMouseUp={finishDrawing}
                onTouchEnd={finishDrawing}>
              <canvas id='my-canvas'
                onMouseDown={startDrawing}
                onTouchStart={startDrawing}
                onMouseUp={finishDrawing}
                onTouchEnd={finishDrawing}
                onMouseMove={draw}
                onTouchMove={draw}
                onDoubleClick={clear}
                ref={canvasRef}
              />
            </div>
          </div>
            <div style={ isGameFinished ? {} : { display: 'none' }}>
              <div className='game-container-inner'>
                <p>{`Czas się skończył!
                Kontynuuj (lub jezeli twój obrazek ci się wyjątkowo podoba, mozesz go równiez sobie zapisać. U mnie wyląduje na serwerze w momencie kontynuacji!)`}</p>
              </div>
              <div className='game-container-inner'>
                <button className='button1' onClick={handleDownload}> Save</button> 
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
