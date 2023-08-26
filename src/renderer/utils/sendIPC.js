const { ipcRenderer } = window.require('electron');
window.require('source-map-support').install();

const bold = 'color: white; font-weight: bold';

async function sendIPC(mod, channel, ...args) {
  const sender = mod.id.split('/').pop();

  console.log(
    `%c${sender} %csending %c"${channel}" %cargs:`,
    bold,
    '',
    bold,
    '',
    args
  );

  ipcRenderer.send(channel, ...args);
}

export default sendIPC;
