import { PropTypes } from 'prop-types';
import { Modal } from 'react-bootstrap';
import Icon from '../shared/Icon';

function SettingsModal({ closeSettingsModal, isSettingsModalVisible }) {
  return (
    <Modal
      scrollable
      size="xl"
      show={isSettingsModalVisible()}
      onHide={() => closeSettingsModal()}
    >
      <Modal.Header closeButton>
        <Modal.Title as="h5">
          <Icon set="fa" icon="FaCog" /> Settings
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>Settings content</Modal.Body>
    </Modal>
  );
}

SettingsModal.propTypes = {
  closeSettingsModal: PropTypes.func,
  isSettingsModalVisible: PropTypes.func,
};

export default SettingsModal;
