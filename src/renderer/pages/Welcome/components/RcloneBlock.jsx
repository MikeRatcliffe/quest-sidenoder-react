import { useEffect, useState } from 'react';
import { Alert, Button } from 'react-bootstrap';
import Icon from '../../../shared/Icon';

import _useIpcListener from '../../../hooks/useIpcListener';
import _sendIPC from '../../../utils/sendIPC';

const useIpcListener = _useIpcListener.bind(this, module);
const sendIPC = _sendIPC.bind(this, module);

const remote = window.require('@electron/remote');
const { shell } = remote;

function RcloneBlock() {
  const [rclone, setRclone] = useState(null);

  useIpcListener('check_deps_rclone', (event, res) => {
    const { rclone: resRclone } = res;

    if (resRclone) {
      setRclone(resRclone);
    }
  });

  useEffect(() => {
    sendIPC('check_deps_rclone', 'rclone');
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
          <pre style={{ fontSize: 'x-small' }}>{rclone.error}</pre>
        </>
      )}
      <Button
        id="rclone-retry"
        variant="link"
        size="sm"
        className="p-0 border-0 fs-inherit link-light fw-normal system-check-link position-absolute text-white end-0 me-2"
        onClick={() => sendIPC('check_deps_rclone', 'rclone')}
      >
        Retry
      </Button>
    </Alert>
  );
}

export default RcloneBlock;
