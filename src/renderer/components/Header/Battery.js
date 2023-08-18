import PropTypes from 'prop-types';
import Icon from '../shared/icon';

function Battery({ level, chargeMethod }) {
  if (chargeMethod === 'AC' || chargeMethod === 'USB') {
    return <Icon set="pi" icon="PiBatteryChargingBold" size="1point5x" />;
  }
  if (!level) {
    return <Icon set="pi" icon="PiBatteryEmptyBold" size="1point5x" />;
  }
  if (level <= 25) {
    return <Icon set="pi" icon="PiBatteryLowBold" size="1point5x" />;
  }
  if (level <= 50) {
    return <Icon set="pi" icon="PiBatteryMediumBold" size="1point5x" />;
  }
  if (level <= 75) {
    return <Icon set="pi" icon="PiBatteryHighBold" size="1point5x" />;
  }
  if (level <= 100) {
    return <Icon set="pi" icon="PiBatteryFullBold" size="1point5x" />;
  }

  return <Icon set="pi" icon="PiBatteryFullBold" size="1point5x" />;
}

Battery.propTypes = {
  level: PropTypes.oneOfType([PropTypes.number, PropTypes.oneOf(['XX'])]),
  chargeMethod: PropTypes.oneOf(['AC', 'AIR', 'USB', 'unknown']),
};

export default Battery;
