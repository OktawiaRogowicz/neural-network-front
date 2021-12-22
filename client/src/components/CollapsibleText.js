import DrawText from "./DrawText";
import FinishedText from "./FinishedText";

const CollapsibleText = ({isFinished, setIsGameStarted, getWord, handleZipDownload, on}) => {

    if (!isFinished) {
      return <DrawText setIsGameStarted={setIsGameStarted} getWord={getWord} on={on} />
    }
    return <FinishedText handleZipDownload={handleZipDownload} />;
}
 
export default CollapsibleText;