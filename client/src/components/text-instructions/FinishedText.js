import PlayButton from "../buttons/PlayButton";
import { useTranslation } from "react-i18next";
import Emoji from "../buttons/Emoji";

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

export default FinishedText; 