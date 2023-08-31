import { useSelector, useDispatch } from 'react-redux';
import { Button, Modal } from 'react-bootstrap';
import { modalHide, getModalIsVisibleSelector } from '../../store';
import { MODAL_INSTALLED } from '../utils/constants';
import Icon from '../shared/Icon';

function Installed() {
  //   if (!mounted) {
  //     $id('updateBadge').addClass('disabled');
  //   }
  const dispatch = useDispatch();

  const isShown = useSelector((state) =>
    getModalIsVisibleSelector(state, MODAL_INSTALLED)
  );

  return (
    <Modal
      scrollable
      size="xl"
      show={isShown}
      onHide={() => dispatch(modalHide(MODAL_INSTALLED))}
    >
      <Modal.Header closeButton>
        <Modal.Title as="h5">
          <Icon set="fa" icon="FaList" /> Installed APKs
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h1>Installed Modal</h1>

        <Button
          name="rclonePath"
          variant="primary"
          onClick={() => dispatch(modalHide(MODAL_INSTALLED))}
        >
          Close
        </Button>
      </Modal.Body>
    </Modal>
  );
}

export default Installed;
