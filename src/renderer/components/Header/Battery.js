import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import imgBattery from '../../../../assets/battery-charging.gif';

function Battery({ level, chargeMethod }) {
  if (chargeMethod === 'AC' || chargeMethod === 'USB') {
    return <img src={imgBattery} alt="Battery charging icon" />;
  }
  if (!level) {
    return <FontAwesomeIcon icon="battery-empty" />;
  }
  if (level <= 25) {
    return <FontAwesomeIcon icon="battery-quarter" />;
  }
  if (level <= 50) {
    return <FontAwesomeIcon icon="battery-half" />;
  }
  if (level <= 75) {
    return <FontAwesomeIcon icon="battery-three-quarters" />;
  }
  if (level <= 75) {
    return <FontAwesomeIcon icon="battery-three-quarters" />;
  }

  return <FontAwesomeIcon icon="battery-full" />;
}

Battery.propTypes = {
  level: PropTypes.oneOfType([PropTypes.number, PropTypes.oneOf(['XX'])]),
  chargeMethod: PropTypes.oneOf(['AC', 'AIR', 'USB', 'unknown']),
};

export { Battery };
