import DrawText from "./DrawText";
import FinishedText from "./FinishedText";
import ResultsText from "./ResultsText";
import PlayButton from "../buttons/PlayButton";
import { useState } from "react";

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