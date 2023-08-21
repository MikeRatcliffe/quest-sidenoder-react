import { PropTypes } from 'prop-types';
import { Modal } from 'react-bootstrap';
import Icon from '../../shared/Icon';

function Prompt({ closePromptModal, isPromptModalVisible }) {
  return (
    <Modal
      scrollable
      size="xl"
      show={isPromptModalVisible()}
      onHide={() => closePromptModal()}
    >
      <Modal.Header closeButton>
        <Modal.Title as="h5">
          <Icon set="fa" icon="FaBug" /> Prompt
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>Prompt content</Modal.Body>
    </Modal>
  );
}

Prompt.propTypes = {
  closePromptModal: PropTypes.func,
  isPromptModalVisible: PropTypes.func,
};

export default Prompt;
