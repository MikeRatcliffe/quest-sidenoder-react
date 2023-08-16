import PropTypes from 'prop-types';
import { Alert, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const remote = window.require('@electron/remote');
const { shell } = remote;

const platform = remote.getGlobal('platform');

function ScrCpyBlock({ scrcpy }) {
  if (!scrcpy) {
    return (
      <h4>
        <Alert variant="warning" className="fs-6 p-1">
          <FontAwesomeIcon icon="refresh" spin={true} /> SCRCPY - checking...
        </Alert>
      </h4>
    );
  }

  if (scrcpy.version) {
    return (
      <Alert variant="success" className="fs-6 p-1">
        <FontAwesomeIcon icon={['far', 'check-circle']} /> SCRCPY Installed (
        {scrcpy.cmd})
        <br />
        <pre style={{ fontSize: 'x-small' }}>{scrcpy.version}</pre>
      </Alert>
    );
  } else {
    const tag = platform.replace('win', 'windows').replace('mac', 'macos');

    return (
      <Alert variant="danger" className="fs-6 p-1">
        <FontAwesomeIcon icon={['far', 'times-circle']} /> Can&apos;t find
        SCRCPY
        <br />
        Install the{' '}
        <Button
          variant="link"
          size="lg"
          className="p-0 border-0 fs-inherit link-light fw-normal system-check-link"
          onClick={() =>
            shell.openExternal(
              `https://github.com/Genymobile/scrcpy/blob/master/doc/${tag}.md`,
            )
          }
        >
          latest version
        </Button>
        , set a custom location in settings and try again
        {scrcpy.error && (
          <>
            <br />
            <pre style={{ fontSize: 'x-small' }}>error: \n{scrcpy.error}</pre>
          </>
        )}
      </Alert>
    );
  }
}

ScrCpyBlock.propTypes = {
  scrcpy: PropTypes.object,
};

export { ScrCpyBlock };
