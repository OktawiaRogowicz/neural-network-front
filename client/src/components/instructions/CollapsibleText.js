import { createRef, useEffect, useRef, useState, useContext, Suspense } from 'react';
import Timer from '../Timer';
import PlayButton from '../PlayButton';
import Emoji from '../Emoji';
import { useTranslation } from "react-i18next";

function DrawText(props) {
    const { t } = useTranslation();
    return (<div>
      <p>{t('try1_try')}</p>
      <h1>{getWord()}</h1>
      <p style={{marginBottom: '5vh'}}>{t('try2_15s')}</p>
      <PlayButton onClick={ () => { props.on(); setIsGameStarted(true) }}/>
    </div>);
  }
  
  function FinishedText(props) {
    const { t } = useTranslation();
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
    const { t } = useTranslation();
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
    const { t } = useTranslation();
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

  export default CollapsibleText;