import { useSelector, useDispatch } from 'react-redux';
import { Col, OverlayTrigger, Popover, Row, Table } from 'react-bootstrap';
import { useEffect, useRef } from 'react';
import {
  setModel,
  setBatCharge,
  setBatMaxCurrent,
  setBatMaxVoltage,
  setBatTemperature,
  setFw,
  setIp,
  setLevel,
  setStorage,
  setUser,
  setWifi,
  modelSelector,
  batChargeSelector,
  batMaxCurrentSelector,
  batMaxVoltageSelector,
  batTemperatureSelector,
  fwSelector,
  ipSelector,
  levelSelector,
  storageSelector,
  userSelector,
  wifiSelector,
} from '../../../../../store';
import Battery from './Battery';
import Icon from '../../../Icon';
import StorageDiv from './StorageDiv';

import _useIpcListener from '../../../../hooks/useIpcListener';
import _sendIPC from '../../../../utils/sendIPC';

const useIpcListener = _useIpcListener.bind(this, module);
const sendIPC = _sendIPC.bind(this, module);

const remote = window.require('@electron/remote');

function DeviceInfo() {
  const dispatch = useDispatch();

  const model = useSelector(modelSelector);
  const batCharge = useSelector(batChargeSelector);
  const batMaxCurrent = useSelector(batMaxCurrentSelector);
  const batMaxVoltage = useSelector(batMaxVoltageSelector);
  const batTemperature = useSelector(batTemperatureSelector);
  const fw = useSelector(fwSelector);
  const ip = useSelector(ipSelector);
  const level = useSelector(levelSelector);
  const storage = useSelector(storageSelector);
  const user = useSelector(userSelector);
  const wifi = useSelector(wifiSelector);

  const timer = useRef(null);

  useIpcListener('get_device_info', (event, deviceInfo) => {
    clearTimeout(timer.current);

    timer.current = setTimeout(
      () => sendIPC('get_device_info', 'from setTimeout'),
      30000
    );

    const {
      model: devModel,
      storage: devStorage,
      user: devUser,
      fw: devFw,
      battery,
      wifi: devWifi,
      ip: devIp,
    } = deviceInfo;

    const dev = remote.getGlobal('adbDevice');

    dispatch(setModel(devModel || 'unknown'));
    dispatch(setBatCharge(!dev && 'unknown'));
    dispatch(setStorage(devStorage));
    dispatch(setUser(devUser));
    dispatch(setFw((devFw && devFw.version) || 'v.XX'));

    if (battery) {
      const {
        ACpowered,
        Maxchargingcurrent: MaxChargingcurrent,
        Maxchargingvoltage: MaxChargingvoltage,
        temperature,
        USBpowered,
        Wirelesspowered,
      } = battery;

      dispatch(setLevel(battery.level));

      if (temperature) {
        dispatch(setBatTemperature(temperature / 10));
      }
      if (ACpowered) {
        dispatch(setBatCharge('AC'));
      }
      if (USBpowered) {
        dispatch(setBatCharge('USB'));
      }
      if (Wirelesspowered) {
        dispatch(setBatCharge('AIR'));
      }
      if (MaxChargingcurrent && MaxChargingvoltage) {
        const maxCurrent = MaxChargingcurrent / 1000000;
        const maxVoltage = MaxChargingvoltage / 1000000;

        dispatch(setBatMaxCurrent(maxCurrent));
        dispatch(setBatMaxVoltage(maxVoltage));
      }
    }

    dispatch(setWifi(devWifi ? 'On' : 'Off'));
    dispatch(
      setIp(
        (devWifi && devIp) ||
          remote.getGlobal('currentConfiguration').lastIp ||
          'X.X.X.X'
      )
    );
  });

  useEffect(() => {
    sendIPC('get_device_info', 'From useEffect');
  }, []);

  const BatteryPopover = (batTemperature || batMaxCurrent || batMaxVoltage) && (
    <Popover id="battery-tooltip">
      <Popover.Header as="h3">Battery Info</Popover.Header>
      <Popover.Body className="text-nowrap p-1">
        <Table borderless className="mb-0">
          <tbody>
            {!!batTemperature && (
              <tr>
                <th className="p-1">Temperature</th>
                <td className="p-1">{batTemperature}&#8451;</td>
              </tr>
            )}
            {!!batMaxCurrent && (
              <tr>
                <th className="p-1">Max Current</th>
                <td className="p-1">{batMaxCurrent}A</td>
              </tr>
            )}
            {!!batMaxVoltage && (
              <tr>
                <th className="p-1">Max Voltage</th>
                <td className="p-1">{batMaxVoltage}V</td>
              </tr>
            )}
            {!!batMaxCurrent && batMaxVoltage && (
              <tr>
                <th className="p-1">Max Power</th>
                <td className="p-1">{batMaxCurrent * batMaxVoltage}W</td>
              </tr>
            )}
          </tbody>
        </Table>
      </Popover.Body>
    </Popover>
  );

  return (
    <div id="device_infoDiv" className="text-nowrap">
      <Row>
        <Col className="text-nowrap">
          <Icon set="di" icon="DiHtml5DeviceAccess" /> Model: <br />
          <span id="deviceModel">{model}</span>
        </Col>
        <Col className="text-nowrap">
          <Icon set="fa" icon="FaRegUserCircle" /> User: <br />
          <small id="deviceUserName">{user || <i>Unknown</i>}</small>
        </Col>
        <Col className="text-nowrap">
          <Icon set="go" icon="GoTag" /> FW: <br />
          <span id="deviceFwVersion">{fw}</span>
        </Col>
        <OverlayTrigger
          placement="bottom-start"
          delay={{ show: 250, hide: 400 }}
          overlay={BatteryPopover}
        >
          <Col className="text-nowrap">
            <Battery level={level} chargeMethod={batCharge} />{' '}
            <span id="deviceBatteryLevel">{level}</span>
            % <br />
            <small>
              Charge: <span id="deviceBatteryCharge">{batCharge}</span>
            </small>
          </Col>
        </OverlayTrigger>
        <Col className="text-nowrap">
          <Icon set="fa" icon="FaWifi" /> <span id="deviceWifi">{wifi}</span>
          <br />
          <small>
            IP: <span id="deviceIp">{ip}</span>
          </small>
        </Col>
        <Col />
        <Col sm={5}>
          <StorageDiv storage={storage} />
        </Col>
      </Row>
    </div>
  );
}

export default DeviceInfo;
