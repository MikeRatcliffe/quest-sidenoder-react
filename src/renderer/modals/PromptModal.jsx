import { useSelector, useDispatch } from 'react-redux';
import { Button, Modal } from 'react-bootstrap';
import { modalHide, getModalIsVisibleSelector } from '../../store';
import { MODAL_PROMPT } from '../utils/constants';
import Icon from '../shared/Icon';

function Prompt() {
  const dispatch = useDispatch();

  const isShown = useSelector((state) =>
    getModalIsVisibleSelector(state, MODAL_PROMPT)
  );

  return (
    <Modal
      scrollable
      size="xl"
      show={isShown}
      onHide={() => dispatch(modalHide(MODAL_PROMPT))}
    >
      <Modal.Header closeButton>
        <Modal.Title as="h5">
          <Icon set="fa" icon="FaList" /> Prompt
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h1>Prompt Modal</h1>

        <Button
          name="rclonePath"
          variant="primary"
          onClick={() => dispatch(modalHide(MODAL_PROMPT))}
        >
          Close
        </Button>
      </Modal.Body>
    </Modal>
  );
}

export default Prompt;
