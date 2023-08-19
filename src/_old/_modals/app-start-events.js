/* global ipcRenderer */

document.body.addEventListener('load', () => {
  console.log('ONLOAD APPSTART MODAL');

  ipcRenderer.removeAllListeners('get_activities');
});

// Electron
ipcRenderer.on('get_activities', (event, arg) => {
  console.log('get_activities msg arrived:', arg);

  document.querySelector('#processingModal').modal('hide');
  if (!arg.activities) {
    return;
  }

  let options = '';
  for (const activity of arg.activities) {
    options += `<option value="${activity}">${activity.split('/')[1]}</option>`;
  }

  document.querySelector('#appActivities').innerHTML = options;
  document.querySelector('#appStartModal').hidden = false;
});

document.querySelector('startActivityButton').addEventListener('click', () => {
  document.querySelector('#appStartModal').hidden = true;

  ipcRenderer.send(
    'start_activity',
    document.querySelector('#appActivities').value
  );
});
