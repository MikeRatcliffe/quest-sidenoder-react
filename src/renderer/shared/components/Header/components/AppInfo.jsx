import { Col, Row } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import Battery from './Battery';
import Icon from '../../../Icon';
import StorageDiv from './StorageDiv';
import useIpcListener from '../../../../hooks/useIpcListener';

import _sendIPC from '../../../../utils/sendIPC';
const sendIPC = _sendIPC.bind(this, module);

const remote = window.require('@electron/remote');

function AppInfo() {
  const [storage, setStorage] = useState(null);
  const [user, setUser] = useState(null);
  const [fw, setFw] = useState(null);
  const [level, setLevel] = useState('XX');
  const [batCharge, setBatCharge] = useState('unknown');
  const [batNote, setBatNote] = useState('');
  const [wifi, setWifi] = useState('Off');
  const [ip, setIp] = useState('X.X.X.X');

  let timer = null;
  useIpcListener('get_device_info', (event, deviceInfo) => {
    clearTimeout(timer);

    timer = setTimeout(() => sendIPC('get_device_info', ''), 30000);

    const {
      storage: devStorage,
      user: devUser,
      fw: devFw,
      battery,
      wifi: devWifi,
      ip: devIp,
    } = deviceInfo;

    const dev = remote.getGlobal('adbDevice');

    setBatCharge(!dev && 'unknown');
    setStorage(devStorage);
    setUser(devUser);
    setFw((devFw && devFw.version) || 'v.XX');

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
            }W`
          );
        } else {
          setBatNote(
            `Max Current: ${current}A\nMax Voltage: ${voltage}V\nMax Power: ${
              current * voltage
            }W`
          );
        }
      }
    }

    setWifi(devWifi ? 'On' : 'Off');
    setIp(
      (devWifi && devIp) ||
        remote.getGlobal('currentConfiguration').lastIp ||
        'X.X.X.X'
    );
  });

  useEffect(() => {
    sendIPC('get_device_info', '');
  }, []);

  return (
    <div id="device_infoDiv">
      <Row>
        <Col sm={2}>
          <Icon set="fa" icon="FaRegUserCircle" /> User: <br />
          <small id="deviceUserName">
            {(user && user.name) || <i>Unknown</i>}
          </small>
        </Col>
        <Col sm={2}>
          <Icon set="fa6" icon="FaTag" /> FW: <br />
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
          <Icon set="fa" icon="FaWifi" /> <span id="deviceWifi">{wifi}</span>
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

export default AppInfo;
