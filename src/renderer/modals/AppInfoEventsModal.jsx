import { PropTypes } from 'prop-types';
import { Modal } from 'react-bootstrap';
import Icon from '../../shared/Icon';

function AppInfoEvents({
  closeAppInfoEventsModal,
  isAppInfoEventsModalVisible,
}) {
  return (
    <Modal
      scrollable
      size="xl"
      show={isAppInfoEventsModalVisible()}
      onHide={() => closeAppInfoEventsModal()}
    >
      <Modal.Header closeButton>
        <Modal.Title as="h5">
          <Icon set="fa" icon="FaBug" /> AppInfoEvents
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>AppInfoEvents content</Modal.Body>
    </Modal>
  );
}

AppInfoEvents.propTypes = {
  closeAppInfoEventsModal: PropTypes.func,
  isAppInfoEventsModalVisible: PropTypes.func,
};

export default AppInfoEvents;
