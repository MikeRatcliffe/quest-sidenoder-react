import PropTypes from 'prop-types';
import { Alert, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const remote = window.require('@electron/remote');
const { shell } = remote;

function ZipBlock({ zip }) {
  if (!zip) {
    return (
      <h4>
        <Alert variant="warning" className="fs-6 p-1">
          <FontAwesomeIcon icon="refresh" spin={true} /> 7zip Archiver -
          checking...
        </Alert>
      </h4>
    );
  }

  if (zip.version) {
    return (
      <Alert variant="success" className="fs-6 p-1">
        <FontAwesomeIcon icon={['far', 'check-circle']} /> 7zip Archiver
        Installed ({zip.cmd})
        <br />
        <pre style={{ fontSize: 'x-small' }}>{zip.version}</pre>
      </Alert>
    );
  } else {
    return (
      <Alert variant="danger" className="fs-6 p-1">
        <FontAwesomeIcon icon={['far', 'times-circle']} /> Can&apos;t find 7zip
        Archiver
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
      </Alert>
    );
  }
}

ZipBlock.propTypes = {
  zip: PropTypes.object,
};

export { ZipBlock };
