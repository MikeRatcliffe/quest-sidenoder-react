/* global id,ipcRenderer,remote,resizeLoc,scrollDir */

// DOM
document.body.addEventListener('load', () => {
  console.log('ONLOAD DEVICE');

  ipcRenderer.removeAllListeners('get_device_info');

  window.addEventListener('resize', resizeLoc);
  window.addEventListener('scroll', scrollDir);
});

// Electron
let timer = null;
ipcRenderer.on('get_device_info', (event, arg) => {
  clearTimeout(timer);
  if (!remote.getGlobal('adbDevice')) {
    id('deviceBatteryCharge').innerHTML = 'unknown';
    return;
  }

  timer = setTimeout(() => ipcRenderer.send('get_device_info', ''), 30000);

  console.log('get_device_info:', arg);
  const { storage, user, fw, battery, wifi, ip } = arg;
  if (storage) {
    let bg = 'success';
    const percent = +storage.percent.replace('%', '');
    if (percent > 80) {
      bg = 'warning';
    }
    if (percent > 95) {
      bg = 'danger';
    }

    id('storageDiv').innerHTML = `
      <small class="pull-left">Used: ${storage.used} of ${storage.size}(${storage.percent})</small>
      <small class="pull-right">Free: ${storage.free}</small><br/>
      <div class="progress" style="border: 1px solid #666;">
        <div class="progress-bar progress-bar-striped bg-${bg}" role="progressbar" style="width: ${storage.percent};" aria-valuenow="${percent}" aria-valuemin="0" aria-valuemax="100"></div>
      </div>`;
  } else {
    id('storageDiv').innerHTML = 'Can`t get storage status';
  }

  let batCharge = 'none';
  let batNote = '';
  let batLevel = 'XX';
  if (battery) {
    batLevel = battery.level;
    if (battery.temperature) {
      batNote = `Temperature: ${battery.temperature / 10}°C`;
    }
    if (battery.ACpowered) {
      batCharge = 'AC';
    }
    if (battery.USBpowered) {
      batCharge = 'USB';
    }
    if (battery.Wirelesspowered) {
      batCharge = 'AIR';
    }
    if (battery.Maxchargingcurrent && battery.Maxchargingvoltage) {
      const current = battery.Maxchargingcurrent / 1000000;
      const voltage = battery.Maxchargingvoltage / 1000000;
      batNote += `\nMax Current: ${current}A\nMax Voltage: ${voltage}V\nMax Power: ${
        current * voltage
      }W`;
    }
  }

  id('deviceUserName').innerHTML = (user && user.name) || '<i>Unknown</i>';
  id('deviceFwVersion').innerText = (fw && fw.version) || 'v.XX';
  id('deviceBatteryLevel').innerText = batLevel;
  id('deviceBatteryLevel').parentNode.title = batNote;
  id('deviceBatteryCharge').innerText = batCharge;
  id('deviceWifi').innerText = wifi ? 'On' : 'Off';
  id('deviceIp').innerText =
    (wifi && ip) ||
    remote.getGlobal('currentConfiguration').lastIp ||
    'X.X.X.X';
});
