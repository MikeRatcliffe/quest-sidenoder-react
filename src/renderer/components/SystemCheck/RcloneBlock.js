import PropTypes from 'prop-types';
import { Alert, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const remote = window.require('@electron/remote');
const { shell } = remote;

function RcloneBlock({ rclone }) {
  if (!rclone) {
    return (
      <h4>
        <Alert variant="warning" className="fs-6 p-1">
          <FontAwesomeIcon icon="refresh" spin={true} /> RCLONE - checking...
        </Alert>
      </h4>
    );
  }

  if (rclone.version) {
    return (
      <Alert variant="success" className="fs-6 p-1">
        <FontAwesomeIcon icon={['far', 'check-circle']} /> RCLONE Installed (
        {rclone.cmd})
        <br />
        <pre style={{ fontSize: 'x-small' }}>{rclone.version}</pre>
      </Alert>
    );
  } else {
    return (
      <Alert variant="danger" className="fs-6 p-1">
        <FontAwesomeIcon icon={['far', 'times-circle']} /> Can&apos;t find
        RCLONE
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
}

RcloneBlock.propTypes = {
  rclone: PropTypes.object,
};

export { RcloneBlock };