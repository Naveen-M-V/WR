import React, { createContext, useContext, useState } from 'react';

const FloatingButtonContext = createContext();

export const FloatingButtonProvider = ({ children }) => {
  const [activeButton, setActiveButton] = useState(null); // 'video', 'newsletter', or null

  const openVideo = () => setActiveButton('video');
  const openNewsletter = () => setActiveButton('newsletter');
  const closeAll = () => setActiveButton(null);

  return (
    <FloatingButtonContext.Provider value={{ activeButton, openVideo, openNewsletter, closeAll }}>
      {children}
    </FloatingButtonContext.Provider>
  );
};

export const useFloatingButton = () => {
  const context = useContext(FloatingButtonContext);
  if (!context) {
    throw new Error('useFloatingButton must be used within FloatingButtonProvider');
  }
  return context;
};
