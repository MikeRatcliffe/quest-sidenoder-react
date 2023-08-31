import { useSelector, useDispatch } from 'react-redux';
import { Button, Modal } from 'react-bootstrap';
import { modalHide, getModalIsVisibleSelector } from '../../store';
import { MODAL_APPTOOLS } from '../utils/constants';
import Icon from '../shared/Icon';

function AppTools() {
  const dispatch = useDispatch();

  const isShown = useSelector((state) =>
    getModalIsVisibleSelector(state, MODAL_APPTOOLS)
  );

  return (
    <Modal
      scrollable
      size="xl"
      show={isShown}
      onHide={() => dispatch(modalHide(MODAL_APPTOOLS))}
    >
      <Modal.Header closeButton>
        <Modal.Title as="h5">
          <Icon set="fa" icon="FaList" /> App Tools
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h1>AppTools Modal</h1>

        <Button
          name="rclonePath"
          variant="primary"
          onClick={() => dispatch(modalHide(MODAL_APPTOOLS))}
        >
          Close
        </Button>
      </Modal.Body>
    </Modal>
  );
}

export default AppTools;
