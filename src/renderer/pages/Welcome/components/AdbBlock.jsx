import { useEffect } from 'react';
import { Alert, Button } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { adbSelector, setAdb } from '../../../../store';
import Icon from '../../../shared/Icon';

import _useIpcListener from '../../../hooks/useIpcListener';
import _sendIPC from '../../../utils/sendIPC';

const useIpcListener = _useIpcListener.bind(this, module);
const sendIPC = _sendIPC.bind(this, module);
const remote = window.require('@electron/remote');
const { shell } = remote;

function AdbBlock() {
  const adb = useSelector(adbSelector);
  const dispatch = useDispatch();

  useIpcListener('check_deps_adb', (event, res) => {
    const { adb: resAdb } = res;

    if (resAdb) {
      dispatch(setAdb(resAdb));
    }
  });

  useEffect(() => {
    sendIPC('check_deps_adb', 'adb');
  }, []);

  if (!adb) {
    return (
      <Alert variant="warning" className="fs-6 p-1">
        <Icon set="im" icon="ImSpinner11" spin /> Android Debug Bridge -
        checking...
      </Alert>
    );
  }

  if (adb.version) {
    return (
      <Alert variant="success" className="fs-6 p-1">
        <Icon set="fa" icon="FaRegCheckCircle" /> ADB Installed ({adb.cmd}
        )
        <br />
        <pre style={{ fontSize: 'x-small' }}>{adb.version}</pre>
      </Alert>
    );
  }

  return (
    <Alert variant="danger" className="fs-6 p-1">
      <Icon set="fa" icon="FaTimesCircle" /> Can&apos;t find ADB
      <br />
      Install the{' '}
      <Button
        variant="link"
        size="lg"
        className="p-0 border-0 fs-inherit link-light fw-normal system-check-link"
        onClick={() =>
          shell.openExternal(
            'https://www.xda-developers.com/install-adb-windows-macos-linux/'
          )
        }
      >
        latest version
      </Button>{' '}
      and try again
      {adb.error && (
        <>
          <br />
          <pre style={{ fontSize: 'x-small' }}>error: \n{adb.error}</pre>
        </>
      )}
      <Button
        id="adb-retry"
        variant="link"
        size="sm"
        className="p-0 border-0 fs-inherit link-light fw-normal system-check-link position-absolute text-white end-0 me-2"
        onClick={() => sendIPC('check_deps_adb', 'adb')}
      >
        Retry
      </Button>
    </Alert>
  );
}

export default AdbBlock;
