import { useDispatch, useSelector } from 'react-redux';
import { Button, Col, Container, Form, Modal, Row } from 'react-bootstrap';
import { MODAL_MESSAGEBOX } from '../utils/constants';
import {
  getModalIsVisibleSelector,
  messageBoxTypeSelector,
  messageBoxTitleSelector,
  messageBoxMessageSelector,
  messageBoxDetailSelector,
  messageBoxButtonsSelector,
  messageBoxCheckboxLabelSelector,
  messageBoxCheckboxCheckedSelector,
  messageBoxTextboxLabelSelector,
  messageBoxTextboxValueSelector,
  setMessageBoxCheckboxChecked,
  setMessageBoxTextboxValue,
} from '../../store';
import Icon from '../shared/Icon';
import _sendIPC from '../utils/sendIPC';

const sendIPC = _sendIPC.bind(this, module);

function MessageBox() {
  const dispatch = useDispatch();

  const isShown = useSelector((state) =>
    getModalIsVisibleSelector(state, MODAL_MESSAGEBOX)
  );
  const type = useSelector(messageBoxTypeSelector);
  const title = useSelector(messageBoxTitleSelector);
  const message = useSelector(messageBoxMessageSelector);
  const detail = useSelector(messageBoxDetailSelector);
  const checkboxLabel = useSelector(messageBoxCheckboxLabelSelector);
  const checkboxChecked = useSelector(messageBoxCheckboxCheckedSelector);
  const textboxLabel = useSelector(messageBoxTextboxLabelSelector);
  const textboxValue = useSelector(messageBoxTextboxValueSelector);
  const buttons = useSelector(messageBoxButtonsSelector);

  let icon = '';
  switch (type) {
    case 'error':
      icon = (
        <Icon
          set="fa"
          icon="FaExclamationTriangle"
          className="messagebox-icon messagebox-error-icon"
        />
      );
      break;
    case 'info':
      icon = (
        <Icon
          set="fa6"
          icon="FaCircleInfo"
          className="messagebox-icon messagebox-info-icon"
        />
      );
      break;
    default:
    // Do nothing
  }

  function handleChange({ target }) {
    switch (target.name) {
      case 'checkbox':
        dispatch(setMessageBoxCheckboxChecked(target.checked));
        break;
      case 'textbox':
        dispatch(setMessageBoxTextboxValue(target.value));
        break;
      default:
      // Do Nothing
    }
  }

  return (
    <Modal id="messagebox" show={isShown} centered>
      <Modal.Header>
        <Modal.Title as="h5" className="ps-2">
          {title}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container>
          <Row>
            <Col xs={2}>
              <div>{icon}</div>
            </Col>
            <Col xs={10}>
              <div className="messagebox-text-container">
                <h5>{message}</h5>
                {type === 'error' ? (
                  <span className="messagebox-error-container">{detail}</span>
                ) : (
                  <h6>{detail}</h6>
                )}
              </div>
            </Col>
          </Row>
          {textboxLabel && (
            <Row>
              <Col xs={12}>
                <Form.Label>
                  <span>{textboxLabel}</span>
                </Form.Label>
                <Form.Control
                  name="textbox"
                  type="text"
                  value={textboxValue}
                  onChange={handleChange}
                />
              </Col>
            </Row>
          )}
          {checkboxLabel && (
            <Row>
              <Col xs={12}>
                <Form.Check
                  name="checkbox"
                  className="fs-6"
                  label={checkboxLabel}
                  checked={checkboxChecked}
                  onChange={handleChange}
                />
              </Col>
            </Row>
          )}
        </Container>
      </Modal.Body>
      <Modal.Footer className="p-0 border-0">
        {buttons.map((buttonLabel, buttonIndexClicked) => (
          <Button
            variant="primary"
            size="lg"
            className={`pull-right me-${buttonIndexClicked > 0 ? 3 : 0} mb-3`}
            onClick={() => {
              sendIPC('messagebox-button-clicked', {
                buttonIndexClicked,
                checkboxChecked,
                textboxValue,
              });
            }}
            key={buttonLabel}
          >
            {buttonLabel}
          </Button>
        ))}
        {!buttons.length && (
          <Button
            variant="primary"
            size="lg"
            className="pull-right me-3 mb-3"
            onClick={() => {
              sendIPC('messagebox-button-clicked', {
                buttonIndexClicked: 0,
                checkboxChecked,
              });
            }}
          >
            Ok
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
}

export default MessageBox;
