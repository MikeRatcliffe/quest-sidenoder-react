import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Container } from 'react-bootstrap';
import Icon from '../shared/icon';

const { ipcRenderer } = window.require('electron');

function DeviceButtons({ mounted, setMounted, mounting, setMounting }) {
  const [deviceConnected, setDeviceConnected] = useState(false);
  const [wirelessConnected, setWirelessConnected] = useState(false);
  const [wirelessRefresh, setWirelessRefresh] = useState(false);

  useEffect(() => {
    ipcRenderer.removeAllListeners('check_device');
    ipcRenderer.on('check_device', (event, arg) => {
      console.log('check_device msg received', arg);
      if (arg.success) {
        console.log('GETDEVICE SUCCESS');
        setDeviceConnected(true);
        // const deviceLinks = [document.querySelectorAll('a.adbdev')];
        // for (const link of deviceLinks) {
        // FIXME: We don't do it this way in React
        // link.removeClass('disabled');
        // }
        //   if (!mounted) {
        //     $id('updateBadge').addClass('disabled');
        //   }
        //   if (arg.success.endsWith(':5555')) {
        //     id('wirelessbtn').onclick = disconnectWireless;
        //     $id('wirelessbtn')
        //       .removeClass('btn-danger')
        //       .addClass('btn-success')
        //       .html(
        //         `<i id="wirelessrefresh" class="fa fa-check-circle-o"></i> | WIRELESS:<br>connected`,
        //       );
        //   }
        //   ipcRenderer.send('get_device_info', '');
        //   ipcRenderer.send('mp_name', { cmd: 'get' });
        // } else {
        //   $id('devicebtn')
        //     .removeClass('btn-success')
        //     .addClass('btn-danger')
        //     .html(
        //       `<i class="fa fa-refresh fa-spin"></i> | DEVICE:<br>disconnected`,
        //     );
        //   $('a.adbdev').addClass('disabled');
        //   id('wirelessbtn').onclick = connectWireless;
        //   $id('wirelessbtn')
        //     .removeClass('btn-success')
        //     .addClass('btn-danger')
        //     .html(
        //       `<i id="wirelessbtnrefresh" class="fa fa-refresh"></i> | WIRELESS:<br>disconnected`,
        //     );
      }
    });
  }, []);

  function onWirelessClick() {
    setWirelessRefresh(true);
    if (wirelessConnected) {
      ipcRenderer.send('disconnect_wireless', '');
    } else {
      ipcRenderer.send('connect_wireless', '');
    }
  }

  function onCheckMountClick() {
    setMounting(true);
    ipcRenderer.send('mount', 'bla');
  }

  let wirelessVariant = null;
  if (wirelessRefresh) {
    wirelessVariant = 'warning';
  } else if (!wirelessConnected) {
    wirelessVariant = 'danger';
  }

  let mountButtonVariant = 'danger';
  function getMountRefreshIcon() {
    if (mounted) {
      mountButtonVariant = 'success';
      return (
        <Icon
          set="fa"
          icon="FaRegCheckCircle"
          id="mountrefresh"
          spin={mountButtonVariant !== 'success'}
        />
      );
    }
    if (mounting) {
      mountButtonVariant = 'warning';
    }

    mountButtonVariant = 'danger';
    return (
      <Icon
        set="im"
        icon="ImSpinner11"
        id="mountrefresh"
        spin={mountButtonVariant === 'warning'}
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
        variant={mountButtonVariant}
        size="sm"
        data-spin={mounting}
        className="text-nowrap"
        onClick={onCheckMountClick}
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
        variant={wirelessVariant}
        size="sm"
        className="text-nowrap"
        onClick={onWirelessClick}
      >
        <Icon
          id="wirelessrefresh"
          set="im"
          icon="ImSpinner11"
          spin={wirelessRefresh}
        />{' '}
        WIRELESS
        <br />
        disconnected
      </Button>
    </Container>
  );
}

DeviceButtons.propTypes = {
  mounted: PropTypes.bool,
  mounting: PropTypes.bool,
  setMounted: PropTypes.func,
  setMounting: PropTypes.func,
};

export default DeviceButtons;
