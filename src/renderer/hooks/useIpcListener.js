import { useEffect, useRef } from 'react';

const { ipcRenderer } = window.require('electron');

const useIpcListener = (channel, listener) => {
  const savedHandler = useRef();

  useEffect(() => {
    savedHandler.current = listener;
  }, [listener]);

  useEffect(() => {
    if (!ipcRenderer) {
      throw new Error('This hook can only be used in the Renderer process');
    }
    const eventHandler = (event, ...rest) => {
      return savedHandler.current(event, ...rest);
    };

    ipcRenderer.on(channel, eventHandler);

    return () => {
      ipcRenderer.removeListener(channel, eventHandler);
    };
  }, [channel]);
};

export default useIpcListener;
