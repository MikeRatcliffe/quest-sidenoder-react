import { useEffect, useRef } from 'react';

const { ipcRenderer } = window.require('electron');

const bold = 'color: white; font-weight: bold';

function useIpcListener(mod, channel, listener) {
  const savedHandler = useRef();
  const sender = mod.id.split('/').pop();

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

    const wrappedHandler = (event, ...rest) => {
      console.log(
        `%c${sender} %c⭠ %c"${channel}" %carg:`,
        bold,
        '',
        bold,
        '',
        ...rest
      );

      eventHandler(event, ...rest);
    };

    ipcRenderer.on(channel, wrappedHandler);

    return () => {
      ipcRenderer.removeListener(channel, wrappedHandler);
    };
  }, [channel, sender]);
}

export default useIpcListener;
