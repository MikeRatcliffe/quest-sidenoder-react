import { PropTypes } from 'prop-types';
import { Modal } from 'react-bootstrap';
import Icon from '../../shared/Icon';

function AppInfo({ closeAppInfoModal, isAppInfoModalVisible }) {
  return (
    <Modal
      scrollable
      size="xl"
      show={isAppInfoModalVisible()}
      onHide={() => closeAppInfoModal()}
    >
      <Modal.Header closeButton>
        <Modal.Title as="h5">
          <Icon set="fa" icon="FaBug" /> AppInfo
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>AppInfo content</Modal.Body>
    </Modal>
  );
}

AppInfo.propTypes = {
  closeAppInfoModal: PropTypes.func,
  isAppInfoModalVisible: PropTypes.func,
};

export default AppInfo;
