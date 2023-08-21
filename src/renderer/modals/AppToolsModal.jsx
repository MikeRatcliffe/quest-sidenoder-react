import { PropTypes } from 'prop-types';
import { Modal } from 'react-bootstrap';
import Icon from '../../shared/Icon';

function AppTools({ closeAppToolsModal, isAppToolsModalVisible }) {
  return (
    <Modal
      scrollable
      size="xl"
      show={isAppToolsModalVisible()}
      onHide={() => closeAppToolsModal()}
    >
      <Modal.Header closeButton>
        <Modal.Title as="h5">
          <Icon set="fa" icon="FaBug" /> AppTools
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>AppTools content</Modal.Body>
    </Modal>
  );
}

AppTools.propTypes = {
  closeAppToolsModal: PropTypes.func,
  isAppToolsModalVisible: PropTypes.func,
};

export default AppTools;
