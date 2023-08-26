import PropTypes from 'prop-types';
import { ProgressBar } from 'react-bootstrap';
import Icon from '../../../Icon';

function StorageDiv({ storage }) {
  if (!storage) {
    return (
      <div id="storageDiv">
        <Icon set="im" icon="ImSpinner11" spin /> Trying to fetch device storage
        info
      </div>
    );
  }

  if (storage) {
    const percent = +storage.percent.replace('%', '');

    let variant = 'success';
    if (percent > 80) {
      variant = 'warning';
    }
    if (percent > 95) {
      variant = 'danger';
    }

    return (
      <>
        <small className="pull-left">
          Used: {storage.used} of {storage.size} ({storage.percent})
        </small>
        <small className="pull-right">Free: {storage.free}</small>
        <br />
        <ProgressBar
          id="progress-bar"
          striped
          variant={variant}
          now={percent}
        />
      </>
    );
  }
  return 'Can`t get storage status';
}

StorageDiv.propTypes = {
  storage: PropTypes.oneOfType([
    PropTypes.shape({
      percent: PropTypes.string,
      used: PropTypes.string,
      size: PropTypes.string,
      free: PropTypes.string,
    }),
    PropTypes.bool,
  ]),
};

export default StorageDiv;
