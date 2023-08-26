import { useEffect, useState } from 'react';
import { Alert, Button } from 'react-bootstrap';
import useIpcListener from '../../../hooks/useIpcListener';
import Icon from '../../../shared/Icon';

import _sendIPC from '../../../utils/sendIPC';
const sendIPC = _sendIPC.bind(this, module);

const remote = window.require('@electron/remote');
const { shell } = remote;

function RcloneBlock() {
  const [rclone, setRclone] = useState(null);

  useIpcListener('check_deps', (event, res) => {
    console.log('check_deps msg arrived in AdbBlock:', res);

    const { rclone: resRclone } = res;

    if (resRclone) {
      setRclone(resRclone);
    }
  });

  useEffect(() => {
    sendIPC('check_deps', 'rclone');
  }, []);

  if (!rclone) {
    return (
      <h4>
        <Alert variant="warning" className="fs-6 p-1">
          <Icon set="im" icon="ImSpinner11" spin /> RCLONE - checking...
        </Alert>
      </h4>
    );
  }

  if (rclone.version) {
    return (
      <Alert variant="success" className="fs-6 p-1">
        <Icon set="fa" icon="FaRegCheckCircle" /> RCLONE Installed ({rclone.cmd}
        )
        <br />
        <pre style={{ fontSize: 'x-small' }}>{rclone.version}</pre>
      </Alert>
    );
  }

  return (
    <Alert variant="danger" className="fs-6 p-1">
      <Icon set="fa" icon="FaTimesCircle" /> Can&apos;t find RCLONE
      <br />
      Install the{' '}
      <Button
        variant="link"
        size="lg"
        className="p-0 border-0 fs-inherit link-light fw-normal system-check-link"
        onClick={() => shell.openExternal('https://downloads.rclone.org/')}
      >
        latest version
      </Button>
      , set a custom location in settings and try again
      {rclone.error && (
        <>
          <br />
          <pre style={{ fontSize: 'x-small' }}>error: \n{rclone.error}</pre>
        </>
      )}
    </Alert>
  );
}

export default RcloneBlock;
