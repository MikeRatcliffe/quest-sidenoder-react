import { PropTypes } from 'prop-types';
import { Modal } from 'react-bootstrap';
import Icon from '../shared/Icon';

function DeviceTweaks({ closeDeviceTweaksModal, isDeviceTweaksModalVisible }) {
  return (
    <Modal
      scrollable
      size="lg"
      show={isDeviceTweaksModalVisible()}
      onHide={() => closeDeviceTweaksModal()}
    >
      <Modal.Header closeButton>
        <Modal.Title as="h5">
          <Icon set="fa" icon="FaBug" /> Device Tweaks
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>Device Tweaks content</Modal.Body>
    </Modal>
  );
}

DeviceTweaks.propTypes = {
  closeDeviceTweaksModal: PropTypes.func,
  isDeviceTweaksModalVisible: PropTypes.func,
};

export default DeviceTweaks;
