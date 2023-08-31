// import { setField, store } from '../../store';
import showMessageBox from './messageBox';

const { ipcRenderer } = window.require('electron');
const remote = window.require('@electron/remote');
const { shell } = remote;

// Get a snapshot of current state
// const state = store.getState();

// dispatch a selector
// store.dispatch(setField({ key: 'rcloneBinaryError', val: 'test' }));

ipcRenderer.on('notify_update', async (event, arg) => {
  console.log('notify_update msg arrived');
  showMessageBox({
    type: 'info',
    buttons: ['Download', 'Cancel'],
    title: `Update available ${arg.current} to ${arg.remote}`,
    message: `sidenoder-${arg.remote} is now available on github.`,
    detail: arg.description,
  })
    .then(({ buttonIndexClicked }) => {
      if (buttonIndexClicked === 0) {
        shell.openExternal(arg.url);
      }
      return null;
    })
    .catch(console.error);
});

let lastAlertMsg;
ipcRenderer.on('alert', (event, arg) => {
  if (arg === lastAlertMsg) {
    return;
  }

  lastAlertMsg = arg;
  setTimeout(() => {
    lastAlertMsg = false;
  }, 500);

  alert(arg);
});

ipcRenderer.on('cmd_sent', (event, arg) => {
  alert(`Command sent: \n ${arg.success}`);
});

ipcRenderer.on('ask_device', () => {
  console.log('ask_device msg arrived');

  // $id('processingModal').modal('hide');

  showMessageBox({
    type: 'info',
    title: 'Missing device',
    message: `This action cannot be performed without a device attached.`,
  });
});
