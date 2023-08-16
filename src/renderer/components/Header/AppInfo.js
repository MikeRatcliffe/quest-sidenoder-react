import PropTypes from 'prop-types';
import { Col, Row } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import { Battery } from './Battery';

const remote = window.require('@electron/remote');
const { ipcRenderer } = window.require('electron');

function AppInfo() {
  const [storage, setStorage] = useState(null);
  const [user, setUser] = useState(null);
  const [fw, setFw] = useState(null);
  const [level, setLevel] = useState('XX');
  const [batCharge, setBatCharge] = useState('unknown');
  const [batNote, setBatNote] = useState('');
  const [wifi, setWifi] = useState('Off');
  const [ip, setIp] = useState('X.X.X.X');

  useEffect(() => {
    // eslint-disable-next-line no-floating-promise/no-floating-promise
    (async () => {
      console.log('ONLOAD APPINFO START');

      let timer = null;
      ipcRenderer.removeAllListeners('get_device_info');

      ipcRenderer.on('get_device_info', async (event, deviceInfo) => {
        clearTimeout(timer);

        timer = setTimeout(
          () => ipcRenderer.send('get_device_info', ''),
          30000,
        );

        const { storage, user, fw, battery, wifi, ip } = deviceInfo;

        const dev = remote.getGlobal('adbDevice');

        setBatCharge(!dev && 'unknown');
        setStorage(storage);
        setUser(user);
        setFw((fw && fw.version) || 'v.XX');

        if (battery) {
          const {
            ACpowered,
            Maxchargingcurrent,
            Maxchargingvoltage,
            temperature,
            USBpowered,
            Wirelesspowered,
          } = battery;

          setLevel(battery.level);

          if (temperature) {
            setBatNote(`Temperature: ${temperature / 10}°C`);
          }
          if (ACpowered) {
            setBatCharge('AC');
          }
          if (USBpowered) {
            setBatCharge('USB');
          }
          if (Wirelesspowered) {
            setBatCharge('AIR');
          }
          if (Maxchargingcurrent && Maxchargingvoltage) {
            const current = Maxchargingcurrent / 1000000;
            const voltage = Maxchargingvoltage / 1000000;
            if (temperature) {
              setBatNote(
                `Temperature: ${
                  temperature / 10
                }°C\nMax Current: ${current}A\nMax Voltage: ${voltage}V\nMax Power: ${
                  current * voltage
                }W`,
              );
            } else {
              setBatNote(
                `Max Current: ${current}A\nMax Voltage: ${voltage}V\nMax Power: ${
                  current * voltage
                }W`,
              );
            }
          }
        }

        setWifi(wifi ? 'On' : 'Off');
        setIp(
          (wifi && ip) ||
            remote.getGlobal('currentConfiguration').lastIp ||
            'X.X.X.X',
        );
      });
      ipcRenderer.send('get_device_info', '');

      console.log('ONLOAD APPINFO END');
    })();
  }, []);

  return (
    <div id="device_infoDiv">
      <Row>
        <Col sm={2}>
          <FontAwesomeIcon icon={['far', 'user-circle']} /> User: <br />
          <small id="deviceUserName">
            {(user && user.name) || <i>Unknown</i>}
          </small>
        </Col>
        <Col sm={2}>
          <FontAwesomeIcon icon="tag" /> FW: <br />
          <span id="deviceFwVersion">{fw}</span>
        </Col>
        <Col sm={2} title={batNote}>
          <Battery level={level} chargeMethod={batCharge} />{' '}
          <span id="deviceBatteryLevel">{level}</span>
          % <br />
          <small>
            Charge: <span id="deviceBatteryCharge">{batCharge}</span>
          </small>
        </Col>
        <Col sm={2}>
          <FontAwesomeIcon icon="wifi" /> <span id="deviceWifi">{wifi}</span>
          <br />
          <small>
            IP: <span id="deviceIp">{ip}</span>
          </small>
        </Col>
        <Col sm={4}>
          <StorageDiv storage={storage} />
        </Col>
      </Row>
    </div>
  );
}

function StorageDiv({ storage }) {
  if (!storage) {
    return (
      <div id="storageDiv">
        <FontAwesomeIcon icon="refresh" spin={true} /> Trying to fetch device
        storage info
      </div>
    );
  }

  if (storage) {
    const percent = +storage.percent.replace('%', '');

    let bg = 'success';
    if (percent > 80) {
      bg = 'warning';
    }
    if (percent > 95) {
      bg = 'danger';
    }

    return (
      <>
        <small className="pull-left">
          Used: {storage.used} of {storage.size}({storage.percent})
        </small>
        <small className="pull-right">Free: {storage.free}</small>
        <br />
        <div className="progress">
          <div
            className={`progress-bar progress-bar-striped bg-${bg}`}
            role="progressbar"
            style={{ width: storage.percent }}
            aria-valuenow={percent}
            aria-valuemin="0"
            aria-valuemax="100"
          ></div>
        </div>
      </>
    );
  } else {
    return 'Can`t get storage status';
  }
}

StorageDiv.propTypes = {
  storage: PropTypes.object,
};

export { AppInfo };
