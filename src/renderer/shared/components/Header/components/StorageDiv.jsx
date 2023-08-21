import PropTypes from 'prop-types';
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

    let bg = 'success';
    if (percent > 80) {
      bg = 'warning';
    }
    if (percent > 95) {
      bg = 'danger';
    }

    return (
      <>
        <small className="pull-left">
          Used: {storage.used} of {storage.size} ({storage.percent})
        </small>
        <small className="pull-right">Free: {storage.free}</small>
        <br />
        <div className="progress">
          <div
            className={`progress-bar progress-bar-striped bg-${bg}`}
            role="progressbar"
            style={{ width: storage.percent }}
            aria-valuenow={percent}
            aria-valuemin="0"
            aria-valuemax="100"
          />
        </div>
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
