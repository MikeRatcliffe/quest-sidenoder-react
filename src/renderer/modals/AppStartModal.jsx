import { PropTypes } from 'prop-types';
import { Modal } from 'react-bootstrap';
import Icon from '../../shared/Icon';

function AppStart({ closeAppStartModal, isAppStartModalVisible }) {
  return (
    <Modal
      scrollable
      size="xl"
      show={isAppStartModalVisible()}
      onHide={() => closeAppStartModal()}
    >
      <Modal.Header closeButton>
        <Modal.Title as="h5">
          <Icon set="fa" icon="FaBug" /> AppStart
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>AppStart content</Modal.Body>
    </Modal>
  );
}

AppStart.propTypes = {
  closeAppStartModal: PropTypes.func,
  isAppStartModalVisible: PropTypes.func,
};

export default AppStart;
