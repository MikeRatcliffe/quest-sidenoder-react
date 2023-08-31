import { useSelector, useDispatch } from 'react-redux';
import { Button, Modal } from 'react-bootstrap';
import { modalHide, getModalIsVisibleSelector } from '../../store';
import { MODAL_SIDELOAD } from '../utils/constants';
import Icon from '../shared/Icon';

function Sideload() {
  const dispatch = useDispatch();

  const isShown = useSelector((state) =>
    getModalIsVisibleSelector(state, MODAL_SIDELOAD)
  );

  return (
    <Modal
      scrollable
      size="xl"
      show={isShown}
      onHide={() => dispatch(modalHide(MODAL_SIDELOAD))}
    >
      <Modal.Header closeButton>
        <Modal.Title as="h5">
          <Icon set="fa" icon="FaList" /> Sideload
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h1>Sideload Modal</h1>

        <Button
          name="rclonePath"
          variant="primary"
          onClick={() => dispatch(modalHide(MODAL_SIDELOAD))}
        >
          Close
        </Button>
      </Modal.Body>
    </Modal>
  );
}

export default Sideload;
