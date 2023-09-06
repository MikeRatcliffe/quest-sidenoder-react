import { useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Alert,
  Button,
  Card,
  Col,
  Container,
  Form,
  InputGroup,
  Modal,
  Row,
} from 'react-bootstrap';
import {
  getModalIsVisibleSelector,
  modalHide,
  modalShow,
  setTweaksValue,
  tweaksFieldsSelector,
} from '../../store';
import Tooltip from '../shared/components/Tooltip';
import { MODAL_DEVICETWEAKS, MODAL_SCRCPY } from '../utils/constants';
import Icon from '../shared/Icon';
import _sendIPC from '../utils/sendIPC';

const { dialog } = window.require('@electron/remote');
const { ipcRenderer } = window.require('electron');
const sendIPC = _sendIPC.bind(this, module);

function DeviceTweaks() {
  const dispatch = useDispatch();

  const formFields = useSelector(tweaksFieldsSelector);

  const isShown = useSelector((state) =>
    getModalIsVisibleSelector(state, MODAL_DEVICETWEAKS)
  );

  const setStoreValue = useCallback(
    (payload, sendChangeTweak = true) => {
      dispatch(setTweaksValue(payload));

      if (sendChangeTweak) {
        sendIPC('device_tweaks', { cmd: 'set', ...payload });
      }
    },
    [dispatch]
  );

  useEffect(() => {
    ipcRenderer.once('device_tweaks', (event, res) => {
      console.log('DeviceTweaksModal.js ⭠ "device_tweaks" args:', res);
      setStoreValue(
        {
          bonelabMods: res.bonelabMods,
          chromaticAberration: res.chromaticAberration,
          cpuLevel: res.cpuLevel,
          experimentalMode: res.experimentalMode,
          foveationDynamic: res.foveationDynamic,
          foveationLevel: res.foveationLevel,
          gpuLevel: res.gpuLevel,
          guardianPause: res.guardianPause,
          mtpMode: res.mtpMode,
          multiplayerName: res.multiplayerName,
          optimizeFor: res.optimizeFor,
          presetTetiana: res.presetTetiana,
          videoTextureSize: res.videoTextureSize,
          videoCaptureBitrate: res.videoCaptureBitrate,
          videoCaptureFps: res.videoCaptureFps,
          videoCaptureFullRate: res.videoCaptureFullRate,
          videoCaptureIn169: res.videoCaptureIn169,
          videoCaptureSize: res.videoCaptureSize,
          videoRefreshRate: res.videoRefreshRate,
        },
        false
      );
    });

    sendIPC('device_tweaks', { cmd: 'get' });
  }, [setStoreValue]);

  async function updateFwPath() {
    const file = await dialog.showOpenDialog(null, {
      properties: ['openFile'],
      title: 'Update.zip path',
      message: 'Browse to update.zip',
      filters: [
        {
          name: 'Zip',
          extensions: ['zip'],
        },
      ],
    });
    if (file.canceled) {
      return;
    }

    const val = file.filePaths[0];
    setStoreValue({ updateFirmwarePath: val });
  }

  async function handleFieldChange({ target }) {
    let key = '';
    let val = '';

    switch (target.name) {
      // Checkboxes
      case 'foveationDynamic':
      case 'videoCaptureFullRate':
      case 'experimentalMode':
      case 'bonelabMods':
      case 'guardianPause':
      case 'videoCaptureIn169':
        key = target.name;
        val = target.checked;

        setStoreValue({ [key]: val });
        break;

      // Textfields and dropdowns
      case 'multiplayerName':
      case 'cpuLevel':
      case 'gpuLevel':
      case 'videoTextureSize':
      case 'videoRefreshRate':
      case 'chromaticAberration':
      case 'foveationLevel':
      case 'videoCaptureSize':
      case 'videoCaptureFps':
      case 'videoCaptureBitrate':
      case 'presetTetiana':
      case 'optimizeFor':
        key = target.name;
        val = target.value;

        setStoreValue({ [key]: val });
        break;

      // Textfields
      case 'updateFirmwarePathText':
        setStoreValue({ updateFirmwarePath: target.value });
        break;

      // Buttons
      case 'shareScreen':
        dispatch(modalShow(MODAL_SCRCPY));
        break;

      case 'rebootToRecovery':
        sendIPC('reboot_recovery', '');
        break;
      case 'rebootToBootloader':
        sendIPC('reboot_bootloader', '');
        break;
      case 'sideloadFirmware':
        sendIPC('sideload_update', formFields.updateFirmwarePath);
        break;
      case 'rebootDevice':
        sendIPC('reboot_device', '');
        break;
      case 'mtpMode':
        sendIPC('enable_mtp', '');
        break;
      case 'updateFirmwarePath':
        await updateFwPath();
        break;

      default:
      // Do Nothing
    }
  }

  return (
    <Modal
      scrollable
      size="lg"
      show={isShown}
      onHide={() => dispatch(modalHide(MODAL_DEVICETWEAKS))}
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
              <Icon set="fa" icon="FaExclamationTriangle" />{' '}
              <strong>WARNING:</strong> Changes these settings at your own risk.
              Some of these tweaks reset to default when you restart your
              headset.
            </small>
          </Alert>

          <Container className="mb-2 p-0 text-nowrap">
            <Row className="justify-content-between ps-3 pe-3">
              <Col sm="auto" className="p-0">
                <Button
                  name="mtpMode"
                  variant="primary"
                  title="MTP (Media Transfer Protocol) is used to create a connection that only allows the transfer of media. The connection is read-only, so it doesn't allow adding or editing files."
                  onClick={handleFieldChange}
                >
                  <Icon set="fa" icon="FaPlug" /> Switch USB mode to MTP
                </Button>
              </Col>

              <Col sm="auto" className="p-0">
                <Button
                  name="shareScreen"
                  variant="primary"
                  onClick={handleFieldChange}
                >
                  <Icon set="fa" icon="FaShareSquare" /> Share screen
                </Button>
              </Col>

              <Col sm="auto" className="p-0">
                <Button
                  name="rebootDevice"
                  variant="danger"
                  onClick={handleFieldChange}
                >
                  <Icon set="fa" icon="FaPowerOff" /> Reboot device
                </Button>
              </Col>

              <Col sm="auto" className="p-0">
                <Button
                  name="rebootToRecovery"
                  variant="warning"
                  onClick={handleFieldChange}
                >
                  <Icon set="im" icon="ImSpinner11" /> Reboot to recovery
                </Button>
              </Col>
            </Row>
          </Container>

          <Card className="mb-2">
            <Card.Header>Quality & Performance</Card.Header>

            <Form.Group className="formfield">
              <Form.Label>
                <span>Optimize For:</span>
                <Tooltip style={{ float: 'right' }}>
                  A few simple performance profiles.
                </Tooltip>
              </Form.Label>
              <Form.Select
                name="optimizeFor"
                onChange={handleFieldChange}
                value={formFields.optimizeFor}
              >
                <option value="none">None</option>
                <option value="better-image-quality">
                  Better image quality
                </option>
                <option value="120hz">120 Hz Video</option>
              </Form.Select>
            </Form.Group>

            <Row>
              <Col>
                <Form.Group className="formfield">
                  <Form.Label>
                    <span>CPU Level:</span>
                    <Tooltip style={{ float: 'right' }}>
                      This can improve performance for apps & games at the
                      expense of quicker battery draining. Your device may get a
                      little hotter than normal but well within limits.
                    </Tooltip>
                  </Form.Label>
                  <Form.Select
                    name="cpuLevel"
                    onChange={handleFieldChange}
                    value={formFields.cpuLevel}
                  >
                    <option value="-1">Selected By App (Default)</option>
                    <option value="0">0 (slowest)</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4 (fastest)</option>
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col>
                <Form.Group className="formfield">
                  <Form.Label>
                    <span>GPU level:</span>
                    <Tooltip style={{ float: 'right' }}>
                      This can improve performance for apps & games at the
                      expense of quicker battery draining. Your device may get a
                      little hotter than normal but well within limits.
                    </Tooltip>
                  </Form.Label>
                  <Form.Select
                    name="gpuLevel"
                    onChange={handleFieldChange}
                    value={formFields.gpuLevel}
                  >
                    <option value="-1">Selected By App (Default)</option>
                    <option value="0">0 (slowest)</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4 (fastest)</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="formfield">
              <Form.Label>
                <span>Default Texture Size:</span>
                <Tooltip style={{ maxWidth: '400px', float: 'right' }}>
                  <p>
                    The Quest 2 comes with a single LCD panel that is able to
                    output a resolution of <code>1832 x 1920</code> pixels per
                    eye. What you may not known is that due to the hardware
                    limitations of the mobile chipset, virtually no games are
                    actually rendered at the native resolution of the headset.
                  </p>
                  <p>
                    For most games, you can change the Quest 2 texture size from
                    the default value of <code>1440 x 1584</code> to{' '}
                    <code>1536 x 1690</code> for a slightly crispier image
                    without noticeable degradation in performance.
                  </p>
                </Tooltip>
              </Form.Label>
              <Form.Select
                name="videoTextureSize"
                onChange={handleFieldChange}
                value={formFields.videoTextureSize}
              >
                <option value="512x563">512 x 563</option>
                <option value="768x845">768 x 845</option>
                <option value="1024x1127">1024 x 1127</option>
                <option value="1216x1344">
                  1216 x 1344 (Default - Quest 1)
                </option>
                <option value="1280x1408">1280 x 1408</option>
                <option value="1440x1584">
                  1440 x 1584 (Default - Quest 2)
                </option>
                <option value="1536x1690">1536 x 1690</option>
                <option value="2048x2253">2048 x 2253</option>
                <option value="2560x2816">2560 x 2816</option>
                <option value="3072x3380">3072 x 3380</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="formfield">
              <Form.Label>
                <span>Refresh Rate:</span>
                <Tooltip style={{ float: 'right' }}>
                  <p>
                    <strong>WARNING:</strong> This does not work in all games,
                    and does not work with Oculus Link. This setting will also
                    reset to default when you restart your headset.
                  </p>
                  <p>
                    You may need to press the power button twice to turn the
                    screen off and on to enable this setting for apps that dont
                    have it natively enabled.
                  </p>
                </Tooltip>
              </Form.Label>
              <Form.Select
                name="videoRefreshRate"
                onChange={handleFieldChange}
                value={formFields.videoRefreshRate}
              >
                <option value="60">60 Hz</option>
                <option value="72">72 Hz (Default)</option>
                <option value="90">90 Hz</option>
                <option value="120">120 Hz</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="formfield">
              <Form.Label>
                <span>Chromatic Aberration:</span>
                <Tooltip style={{ float: 'right' }}>
                  <p>
                    Chromatic aberration is the failure of the lenses to focus
                    all colors to the same point, which creates an outline of
                    unwanted color along the edges of objects (see the image
                    below).
                  </p>
                  <p>
                    To combat the issue, the Quest uses a shader to apply
                    chromatic aberration correction, which counters the original
                    chromatic aberration.
                  </p>
                </Tooltip>
              </Form.Label>
              <Form.Select
                name="chromaticAberration"
                onChange={handleFieldChange}
                value={formFields.chromaticAberration}
              >
                <option value="-1">Selected By App</option>
                <option value="1">On (Default)</option>
                <option value="0">Off</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="formfield">
              <Form.Label>
                <span>Fixed Foveated Rendering:</span>
                <Tooltip style={{ float: 'right' }}>
                  <p>
                    Fixed foveated rendering is a performance optimization
                    method where only the pixels in the center of your view are
                    computed fully and independently by the GPU. The textures on
                    the edges are rendered at a lower resolution to reduce the
                    load on the GPU.
                  </p>
                  <p>
                    This setting changes how the view is rendered at the outer
                    edges of the viewscreen for each eye. Higher gives better
                    performance, lower gives better quality. This will be reset
                    when you reboot the device.
                  </p>
                </Tooltip>
              </Form.Label>
              <Form.Select
                name="foveationLevel"
                onChange={handleFieldChange}
                value={formFields.foveationLevel}
              >
                <option value="0">Off</option>
                <option value="1">Low</option>
                <option value="2">Medium (Default)</option>
                <option value="3">High</option>
                <option value="4">High Top</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="formfield">
              <Form.Label>
                <span>Dynamic Foveated Rendering:</span>
              </Form.Label>
              <div className="formfield-body">
                <div>
                  Most apps use dynamic foveated rendering (image quality on the
                  outer edges of the view is scaled automatically). Disable this
                  if you want to test your app with a fixed foveation level.
                </div>
                <Form.Switch
                  name="foveationDynamic"
                  className="fs-5 d-inline-block"
                  label="Enable Dynamic Foveated Rendering"
                  onChange={handleFieldChange}
                  checked={formFields.foveationDynamic}
                />
              </div>
            </Form.Group>
          </Card>

          <Card className="mb-2">
            <Card.Header>Video Capture</Card.Header>

            <Form.Group className="formfield">
              <Form.Label>
                <span>Video Capture Size:</span>
                <Tooltip style={{ float: 'right', maxWidth: '400px' }}>
                  <p>
                    Whenever you are going to record videos on the Quest using
                    the built-in recording functionality, by default the videos
                    are recorded at a <code>1024 x 1024</code> resolution.
                  </p>
                  <p>
                    This means that when you look at the video on a wide-screen
                    display the recording doesn&apos;t catch the whole display.
                    Sidenodes allows you to override the default recording
                    resolution.
                  </p>
                </Tooltip>
              </Form.Label>
              <Form.Select
                name="videoCaptureSize"
                onChange={handleFieldChange}
                value={formFields.videoCaptureSize}
              >
                <option value="640x480">640 x 480</option>
                <option value="1280x720">1280 x 720</option>
                <option value="1024x1024">1024 x 1024 (Default)</option>
                <option value="1600x1600">1600 x 1600</option>
                <option value="1920x1080">1920 x 1080</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="formfield">
              <Form.Label>
                <span>Video Capture FPS:</span>
                <Tooltip style={{ float: 'right' }}>
                  This changes the frame rate of captured videos.
                </Tooltip>
              </Form.Label>
              <Form.Select
                name="videoCaptureFps"
                onChange={handleFieldChange}
                value={formFields.videoCaptureFps}
              >
                <option value="24">24 fps (Default)</option>
                <option value="30">30 fps</option>
                <option value="60">60 fps</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="formfield">
              <Form.Label>
                <span>Video Capture Bitrate:</span>
                <Tooltip style={{ float: 'right' }}>
                  This changes the quality of captured videos on the Quest.
                </Tooltip>
              </Form.Label>
              <Form.Select
                name="videoCaptureBitrate"
                onChange={handleFieldChange}
                value={formFields.videoCaptureBitrate}
              >
                <option value="5000000">5 mbps (Default)</option>
                <option value="10000000">10 mbps</option>
                <option value="15000000">15 mbps</option>
                <option value="20000000">20 mbps</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="formfield">
              <Form.Label>
                <span>Tetiana&apos;s Presets:</span>
                <Tooltip style={{ float: 'right' }}>
                  Quickly set the video capture resolution while also using 60
                  FPS and 10 Mbps bitrate capture settings too.
                </Tooltip>
              </Form.Label>
              <Form.Select
                name="presetTetiana"
                onChange={handleFieldChange}
                value={formFields.presetTetiana}
              >
                <option value="full-hd">Full HD (1920 x 1080)</option>
                <option value="square">Square (1600 x 1600)</option>
                <option value="none">Off</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="formfield">
              <Form.Label>
                <span>Capture In 16:9 Aspect Ratio:</span>
              </Form.Label>
              <div className="formfield-body">
                <div>Great for creators that make their own videos.</div>
                <Form.Switch
                  name="videoCaptureIn169"
                  className="fs-5 d-inline-block"
                  label="Capture Quality Videos In 16:9 Aspect Ratio"
                  onChange={handleFieldChange}
                  checked={formFields.videoCaptureIn169}
                />
              </div>
            </Form.Group>

            <Form.Group className="formfield">
              <Form.Label>
                <span>Full Rate Video Capture:</span>
              </Form.Label>
              <div className="formfield-body">
                <div>
                  Full Rate Capture changes the frame recording from 25-30 fps
                  to match the target refresh rate and the fps you are actually
                  getting (60, 72, 90, or 120 fps).
                </div>
                <Form.Switch
                  name="videoCaptureFullRate"
                  className="fs-5 d-inline-block"
                  label="Enable Full Rate Video Capture"
                  onChange={handleFieldChange}
                  checked={formFields.videoCaptureFullRate}
                />
              </div>
            </Form.Group>
          </Card>

          <Card className="mb-2">
            <Card.Header>Experimental & Miscellaneous</Card.Header>

            <Form.Group className="formfield">
              <Form.Label>
                <span>Global Multiplayer Name:</span>
                <Tooltip style={{ float: 'right', maxWidth: '400px' }}>
                  This is the username used when paying online when the game
                  doesn&apos;t ask you to choose your own. This will not change
                  the name for games that are already installed.
                </Tooltip>
              </Form.Label>
              <InputGroup>
                <Form.Control
                  name="multiplayerName"
                  type="text"
                  onChange={handleFieldChange}
                  value={formFields.multiplayerName}
                />
              </InputGroup>
            </Form.Group>

            <Form.Group className="formfield">
              <Form.Label>
                <span>Experimental Features:</span>
              </Form.Label>
              <div className="formfield-body">
                <div>This enables your Quest&apos;s experimental features.</div>
                <Form.Switch
                  name="experimentalMode"
                  className="fs-5 d-inline-block"
                  label="Enable Experimental Features"
                  onChange={handleFieldChange}
                  checked={formFields.experimentalMode}
                />
              </div>
            </Form.Group>

            <Form.Group className="formfield">
              <Form.Label>
                <span>Bonelab Mods:</span>
              </Form.Label>
              <div className="formfield-body">
                <div>This will enable mods inside BONELAB on your quest.</div>
                <Form.Switch
                  name="bonelabMods"
                  className="fs-5 d-inline-block"
                  label="Enable BONELAB Mods"
                  onChange={handleFieldChange}
                  checked={formFields.bonelabMods}
                />
              </div>
            </Form.Group>

            <Form.Group className="formfield">
              <Form.Label>
                <span>Guardian:</span>
              </Form.Label>
              <div className="formfield-body">
                <div>This will enable / disable the guardian.</div>
                <Form.Switch
                  name="guardianPause"
                  className="fs-5 d-inline-block"
                  label="Pause the guardian (temporary disable it)"
                  onChange={handleFieldChange}
                  checked={formFields.guardianPause}
                />
              </div>
            </Form.Group>
          </Card>

          <Card className="mb-2">
            <Card.Header>Firmware Update</Card.Header>

            <Form.Group className="m-0">
              <Alert variant="info" className="m-3 mt-0 mb-3">
                <small>
                  <h6>FW Update Instructions:</h6>
                  <ol className="mb-0">
                    <li>Reboot to bootloader</li>
                    <li>
                      Select the &quot;firmware update&quot; option on your
                      device using the volume buttons to move the selection, and
                      power button to select.
                    </li>
                    <li>Sideload update.zip</li>
                  </ol>
                </small>
              </Alert>
            </Form.Group>

            <Form.Group className="formfield">
              <Form.Label>
                <span>Path to update.zip:</span>
                <Tooltip style={{ float: 'right', maxWidth: '400px' }}>
                  This is the username used when paying online when the game
                  doesn&apos;t ask you to choose your own. This will not change
                  the name for games that are already installed.
                </Tooltip>
              </Form.Label>
              <InputGroup>
                <Form.Control
                  name="updateFirmwarePathText"
                  type="text"
                  onChange={handleFieldChange}
                  value={formFields.updateFirmwarePath}
                />
                <Button
                  name="updateFirmwarePath"
                  variant="primary"
                  onClick={handleFieldChange}
                >
                  Browse
                </Button>
              </InputGroup>
            </Form.Group>

            <Form.Group className="m-3 mt-0">
              <Button
                name="rebootToBootloader"
                variant="danger"
                className="me-1"
                onClick={handleFieldChange}
              >
                <Icon set="im" icon="ImSpinner11" /> Reboot to bootloader
              </Button>

              <Button
                name="sideloadFirmware"
                variant="warning"
                className="me-1"
                onClick={handleFieldChange}
              >
                <Icon set="fa" icon="FaUpload" /> Sideload update.zip
              </Button>
            </Form.Group>
          </Card>
        </Form>

        <Form.Group className="pull-right m-1 mt-2 me-0">
          <Button
            variant="primary"
            onClick={() => dispatch(modalHide(MODAL_DEVICETWEAKS))}
          >
            Close
          </Button>
        </Form.Group>
      </Modal.Body>
    </Modal>
  );
}

export default DeviceTweaks;
