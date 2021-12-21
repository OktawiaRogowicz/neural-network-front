import { t } from 'i18next';
import LanguageButtons from './LanguageButtons';
import Emoji from "./Emoji";
import PlayButton from "./PlayButton";

const Welcome = ({onToggle, hideStart, startRound}) => {
    return ( 
        <div className="welcome">
            <LanguageButtons />
            <p><b>{t('hi')}</b><Emoji symbol="👋"/></p> 
            <p style={{marginBottom: '5vh'}}>{t('welcome')}</p>
            <PlayButton onClick={ () => { onToggle(); hideStart(); startRound()}}/>
        </div>
     );
}
 
export default Welcome;