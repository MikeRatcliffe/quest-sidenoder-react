import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Container } from 'react-bootstrap';
import Icon from '../../../Icon';

const { dialog } = window.require('@electron/remote');
const { ipcRenderer } = window.require('electron');

function DeviceButtons({ mounted, mountRefresh, setMountRefresh }) {
  const [deviceConnected, setDeviceConnected] = useState(false);
  const [wirelessConnected, setWirelessConnected] = useState(false);
  const [wirelessRefresh, setWirelessRefresh] = useState(false);

  useEffect(() => {
    ipcRenderer.on('check_device', (event, arg) => {
      console.log('check_device msg received', arg);
      if (arg.success) {
        console.log('GETDEVICE SUCCESS');
        setDeviceConnected(true);

        if (arg.success.endsWith(':5555')) {
          setWirelessConnected(true);
        }

        ipcRenderer.send('get_device_info', '');
        ipcRenderer.send('mp_name', { cmd: 'get' });
      } else {
        setDeviceConnected(false);
        setWirelessConnected(false);
      }
    });

    ipcRenderer.on('connect_wireless', (event, arg) => {
      console.log('connect_wireless msg came from backend to frontend:', arg);

      setWirelessRefresh(false);

      if (arg.success) {
        console.log('WIRELESS CONNECTED');

        setWirelessConnected(true);

        dialog.showMessageBox(null, {
          type: 'info',
          buttons: ['Ok'],
          title: 'Device connected by TCP',
          message:
            'You can now unplug the USB cable and continue using the program via wireless connection',
        });
      } else {
        setWirelessConnected(false);
      }
    });
  }, []);

  function handleWirelessClick() {
    setWirelessRefresh(true);

    if (wirelessConnected) {
      ipcRenderer.send('disconnect_wireless', '');
    } else {
      ipcRenderer.send('connect_wireless', '');
    }
  }

  function handleCheckMountClick() {
    setMountRefresh(true);
    ipcRenderer.send('mount', 'bla');
  }

  function getWirelessButtonVariant() {
    if (wirelessConnected) {
      return 'success';
    }
    return 'danger';
  }

  function getMountButtonVariant() {
    if (mountRefresh) {
      return 'warning';
    }
    if (mounted) {
      return 'success';
    }
    return 'danger';
  }

  function getMountRefreshIcon() {
    if (mounted) {
      return <Icon set="fa" icon="FaRegCheckCircle" id="mountrefresh" />;
    }

    return (
      <Icon
        set="im"
        icon="ImSpinner11"
        id="mountrefresh"
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
        data-spin={mountRefresh}
        className="text-nowrap"
        onClick={handleCheckMountClick}
      >
        {getMountRefreshIcon()} {mounted ? 'UNMOUNT' : 'MOUNT'}
        <br />
        {mounted ? 'connected' : 'disconnected'}
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
          spin={wirelessRefresh}
        />{' '}
        WIRELESS
        <br />
        {wirelessConnected ? 'connected' : 'disconnected'}
      </Button>
    </Container>
  );
}

DeviceButtons.propTypes = {
  mounted: PropTypes.bool,
  mountRefresh: PropTypes.bool,
  setMountRefresh: PropTypes.func,
};

export default DeviceButtons;
