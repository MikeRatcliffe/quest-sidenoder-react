import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Container } from 'react-bootstrap';
import {
  setDevicePending,
  setDeviceConnected,
  setDeviceError,
  setMountPending,
  setMountConnected,
  setMountError,
  setWirelessPending,
  setWirelessConnected,
  setWirelessError,
  devicePendingSelector,
  deviceConnectedSelector,
  deviceErrorSelector,
  mountPendingSelector,
  mountConnectedSelector,
  mountErrorSelector,
  wirelessPendingSelector,
  wirelessConnectedSelector,
  wirelessErrorSelector,
} from '../../../../../store';
import showMessageBox from '../../../../utils/messageBox.js';
import Icon from '../../../Icon';

import _useIpcListener from '../../../../hooks/useIpcListener';
import _sendIPC from '../../../../utils/sendIPC';

const useIpcListener = _useIpcListener.bind(this, module);
const sendIPC = _sendIPC.bind(this, module);

function DeviceButtons() {
  const dispatch = useDispatch();

  const deviceConnected = useSelector(deviceConnectedSelector);
  const devicePending = useSelector(devicePendingSelector);
  const deviceError = useSelector(deviceErrorSelector);

  const mountConnected = useSelector(mountConnectedSelector);
  const mountPending = useSelector(mountPendingSelector);
  const mountError = useSelector(mountErrorSelector);

  const wirelessConnected = useSelector(wirelessConnectedSelector);
  const wirelessPending = useSelector(wirelessPendingSelector);
  const wirelessError = useSelector(wirelessErrorSelector);

  useEffect(() => {
    if (mountError) {
      showMessageBox({
        type: 'error',
        title: 'Rclone Mount Failed',
        message: 'Rclone failed on mount command',
        detail: mountError,
      });
    }
  }, [mountError]);

  useIpcListener('check_mount', (event, arg) => {
    console.log('check_mount responded: ', arg);

    setMountPending(false);

    if (arg.success) {
      dispatch(setMountConnected(true));
    } else if (arg.error) {
      dispatch(setMountError(arg.error.toString()));
    } else {
      dispatch(setMountConnected(false));
    }
  });

  useIpcListener('check_device', (event, arg) => {
    if (arg.success) {
      dispatch(setDeviceConnected(true));

      if (arg.success.endsWith(':5555')) {
        dispatch(setWirelessConnected(true));
      }
    } else {
      dispatch(setDeviceConnected(false));
      dispatch(setWirelessConnected(false));
    }
  });

  useIpcListener('connect_wireless', (event, arg) => {
    console.log('connect_wireless msg came from backend to frontend:', arg);

    dispatch(setWirelessPending(false));

    if (arg.success) {
      console.log('WIRELESS CONNECTED');

      dispatch(setWirelessConnected(true));

      showMessageBox({
        type: 'info',
        title: 'Device connected by TCP',
        message:
          'You can now unplug the USB cable and continue using the program via wireless connection',
      });
    } else {
      dispatch(setWirelessConnected(false));
    }
  });

  function handleWirelessClick() {
    dispatch(setWirelessPending(true));

    if (wirelessConnected) {
      sendIPC('disconnect_wireless', '');
    } else {
      sendIPC('connect_wireless', '');
    }
  }

  function handleCheckMountClick() {
    dispatch(setMountPending(true));
    sendIPC('mount', 'bla');
  }

  function getWirelessButtonVariant() {
    if (wirelessConnected) {
      return 'success';
    }
    return 'danger';
  }

  function getMountButtonVariant() {
    if (mountPending) {
      return 'warning';
    }
    if (mountConnected) {
      return 'success';
    }
    return 'danger';
  }

  function getMountPendingIcon() {
    if (mountConnected) {
      return <Icon set="fa" icon="FaRegCheckCircle" id="mount-success" />;
    }

    return (
      <Icon
        set="im"
        icon="ImSpinner11"
        id="mount-pending"
        spin={getMountButtonVariant() === 'warning'}
      />
    );
  }

  return (
    <Container
      id="action-button-container"
      className="justify-content-end gap-2"
    >
      <Button
        id="mountbtn"
        variant={getMountButtonVariant()}
        size="sm"
        data-spin={mountPending}
        className="text-nowrap"
        onClick={handleCheckMountClick}
      >
        {getMountPendingIcon()} {mountConnected ? 'UNMOUNT' : 'MOUNT'}
        <br />
        {mountConnected ? 'connected' : 'disconnected'}
      </Button>
      <Button
        id="devicebtn"
        variant={deviceConnected ? 'success' : 'danger'}
        size="sm"
        className="text-nowrap"
      >
        {deviceConnected ? (
          <Icon set="fa" icon="FaRegCheckCircle" />
        ) : (
          <Icon set="im" icon="ImSpinner11" spin={!deviceConnected} />
        )}{' '}
        DEVICE
        <br />
        {deviceConnected ? 'connected' : 'disconnected'}
      </Button>
      <Button
        id="wirelessbtn"
        variant={getWirelessButtonVariant()}
        size="sm"
        className="text-nowrap"
        onClick={handleWirelessClick}
      >
        <Icon
          id="wirelessrefresh"
          set="im"
          icon="ImSpinner11"
          spin={wirelessPending}
        />{' '}
        WIRELESS
        <br />
        {wirelessConnected ? 'connected' : 'disconnected'}
      </Button>
    </Container>
  );
}

export default DeviceButtons;
