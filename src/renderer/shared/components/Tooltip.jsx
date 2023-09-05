import PropTypes from 'prop-types';
import { OverlayTrigger, Tooltip as BsTooltip } from 'react-bootstrap';
import Icon from '../Icon';

function Tooltip({ children, placement = 'bottom', style }) {
  style = {
    maxWidth: '200px',
    ...style,
  };

  return (
    <OverlayTrigger
      delay={{ hide: 450, show: 300 }}
      overlay={<BsTooltip style={style}>{children}</BsTooltip>}
      placement={placement}
    >
      <span className="tooltip-info-icon" style={style}>
        <Icon set="im" icon="ImInfo" />
      </span>
    </OverlayTrigger>
  );
}

Tooltip.propTypes = {
  children: PropTypes.node,
  placement: PropTypes.oneOf([
    'auto-start',
    'auto',
    'auto-end',
    'top-start',
    'top',
    'top-end',
    'right-start',
    'right',
    'right-end',
    'bottom-end',
    'bottom',
    'bottom-start',
    'left-end',
    'left',
    'left-start',
  ]),
  style: PropTypes.objectOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  ),
};

export default Tooltip;
