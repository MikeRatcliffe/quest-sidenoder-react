import { useSelector, useDispatch } from 'react-redux';
import { Alert, Button, Card, Form, InputGroup, Modal } from 'react-bootstrap';
import {
  modalHide,
  modalShow,
  getModalIsVisibleSelector,
  scrcpySelector,
  setScrcpyField,
  scrcpyFieldsSelector,
} from '../../store';

import { MODAL_SCRCPY, MODAL_SETTINGS } from '../utils/constants';
import Tooltip from '../shared/components/Tooltip';
import Icon from '../shared/Icon';
import _sendIPC from '../utils/sendIPC';

const sendIPC = _sendIPC.bind(this, module);

function ScrcpyModal() {
  const dispatch = useDispatch();

  const scrcpy = useSelector(scrcpySelector);
  const formFields = useSelector(scrcpyFieldsSelector);

  const isShown = useSelector((state) =>
    getModalIsVisibleSelector(state, MODAL_SCRCPY)
  );

  const setField = (key, val, sendChangeConfig = true) => {
    const payload = { key, val };

    dispatch(setScrcpyField(payload));

    if (sendChangeConfig) {
      sendIPC('change_config', payload);
    }
  };

  async function handleEvent({ target }) {
    let key = '';
    let val = '';

    switch (target.name) {
      // Checkboxes
      case 'scrcpyFullscreen':
      case 'scrcpyNoControl':
      case 'scrcpyAlwaysOnTop':
        key = target.name;
        val = target.checked;

        setField(key, val);
        break;

      // Textfields and dropdowns
      case 'scrcpyBitrate':
      case 'scrcpyBitrateType':
      case 'scrcpyCrop':
      case 'scrcpyMaxFps':
      case 'scrcpyMaxSize':
        key = target.name;
        val = target.value;

        setField(key, val);
        break;

      // Buttons
      case 'scrcpyCropQuest1':
        setField('scrcpyCrop', '1280:720:1500:350');
        break;
      case 'scrcpyCropQuest2':
        setField('scrcpyCrop', '1600:900:2017:510');
        break;
      case 'scrcpyStart':
        sendIPC('scrcpy_start');
        break;
      default:
      // Do Nothing
    }
  }

  return (
    <Modal
      scrollable
      size="xl"
      show={isShown}
      onHide={() => dispatch(modalHide(MODAL_SCRCPY))}
    >
      <Modal.Header closeButton>
        <Modal.Title as="h5">Screen Sharing</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Card className="mb-2">
            <Card.Header className="mb-0">
              <Icon set="fa" icon="FaShareSquare" /> Share screen
            </Card.Header>
            <Card.Body>
              {!scrcpy && (
                <Alert variant="danger">
                  <Icon set="fa" icon="FaExclamationTriangle" />
                  ERROR: Scrcpy is not installed. If it is installed then please
                  set a custom scrcpy path in{' '}
                  <Button
                    variant="link"
                    className="border-0 p-0 position-relative"
                    style={{ top: '-2px' }}
                    onClick={() => dispatch(modalShow(MODAL_SETTINGS))}
                  >
                    settings
                  </Button>
                  . If it is not installed, then please install it.
                </Alert>
              )}

              <Form.Group className="formfield">
                <Form.Label>
                  <span>Video BitRate:</span>
                  <Tooltip style={{ float: 'right' }}>
                    Encode the video at the given bit rate. Default is 8 Mbits/s
                    (8000000 bits/s).
                  </Tooltip>
                </Form.Label>
                <InputGroup>
                  <Form.Control
                    name="scrcpyBitrate"
                    type="number"
                    className="me-1"
                    onChange={handleEvent}
                    value={formFields.scrcpyBitrate}
                    min={0}
                  />
                  <Form.Select
                    name="scrcpyBitrateType"
                    onChange={handleEvent}
                    value={formFields.scrcpyBitrateType}
                  >
                    <option value="">bits/s</option>
                    <option value="K">Kbits/s (x1000)</option>
                    <option value="M">Mbits/s (x1000000)</option>
                  </Form.Select>
                </InputGroup>
              </Form.Group>

              <Form.Group className="formfield">
                <Form.Label>
                  <span>Crop:</span>
                  <Tooltip style={{ float: 'right', maxWidth: '400px' }}>
                    <p>
                      Crop the device screen on the server. The values are
                      expressed in the device natural orientation (typically,
                      portrait for a phone, landscape for a tablet). Any
                      --max-size value is computed on the cropped size.
                    </p>
                    <p>
                      The format is <code>width:height:x:y</code>
                    </p>
                  </Tooltip>
                </Form.Label>
                <InputGroup>
                  <Form.Control
                    name="scrcpyCrop"
                    type="text"
                    placeholder="width:height:x:y"
                    onChange={handleEvent}
                    value={formFields.scrcpyCrop}
                  />
                  <Button
                    name="scrcpyCropQuest2"
                    variant="info"
                    className="ms-1 me-1"
                    onClick={handleEvent}
                  >
                    Quest 2
                  </Button>
                  <Button
                    name="scrcpyCropQuest1"
                    variant="info"
                    onClick={handleEvent}
                  >
                    Quest 1
                  </Button>
                </InputGroup>
              </Form.Group>

              <Form.Group className="formfield">
                <Form.Label>
                  <span>Max fps:</span>
                  <Tooltip style={{ float: 'right' }}>
                    Limit the frame rate of screen capture. 0 is unlimited.
                  </Tooltip>
                </Form.Label>
                <Form.Control
                  name="scrcpyMaxFps"
                  type="number"
                  onChange={handleEvent}
                  value={formFields.scrcpyMaxFps || ''}
                  min={0}
                />
              </Form.Group>

              <Form.Group className="formfield">
                <Form.Label>
                  <span>Max Size:</span>
                  <Tooltip style={{ float: 'right' }}>
                    Limit both the width and height of the video to value. The
                    other dimension is computed so that the device aspect-ratio
                    is preserved. Default is 0 (unlimited).
                  </Tooltip>
                </Form.Label>
                <Form.Control
                  name="scrcpyMaxSize"
                  type="number"
                  onChange={handleEvent}
                  value={formFields.scrcpyMaxSize || ''}
                  min={0}
                />
              </Form.Group>

              <Form.Group className="formfield">
                <Form.Label>
                  <span>Fullscreen mode:</span>
                </Form.Label>
                <div className="formfield-body">
                  <div>
                    By default, the stream is started in windowed mode. Use this
                    option to allow the app to start in fullscreen mode instead.
                  </div>
                  <Form.Switch
                    name="scrcpyFullscreen"
                    className="fs-5"
                    label="Enable cast in window"
                    onChange={handleEvent}
                    checked={formFields.scrcpyFullscreen}
                  />
                </div>
              </Form.Group>

              <Form.Group className="formfield">
                <Form.Label>
                  <span>Remote Control:</span>
                </Form.Label>
                <div className="formfield-body">
                  <div>
                    By default, the stream is read-only. Choose &quot;Enable
                    remote control&quot; to enable the device to be interacted
                    with.
                  </div>
                  <Form.Switch
                    name="scrcpyNoControl"
                    className="fs-5"
                    label="Enable remote control"
                    onChange={handleEvent}
                    checked={formFields.scrcpyNoControl}
                  />
                </div>
              </Form.Group>

              <Form.Group className="formfield mb-0">
                <Form.Label>
                  <span>Always on top:</span>
                </Form.Label>
                <div className="formfield-body">
                  <div>
                    Make scrcpy window always on top (above other windows).
                  </div>
                  <Form.Switch
                    name="scrcpyAlwaysOnTop"
                    className="fs-5"
                    label="Enable always-on-top mode"
                    onChange={handleEvent}
                    checked={formFields.scrcpyAlwaysOnTop}
                  />
                </div>
              </Form.Group>
            </Card.Body>
          </Card>
        </Form>

        <Button
          name="close"
          variant="secondary"
          className="pull-right m-1 mt-2 me-0"
          onClick={() => dispatch(modalHide(MODAL_SCRCPY))}
        >
          Close
        </Button>

        <Button
          name="scrcpyStart"
          variant="primary"
          className="pull-right m-1 mt-2 me-0"
          onClick={handleEvent}
        >
          Start stream
        </Button>
      </Modal.Body>
    </Modal>
  );
}

export default ScrcpyModal;
