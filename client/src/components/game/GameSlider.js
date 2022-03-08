import '../../App.css';
import { createRef, useEffect, useRef, useState, useContext, Suspense } from 'react';
import Timer from "../buttons/Timer";
import Loading from '../buttons/Loading';
import PlayButton from "../buttons/PlayButton";
import Emoji from "../buttons/Emoji";
import SlideToggle from "react-slide-toggle";
import { CircularProgressbar } from 'react-circular-progressbar';
import FileSaver from 'file-saver';
import update from 'immutability-helper';
import JSZip from 'jszip';
import Axios from 'axios';
import i18n from '../../i18n';
import { useTranslation } from "react-i18next";
import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import { makeStyles } from '@mui/styles';
import LocaleContext from '../../LocaleContext';
import * as tf from "@tensorflow/tfjs"; 
import { margin } from '@mui/system';
import DrawingCanvas from './DrawingCanvas';
import uploadImage from '../../hooks/uploadImage';
import LanguageButtons from '../buttons/LanguageButtons';
import CollapsibleText from '../text-instructions/CollapsibleText';
import {useListOfCategories, listOfCategoriesEn} from "../categoriesDetails";

function GameSlider() {

    const { t } = useTranslation()
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
  
    const [isGameStarted, setIsGameStarted] = useState(false)
    const [isGameFinished, setIsGameFinished] = useState(false)

    const [clear, createClear] = useState(()=>()=>{})
    const [changeCanvasBorder, createChangeCanvasBorder] = useState(()=>()=>{})
    const [preprocess, createPreprocess] = useState(()=>()=>{})

    const canvasRef = useRef(null);
  
    const [isStarted, setIsStarted] = useState(true)
    const [isFinished, setIsFinished] = useState(false)
  
    const [data, setData] = useState([]);
  
    const getWord = () => { return useListOfCategories[index]}
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

    const recognise = async () => {
      var batched = preprocess();
      const dataArray = batched.arraySync();
      const res = await predictNodeJS(dataArray);
    }

    const predictNodeJS = async (base64EncodedImage) => {
      console.log(base64EncodedImage);
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

    return(<SlideToggle duration={800} collapsed
        render={({ onToggle, setCollapsibleElement, progress }) => (
          <div>
            <div className="my-collapsible">
              <div className="my-collapsible__content" ref={setCollapsibleElement}>
                <div className="my-collapsible__content-inner"
                style={{
                  transform: `translateY(${Math.round(20 * (-1 + progress))}px)`
                }}>
                    <CollapsibleText isFinished={isFinished} setIsGameStarted={setIsGameStarted} 
                                     getWord={getWord} handleZipDownload={handleZipDownload}
                                     on={() => onToggle()} index={index}/>
                </div>
              </div>
              <div className="text-instructions-page" style={isStarted ? {} : {display: 'none'}}>
                  <div className="welcome">
                    <LanguageButtons/>
                    <p><b>{t('hi')}</b><Emoji symbol="👋"/></p> 
                    <p style={{marginBottom: '5vh'}}>{t('welcome')}</p>
                    <PlayButton onClick={ () => { onToggle(); hideStart(); startRound()}}/>
                  </div>
              </div>
            </div>

          <div className='game-container' style={ isGameStarted ? {} : {display: 'none'}}>
            <div className="parent timer__content">
              <div/>
              <div className='child inline-block-child'>
                <h1>{getWord()} ({index + 1}/10)</h1>
              </div>
              <div/>
              <div className='child inline-block-child'>
                <Timer stop={stopTimer}/>
              </div>
              <div/>
            </div>
            
            <div className='game-container-inner'>
              <h1>{t('draw_here')}</h1>
            </div>
            <div className='game-container-inner'>
              <div className='canvas-container' style={ !isGameFinished ? {} : { cursor: 'not-allowed', pointerEvents: 'none' }}>
                <DrawingCanvas
                  createClear={createClear}
                  createChangeCanvasBorder={createChangeCanvasBorder}
                  createPreprocess={createPreprocess}
                  ref={canvas => {canvasRef.current = canvas}}/>
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
    )

}

export default GameSlider;