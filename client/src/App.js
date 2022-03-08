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
import { margin } from '@mui/system';
import Canvas from './components/canvas/Canvas';


function App() {
  const { t } = useTranslation();
  const listOfCategoriesEn = ['cookie', 'smartphone', 'carrot', 'broccoli', 'floor lamp', 'grass', 'moon', 'mug', 'sword', 'sun']
  const listOfCategories = [t('cookie'), t('smartphone'), t('carrot'), t('broccoli'), t('floor_lamp'), t('grass'), t('moon'), t('mug'), t('sword'), t('sun')]
  const [index, setIndex] = useState(0)
  const [response, setResponse] = useState({results: 
    {
      "0": "loading...",
      "1": "loading...",
      "2": "loading...",
      "3": "loading...",
      "4": "loading...",
      "5": "loading...",
      "6": "loading...",
      "7": "loading...",
      "8": "loading...",
      "9": "loading..."
  }});

  const [locale, setLocale] = useState('pl');
  i18n.on('languageChanged', (lng) => setLocale(i18n.language));
  const [alignment, setAlignment] = useState('pl');

  const [changeCanvasBorder, createChangeCanvasBorder] = useState(()=>()=>{})
  const [clear, createClear] = useState(()=>()=>{})
  const [preprocess, createPreprocess] = useState(()=>()=>{})

  const [isGameStarted, setIsGameStarted] = useState(false)
  const [isGameFinished, setIsGameFinished] = useState(false)

  const [isStarted, setIsStarted] = useState(true)
  const [isFinished, setIsFinished] = useState(false)

  const [data, setData] = useState([]);

  const getWord = () => { return listOfCategories[index]}
  const getWordEn = () => { return listOfCategoriesEn[index]}

  const hideStart = () => {
    setIsStarted(false)
  }

  const startRound = () => {
    if(isGameFinished) {
        setResponse({results: 
          {
            "0": "calculating ",
            "1": "calculating ",
            "2": "calculating ",
            "3": "calculating ",
            "4": "calculating ",
            "5": "calculating ",
            "6": "calculating ",
            "7": "calculating ",
            "8": "calculating ",
            "9": "calculating "
        }});

      recognise();
      var canvas = document.getElementById("my-canvas");
    
      canvas.toBlob(function(blob) {
        var file = new File([blob], getWordEn() + ".png");
        setData(oldData => [...oldData, file] )
        uploadImage(file, getWordEn());

        //const zip = zipRef.current;
        //zip.file(getWord() + ".png", blob, {base64: true}); 
      });
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
    await fetch('/api/predict', {
      method: 'POST',
      body: JSON.stringify({data: base64EncodedImage}),
      headers: { 'Content-Type': 'application/json'},
    })
    .then(response => {
        return response.json();
    })
    .then(data => {
        setResponse(data);
        return data;
    })
    .catch(error => {
        return error;
    });
  }

  const recognise = async () => {
    var batched = preprocess();
    const dataArray = batched.arraySync();
    const res = await predictNodeJS(dataArray);
  }

  const stopTimer = () => {
    setIsGameFinished(true)
    changeCanvasBorder('3px solid lightgray');
  } 

  const handleDownload = () => {
    var canvas = document.getElementById("my-canvas");
    
    canvas.toBlob(function(blob) {
      FileSaver.saveAs(blob, getWord() + ".png");
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
    var cn = "neural_" + categoryname;
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

  function DrawText(props) {
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

  function ResultsText() {
    const results = [];
    if(index != 0 && response != undefined) {
      for (let i = 0; i < 10; i++) {
        var parsed = parseFloat(response.results[i]);
        results.push(
          <p key={i}> <b>{listOfCategories[i]}:</b> {isNaN(parsed) ? response.results[i] : parsed.toFixed(2) * 100.0}%</p>
        );
      }
    }

    return(<div>{results}</div>);
  }

  function CollapsibleText(props) {
    const isFinished = props.isFinished;
    const [showResults, setShowResults] = useState(true)

    const onClick = () => {setShowResults(false);}

    if (!isFinished) {
      if (index == 0 )
        return <DrawText on={() => props.on()}/>
      return (<div>
        { showResults ?
          <div>
            <ResultsText/>
            <PlayButton style={{marginTop: '5vh'}} onClick={onClick}/>
          </div>
        : <DrawText on={() => props.on()}/> }
      </div>)
    }
    return (<div>
      { showResults ?
        <div>
          <ResultsText/>
          <PlayButton onClick={onClick}/>
        </div>
      : <FinishedText /> }
    </div>);
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
                  }}>
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
                  <Timer stop={stopTimer}/>
                </div>
                <div/>
              </div> }
              
              <div className='game-container-inner'>
                <h1>{t('draw_here')}</h1>
              </div>
              <div className='game-container-inner'>
                <div className='canvas-container' style={ !isGameFinished ? {} : { cursor: 'not-allowed', pointerEvents: 'none' }}>
                      <Canvas
                        createClear={createClear}
                        createChangeCanvasBorder={createChangeCanvasBorder}
                        createPreprocess={createPreprocess}
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
