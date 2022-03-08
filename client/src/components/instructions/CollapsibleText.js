import PlayButton from "../PlayButton";
import { useState } from "react";
import Emoji from "../Emoji";
import { useTranslation } from "react-i18next";

const ResultsText = ({response, index}) => {
  const { t } = useTranslation();
  const listOfCategories = [t('cookie'), t('smartphone'), t('carrot'), t('broccoli'), t('floor_lamp'), t('grass'), t('moon'), t('mug'), t('sword'), t('sun')]
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

const FinishedText = ({handleZipDownload}) => {
  const { t } = useTranslation();
  return (  
      <div>
          <p>{t('thats_all')}</p>
          <p><b>{t('thanks_for_help')}</b><Emoji symbol="💛"/></p> 
          <p style={{marginBottom: '5vh'}}>{t('play_again')}</p>
          <div className='game-container-inner'>
              <button className='button2' onClick={handleZipDownload}>{t('save')}</button> 
          </div>
          <div className='game-container-inner'>
              <PlayButton onClick={ () => window.location.reload(true) }/>
          </div>
      </div>
  );
}

const DrawText = ({setIsGameStarted, getWord, on}) => {

  const { t } = useTranslation();

  const onClickEvent = () => {
      on()
      setIsGameStarted(true)
  }

  return ( 
      <div>
          <p>{t('try1_try')}</p>
          <h1>{getWord()}</h1>
          <p style={{marginBottom: '5vh'}}>{t('try2_15s')}</p>
          <PlayButton onClick={() => onClickEvent()}/>
      </div>
   );
}

const CollapsibleText = ({isFinished, setIsGameStarted, getWord, handleZipDownload, on, index}) => {
    const [showResults, setShowResults] = useState(true)

    const onClick = () => {setShowResults(false);}

    if (!isFinished) {
      if (index == 0 )
        return <DrawText setIsGameStarted={setIsGameStarted} getWord={getWord} on={on} />
      return (<div>
        { showResults ?
          <div>
            <ResultsText/>
            <PlayButton style={{marginTop: '5vh'}} onClick={onClick}/>
          </div>
        : <DrawText setIsGameStarted={setIsGameStarted} getWord={getWord} on={on} /> }
      </div>)
    }
    return (<div>
      { showResults ?
        <div>
          <ResultsText/>
          <PlayButton onClick={onClick}/>
        </div>
      : <FinishedText handleZipDownload={handleZipDownload} /> }
    </div>);
  }

export default CollapsibleText;