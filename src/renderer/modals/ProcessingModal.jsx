import { PropTypes } from 'prop-types';
import { Modal } from 'react-bootstrap';
import Icon from '../../shared/Icon';

function Processing({ closeProcessingModal, isProcessingModalVisible }) {
  return (
    <Modal
      scrollable
      size="xl"
      show={isProcessingModalVisible()}
      onHide={() => closeProcessingModal()}
    >
      <Modal.Header closeButton>
        <Modal.Title as="h5">
          <Icon set="fa" icon="FaBug" /> Processing
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>Processing content</Modal.Body>
    </Modal>
  );
}

Processing.propTypes = {
  closeProcessingModal: PropTypes.func,
  isProcessingModalVisible: PropTypes.func,
};

export default Processing;
