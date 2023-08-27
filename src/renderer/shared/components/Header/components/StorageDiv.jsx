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

  const percent = +storage.percent.replace('%', '');
  const success = Math.min(80, percent);
  const warning = Math.min(15, Math.max(0, percent - 80));
  const danger = Math.min(5, Math.max(0, percent - 95));

  return (
    <>
      <small className="pull-left">
        Used: {storage.used} of {storage.size} ({storage.percent})
      </small>
      <small className="pull-right">Free: {storage.free}</small>
      <br />
      <ProgressBar>
        <ProgressBar striped variant="success" now={success} key={1} />
        <ProgressBar striped variant="warning" now={warning} key={2} />
        <ProgressBar striped variant="danger" now={danger} key={3} />
      </ProgressBar>
    </>
  );
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
