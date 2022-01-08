import './App.css';
import { createRef, useEffect, useRef, useState, useContext, Suspense } from 'react';
import Timer from "./components/Timer";
import Loading from './components/Loading';
import PlayButton from "./components/PlayButton";
import Emoji from "./components/Emoji";
import SlideToggle from "react-slide-toggle";
import { CircularProgressbar } from 'react-circular-progressbar';
import FileSaver from 'file-saver';
import update from 'immutability-helper';
import JSZip from 'jszip';
import Axios from 'axios';
import i18n from './i18n';
import { useTranslation } from "react-i18next";
import { t } from 'i18next';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import { makeStyles } from '@mui/styles';
import LocaleContext from './LocaleContext';
import * as tf from "@tensorflow/tfjs"; 


function App() {
  const { t } = useTranslation();
  const listOfCategoriesEn = ['cookie', 'smartphone', 'carrot', 'broccoli', 'floor lamp', 'grass', 'moon', 'mug', 'sword', 'sun']
  const listOfCategories = [t('cookie'), t('smartphone'), t('carrot'), t('broccoli'), t('floor_lamp'), t('grass'), t('moon'), t('mug'), t('sword'), t('sun')]
  const [index, setIndex] = useState(0)

  const [locale, setLocale] = useState('pl');
  i18n.on('languageChanged', (lng) => setLocale(i18n.language));
  const [alignment, setAlignment] = useState('pl');

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
  const getWordEn = () => { return listOfCategoriesEn[index]}

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
        var file = new File([blob], getWordEn() + ".png");
        setData(oldData => [...oldData, file] )
        uploadImage(file, getWordEn());
        console.log(getWordEn());
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

  const predictNodeJS = async (base64EncodedImage) => {
    try {
      await fetch('/api/predict', {
        method: 'POST',
        body: JSON.stringify({data: base64EncodedImage}),
        headers: { 'Content-Type': 'application/json'},
      });
    } catch (error) {
      console.log(error);
    }
  }

  const recognise = () => {
    const context = contextRef.current;
    var imageData = context.getImageData(0, 0, 400, 400);
    console.log(imageData);
    var tfImage = tf.browser.fromPixels(imageData, 1);
    console.log(tfImage);
    var tfResizedImage = tf.image.resizeBilinear(tfImage, [100,100]);
    console.log(tfResizedImage);
    tfResizedImage = tfResizedImage.reshape([1, 100, 100, 1]);
    console.log(tfResizedImage);
    tfResizedImage = tf.cast(tfResizedImage, 'float32');
    console.log(tfResizedImage);

    console.log(tfResizedImage.dataSync());
    predictNodeJS(tfResizedImage);
  }

  const stopTimer = () => {
    recognise();
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

  function DrawText(props) {
    console.log("draw");
    return (<div>
      <p>{t('try1_try')}</p>
      <h1>{getWord()}</h1>
      <p style={{marginBottom: '5vh'}}>{t('try2_15s')}</p>
      <PlayButton onClick={ () => { props.on(); setIsGameStarted(true) }}/>
    </div>);
  }
  
  function FinishedText(props) {
    return (<div>
      <p>{t('thats_all')}</p>
      <p><b>{t('thanks_for_help')}</b><Emoji symbol="💛"/></p> 
      <p style={{marginBottom: '5vh'}}>{t('play_again')}</p>
      <div className='game-container-inner'>
      <button className='button2' onClick={handleZipDownload}>{t('save')}</button> 
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

  function changeLocale (l) {
    i18n.changeLanguage(l);
  }

  const handleAlignment = (event, newAlignment) => {
    if (newAlignment !== null) {
      setAlignment(newAlignment);
      changeLocale(newAlignment);
    }
  };

  const useStyles = makeStyles({
    root: {
      background: 'linear-gradient(45deg, #FFD700 30%, #FFD700 90%)',
      border: 0,
      borderRadius: 3,
      boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
      color: 'white',
      marginBottom: 30
    },
  });

  const classes = useStyles();

  return (
    <main>
      <LocaleContext.Provider value={{locale, setLocale}}>
        <Suspense fallback={<Loading />}>
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
                      <ToggleButtonGroup
                        className={classes.root}
                        value={alignment}
                        exclusive
                        onChange={handleAlignment}
                      >
                        <ToggleButton value="pl">Polski</ToggleButton>
                        <ToggleButton value="en">English</ToggleButton>
                      </ToggleButtonGroup>
                      <p><b>{t('hi')}</b><Emoji symbol="👋"/></p> 
                      <p style={{marginBottom: '5vh'}}>{t('welcome')}</p>
                      <PlayButton onClick={ () => { onToggle(); hideStart(); startRound()}}/>
                    </div>
                </div>
              </div>

            <div className='game-container' style={ isGameStarted ? {} : {display: 'none'}}>
              { isGameStarted && <div className="parent timer__content">
                <div/>
                <div className='child inline-block-child'>
                  <h1>{getWord()} ({index + 1}/10)</h1>
                </div>
                <div/>
                <div className='child inline-block-child'>
                  <Timer stop={stopTimer} ref={timerRef}/>
                </div>
                <div/>
              </div> }
              
              <div className='game-container-inner'>
                <h1>{t('draw_here')}</h1>
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
                    //onDoubleClick={clear}
                    ref={canvasRef}
                  />
                </div>
              </div>
                <div style={ isGameFinished ? {} : { display: 'none' }}>
                  <div className='game-container-inner'>
                    <p>{t('times_up')}</p>
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
      </Suspense>
    </LocaleContext.Provider>
    </main>
  );
}

export default App;
