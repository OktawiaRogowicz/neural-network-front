import React from "react";

const defaultValue = {
  locale: 'pl',
  setLocale: () => {} 
}

export default React.createContext(defaultValue);