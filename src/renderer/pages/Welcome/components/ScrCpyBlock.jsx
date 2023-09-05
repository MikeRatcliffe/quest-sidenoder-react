import { useEffect } from 'react';
import { Alert, Button } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { scrcpySelector, setScrcpy } from '../../../../store';
import Icon from '../../../shared/Icon';

import _useIpcListener from '../../../hooks/useIpcListener';
import _sendIPC from '../../../utils/sendIPC';

const useIpcListener = _useIpcListener.bind(this, module);
const sendIPC = _sendIPC.bind(this, module);

const remote = window.require('@electron/remote');
const { shell } = remote;

const platform = remote.getGlobal('platform');

function ScrCpyBlock() {
  const scrcpy = useSelector(scrcpySelector);
  const dispatch = useDispatch();

  useIpcListener('check_deps_scrcpy', (event, res) => {
    if (res) {
      dispatch(setScrcpy(res));
    }
  });

  useEffect(() => {
    sendIPC('check_deps_scrcpy', '');
  }, []);

  if (!scrcpy) {
    return (
      <h4>
        <Alert variant="warning" className="fs-6 p-1">
          <Icon set="im" icon="ImSpinner11" spin /> SCRCPY - checking...
        </Alert>
      </h4>
    );
  }

  if (scrcpy.version) {
    return (
      <Alert variant="success" className="fs-6 p-1">
        <Icon set="fa" icon="FaRegCheckCircle" /> SCRCPY Installed ({scrcpy.cmd}
        )
        <br />
        <pre style={{ fontSize: 'x-small' }}>{scrcpy.version}</pre>
      </Alert>
    );
  }

  const tag = platform.replace('win', 'windows').replace('mac', 'macos');

  return (
    <Alert variant="danger" className="fs-6 p-1">
      <Icon set="fa" icon="FaTimesCircle" /> Can&apos;t find SCRCPY
      <br />
      Install the{' '}
      <Button
        variant="link"
        size="lg"
        className="p-0 border-0 fs-inherit link-light fw-normal system-check-link"
        onClick={() =>
          shell.openExternal(
            `https://github.com/Genymobile/scrcpy/blob/master/doc/${tag}.md`
          )
        }
      >
        latest version
      </Button>
      , set a custom location in settings and try again
      {scrcpy.error && (
        <>
          <br />
          <pre style={{ fontSize: 'x-small' }}>{scrcpy.error}</pre>
        </>
      )}
      <Button
        id="scrcpy-retry"
        variant="link"
        size="sm"
        className="p-0 border-0 fs-inherit link-light fw-normal system-check-link position-absolute text-white end-0 me-2"
        onClick={() => sendIPC('check_deps_scrcpy', 'scrcpy')}
      >
        Retry
      </Button>
    </Alert>
  );
}

export default ScrCpyBlock;
