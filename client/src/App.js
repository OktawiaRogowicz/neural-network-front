import './App.css';
import { useState, Suspense } from 'react';
import Loading from './components/buttons/Loading';
import i18n from './i18n';
import LocaleContext from './LocaleContext';
import GameSlider from './components/game/GameSlider';


function App() {
  
  const [locale, setLocale] = useState('pl');
  i18n.on('languageChanged', (lng) => setLocale(i18n.language));

  return (
    <main>
      <LocaleContext.Provider value={{locale, setLocale}}>
        <Suspense fallback={<Loading />}>
          <GameSlider/>
      </Suspense>
    </LocaleContext.Provider>
    </main>
  );
}

export default App;
