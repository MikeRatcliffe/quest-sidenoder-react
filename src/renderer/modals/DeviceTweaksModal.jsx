import { PropTypes } from 'prop-types';
import { Alert, Button, Card, Col, Form, InputGroup, Modal, Row } from 'react-bootstrap';
import Icon from '../shared/Icon';

function DeviceTweaks({ closeDeviceTweaksModal, isDeviceTweaksModalVisible }) {
  return (
    <Modal
      scrollable
      size="lg"
      show={isDeviceTweaksModalVisible()}
      onHide={() => closeDeviceTweaksModal()}
    >
      <Modal.Header closeButton>
        <Modal.Title as="h5">
          <Icon set="fa" icon="FaBug" /> Device Tweaks
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Alert variant="warning" className="tweak-alert p-2 ps-3 pe-3">
            <small>
              <Icon set="fa" icon="FaExclamationTriangle" /> WARNING: Changes
              these settings at your own risk. Some of these tweaks reset to
              default when you restart your headset.
            </small>
          </Alert>

          <Card className="mb-2">
            <Card.Header>Tools:</Card.Header>

            <Form.Group className="m-3 ms-auto me-auto">
              <Button
                variant="primary"
                className="me-1"
                onClick={() => {
                  //shell.openExternal('https://downloads.rclone.org/');
                }}
              >
                <Icon set="fa" icon="FaShareSquare" /> Screen share
              </Button>

              <Button
                variant="primary"
                className="me-1"
                onClick={() => {
                  //shell.openExternal('https://downloads.rclone.org/');
                }}
              >
                <Icon set="fa" icon="FaPlug" /> Switch USB mode to MTP
              </Button>

              <Button
                variant="danger"
                className="me-1"
                onClick={() => {
                  //shell.openExternal('https://downloads.rclone.org/');
                }}
              >
                <Icon set="fa" icon="FaPowerOff" /> Reboot device
              </Button>

              <Button
                variant="warning"
                onClick={() => {
                  //shell.openExternal('https://downloads.rclone.org/');
                }}
              >
                <Icon set="im" icon="ImSpinner11" /> Reboot to recovery
              </Button>
            </Form.Group>

            <Form.Group className="m-3 mt-0 mb-0">
              <Form.Switch
                name="guardian_pause"
                className="fs-5"
                label="Pause the guardian (temporary disable it)"
                checked={}
                onChange={}
              />
            </Form.Group>

            <Form.Group className="m-3">
              <Form.Label className="mb-0">
                <h6 className="mb-0">Global multiplayer name</h6>
                <small className="card-text mb-0">
                  Will not change for apps that are already installed
                </small>
              </Form.Label>
              <InputGroup>
                <Form.Control
                  name="mp_name"
                  type="text"
                  value={}
                  onChange={}
                />
              </InputGroup>
            </Form.Group>
          </Card>

          <Card className="mb-2">
            <Card.Header>FW Update (experimental):</Card.Header>

            <Form.Group className="m-3 ms-auto me-auto">
              <Alert variant="info" className="m-3 mt-0 mb-0">
                <small>
                  <h6>Instructions:</h6>
                  <ol style={{marginBottom: 0}}>
                    <li>Reboot to bootloader.</li>
                    <li>
                      Select the "firmware update" option on your device using the
                      volume buttons to move the selection, and power button to
                      select.
                    </li>
                    <li>Sideload update.zip</li>
                  </ol>
                </small>
              </Alert>
            </Form.Group>

            <Form.Group className="m-3 mt-0">
              <Form.Label>Path to update.zip:</Form.Label>
              <InputGroup>
                <Form.Control
                  name="updateFwPath"
                  type="text"
                  readOnly
                  value={}
                  onClick={}
                />
                <Button
                  name="updateFwPath"
                  variant="primary"
                  onClick={}
                >
                  Browse
                </Button>
              </InputGroup>
            </Form.Group>

            <Form.Group className="m-3 mt-0">
              <Button
                variant="danger"
                className="me-1"
                onClick={() => {
                  //shell.openExternal('https://downloads.rclone.org/');
                }}
              >
                <Icon set="im" icon="ImSpinner11" /> Reboot to bootloader
              </Button>

              <Button
                variant="warning"
                className="me-1"
                onClick={() => {
                  //shell.openExternal('https://downloads.rclone.org/');
                }}
              >
                <Icon set="fa" icon="FaUpload" /> Sideload update.zip
              </Button>
            </Form.Group>
          </Card>

          <Card className="mb-2">
            <Card.Header>
              Rclone configs (needed for mounting remote disks):
            </Card.Header>

            <Form.Group className="m-3 mb-0">
              <Form.Label className="mb-0">
                <h6 className="mb-0">Set Screenshot Size</h6>
                <small>This changes the resolution of screenshots on the Quest</small>
              </Form.Label>
              <Form.Select
                name="cres"
                onChange={}
                value={}
              >
                <option value="640x480">640x480</option>
                <option value="1024x1024">1024x1024 (default - Quest2)</option>
                <option value="1280x720">1280x720</option>
                <option value="1920x1080">1920x1080</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="m-3">
              <Form.Label className="mb-0">
                <h6 className="mb-0">Set Video Capture Size</h6>
                <small>This changes the resolution of captured videos on the Quest</small>
              </Form.Label>
              <Form.Select
                name="cres"
                onChange={}
                value={}
              >
                <option value="1024">1024</option>
                <option value="1536">1536</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="m-3 mt-0" controlId="autoMount">
              <Form.Switch
                name="frc"
                className="fs-5"
                label="Full rate capture for videos recorded i.e. 60/72fps rather than 30fps."
                checked={}
                onChange={}
              />
            </Form.Group>
          </Card>

          <Card className="mb-2">
            <Card.Header>Main:</Card.Header>

            <Form.Group className="m-3 mb-0">
              <Form.Label className="mb-0">
                <h6 className="mb-0">Refresh Rate</h6>
                <small>This will allow you to change to 90Hz refresh rate for 90fps support in games on Quest 2.
                <br />
                WARNING: This does not work in all games, and does not work with Oculus Link. This setting may also reset to default when you restart your headset. You may need to press the power button twice to turn the screen off and on to enable this setting for apps that dont have it natively enabled.</small>
              </Form.Label>
              <Form.Select
                name="gRR"
                onChange={}
                value={}
              >
                <option value="72">default(72 Hz)</option>
                <option value="60">60 Hz</option>
                <option value="72">72 Hz</option>
                <option value="90">90 Hz</option>
                <option value="120">120 Hz</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="m-3 mb-0">
              <Form.Label className="mb-0">
                <h6 className="mb-0">Chromatic Aberration</h6>
              </Form.Label>
              <Form.Select
                name="gCA"
                onChange={}
                value={}
              >
                <option value="-1">by app</option>
                <option value="1">on</option>
                <option value="0">off</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="m-3 mb-0">
              <Form.Label className="mb-0">
                <h6 className="mb-0">FFR (Fixed Foveated Rendering) level</h6>
                <small>This will change how the view is rendered at the outer edges of the viewscreen for each eye. Higher gives better performance, lower gives better quality. This will be reset when you reboot the device.</small>
              </Form.Label>
              <Form.Select
                name="gFFR"
                onChange={}
                value={}
              >
                <option value="2">default (medium)</option>
                <option value="0">off</option>
                <option value="1">low</option>
                <option value="2">medium</option>
                <option value="3">high</option>
                <option value="4">high top</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="m-3 mb-0">
              <Form.Label className="mb-0">
                <h6 className="mb-0">Default Texture Size</h6>
                <small>This will change the quality that some in game textures are rendered.</small>
              </Form.Label>
              <Form.Select
                name="gSSO"
                onChange={}
                value={}
              >
                <option value="1440x1584">default - Quest2 (1440x1584)</option>
                <option value="1216x1344">default - Quest1 (1216x1344)</option>
                <option value="1024x1024">default - Go (1024x1024)</option>
                <option value="512x563">512x563</option>
                <option value="768x845">768x845</option>
                <option value="1024x1127">1024x1127</option>
                <option value="1280x1408">1280x1408</option>
                <option value="2048x2253">2048x2253</option>
                <option value="1440x1584">1440x1584</option>
              </Form.Select>
            </Form.Group>

            <Row>
              <Col>
                <Form.Group className="m-3">
                  <Form.Label className="mb-0">
                    <h6 className="mb-0">Set CPU level</h6>
                    <small>This can improve performance for 2D apps & games.</small>
                  </Form.Label>
                  <Form.Select
                    name="CPU"
                    onChange={}
                    value={}
                  >
                    <option value="-1">dynamic</option>
                    <option value="0">level 0 (slowest)</option>
                    <option value="1">level 1</option>
                    <option value="2">level 2</option>
                    <option value="3">level 3</option>
                    <option value="4">level 4 (fastest)</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="m-3 mb-0">
                  <Form.Label className="mb-0">
                    <h6 className="mb-0">Set GPU level</h6>
                    <small>This can improve performance for 2D apps & games.</small>
                  </Form.Label>
                  <Form.Select
                    name="GPU"
                    onChange={}
                    value={}
                  >
                    <option value="-1">dynamic</option>
                    <option value="0">level 0 (slowest)</option>
                    <option value="1">level 1</option>
                    <option value="2">level 2</option>
                    <option value="3">level 3</option>
                    <option value="4">level 4 (fastest)</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
          </Card>
        </Form>

        <Form.Group className="pull-right m-1 mt-2 me-0">
          <Button
            name="rclonePath"
            variant="primary"
            onClick={() => closeDeviceTweaksModal()}
          >
            Close
          </Button>
        </Form.Group>

      </Modal.Body>
    </Modal>
  );
}

DeviceTweaks.propTypes = {
  closeDeviceTweaksModal: PropTypes.func,
  isDeviceTweaksModalVisible: PropTypes.func,
};

export default DeviceTweaks;
