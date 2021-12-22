import PlayButton from "./PlayButton";
import { t } from 'i18next';

const DrawText = ({setIsGameStarted, getWord, on}) => {
    
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
 
export default DrawText;