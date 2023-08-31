import { useSelector, useDispatch } from 'react-redux';
import { Button, Modal } from 'react-bootstrap';
import { modalHide, getModalIsVisibleSelector } from '../../store';
import { MODAL_DONATE } from '../utils/constants';
import Icon from '../shared/Icon';

function Donate() {
  const dispatch = useDispatch();

  const isShown = useSelector((state) =>
    getModalIsVisibleSelector(state, MODAL_DONATE)
  );

  return (
    <Modal
      scrollable
      size="xl"
      show={isShown}
      onHide={() => dispatch(modalHide(MODAL_DONATE))}
    >
      <Modal.Header closeButton>
        <Modal.Title as="h5">
          <Icon set="fa" icon="FaList" /> Donate
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h1>Donate Modal</h1>

        <Button
          name="rclonePath"
          variant="primary"
          onClick={() => dispatch(modalHide(MODAL_DONATE))}
        >
          Close
        </Button>
      </Modal.Body>
    </Modal>
  );
}

export default Donate;
