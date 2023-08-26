const { ipcRenderer } = window.require('electron');

const bold = 'color: white; font-weight: bold';

async function sendIPC(mod, channel, ...args) {
  const sender = mod.id.split('/').pop();

  console.log(
    `%c${sender} %c⭢ %c"${channel}" %cargs:`,
    bold,
    '',
    bold,
    '',
    args
  );

  ipcRenderer.send(channel, ...args);
}

export default sendIPC;
