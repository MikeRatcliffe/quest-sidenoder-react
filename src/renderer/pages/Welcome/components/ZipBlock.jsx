import { useEffect } from 'react';
import { Alert, Button } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { setZip, zipSelector } from '../../../../store';
import Icon from '../../../shared/Icon';

import _useIpcListener from '../../../hooks/useIpcListener';
import _sendIPC from '../../../utils/sendIPC';

const useIpcListener = _useIpcListener.bind(this, module);
const sendIPC = _sendIPC.bind(this, module);

const remote = window.require('@electron/remote');
const { shell } = remote;

function ZipBlock() {
  const zip = useSelector(zipSelector);
  const dispatch = useDispatch();

  useIpcListener('check_deps_zip', (event, res) => {
    const { zip: resZip } = res;

    if (resZip) {
      dispatch(setZip(resZip));
    }
  });

  useEffect(() => {
    sendIPC('check_deps_zip', 'zip');
  }, []);

  if (!zip) {
    return (
      <h4>
        <Alert variant="warning" className="fs-6 p-1">
          <Icon set="im" icon="ImSpinner11" spin /> 7zip Archiver - checking...
        </Alert>
      </h4>
    );
  }

  if (zip.version) {
    return (
      <Alert variant="success" className="fs-6 p-1">
        <Icon set="fa" icon="FaRegCheckCircle" /> 7zip Archiver Installed (
        {zip.cmd})
        <br />
        <pre style={{ fontSize: 'x-small' }}>{zip.version}</pre>
      </Alert>
    );
  }

  return (
    <Alert variant="danger" className="fs-6 p-1">
      <Icon set="fa" icon="FaTimesCircle" /> Can&apos;t find 7zip Archiver
      <br />
      Install the{' '}
      <Button
        variant="link"
        size="lg"
        className="p-0 border-0 fs-inherit link-light fw-normal system-check-link"
        onClick={() =>
          shell.openExternal('https://www.7-zip.org/download.html')
        }
      >
        latest version
      </Button>{' '}
      and try again
      {zip.error && (
        <>
          <br />
          <pre style={{ fontSize: 'x-small' }}>error: \n{zip.error}</pre>
        </>
      )}
      <Button
        id="zip-retry"
        variant="link"
        size="sm"
        className="p-0 border-0 fs-inherit link-light fw-normal system-check-link position-absolute text-white end-0 me-2"
        onClick={() => sendIPC('check_deps_zip', 'zip')}
      >
        Retry
      </Button>
    </Alert>
  );
}

export default ZipBlock;
