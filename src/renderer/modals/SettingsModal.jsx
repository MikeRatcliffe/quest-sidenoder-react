import { useEffect } from 'react';
import { PropTypes } from 'prop-types';
import { Button, Card, Form, InputGroup, Modal } from 'react-bootstrap';
import useFields from '../hooks/useFields';
import { ReactComponent as SideQuest } from '../img/sq-white.svg';
import Icon from '../shared/Icon';

const { ipcRenderer } = window.require('electron');
const { dialog } = window.require('@electron/remote');
const remote = window.require('@electron/remote');
const { shell } = remote;
const which = window.require('which');

const platform = remote.getGlobal('platform');

function SettingsModal({ closeSettingsModal, isSettingsModalVisible }) {
  const config = remote.getGlobal('currentConfiguration');

  const [getField, setField, allFields] = useFields({
    proxyUrl: config.proxyUrl,
    cfgSection: config.cfgSection,
    mountCmd: config.mountCmd,
    rclonePath: config.rclonePath,
    rcloneConf: config.rcloneConf,
    scrcpyPath: config.scrcpyPath,
    tmpdir: config.tmpdir,
    allowOtherDevices: config.allowOtherDevices,
    autoMount: config.autoMount,
    cacheOculusGames: config.cacheOculusGames,
    proxyOculus: config.proxyOculus,
    proxySQ: config.proxySQ,
    proxySteam: config.proxySteam,
    userHide: config.userHide,
  });

  useEffect(() => {
    // eslint-disable-next-line no-floating-promise/no-floating-promise
    (async () => {
      if (!getField('rclonePath')) {
        setField('rclonePath', await which('rclone'));
      }
      if (!getField('scrcpyPath')) {
        setField('scrcpyPath', await which('scrcpy'));
      }
      if (!getField('tmpdir')) {
        setField('tmpdir', remote.getGlobal('tmpdir'));
      }
    })();
  }, [getField, setField, allFields]);

  async function setCustomPath({
    key,
    setStateFunc,
    title,
    message,
    filters,
    type = 'openFile',
  }) {
    filters = filters || [
      {
        name: 'All',
        extensions: ['*'],
      },
    ];
    const res = await dialog.showOpenDialog(null, {
      properties: [type],
      title,
      message,
      filters,
    });
    if (res.canceled) {
      return;
    }

    const val = res.filePaths[0];
    setStateFunc(key, val);

    ipcRenderer.send('change_config', { key, val });
  }

  async function handleFieldChange({ target }) {
    switch (target.name) {
      case 'autoMount':
        setField('autoMount', target.checked);
        ipcRenderer.send('change_config', {
          key: target.name,
          val: target.checked,
        });
        break;
      case 'allowOtherDevices':
        setField('allowOtherDevices', target.checked);
        ipcRenderer.send('change_config', {
          key: target.name,
          val: target.checked,
        });
        break;
      case 'cacheOculusGames':
        setField('cacheOculusGames', target.checked);
        ipcRenderer.send('change_config', {
          key: target.name,
          val: target.checked,
        });
        break;
      case 'cfgSection':
        setField('cfgSection', target.value);
        ipcRenderer.send('change_config', {
          key: 'cfgSection',
          val: target.value,
        });
        break;
      case 'mountCmd':
        setField('mountCmd', target.value);
        ipcRenderer.send('change_config', {
          key: 'mountCmd',
          val: target.value,
        });
        break;
      case 'proxyOculus':
        setField('proxyOculus', target.checked);
        ipcRenderer.send('change_config', {
          key: target.name,
          val: target.checked,
        });
        break;
      case 'proxySteam':
        setField('proxySteam', target.checked);
        ipcRenderer.send('change_config', {
          key: target.name,
          val: target.checked,
        });
        break;
      case 'proxySQ':
        setField('proxySQ', target.checked);
        ipcRenderer.send('change_config', {
          key: target.name,
          val: target.checked,
        });
        break;
      case 'proxyUrl':
        setField('proxyUrl', target.value);
        ipcRenderer.send('change_config', {
          key: 'proxyUrl',
          val: target.value,
        });
        break;
      case 'rclonePath':
        await setCustomPath({
          key: 'rclonePath',
          title: 'RClone custom binary path',
          message: 'Browse to rclone binary location',
          setStateFunc: setField,
        });
        break;
      case 'rcloneConf':
        await setCustomPath({
          key: 'rcloneConf',
          title: 'Rclone custom config path',
          message: 'Browse to Rclone config location',
          setStateFunc: setField,
        });
        break;
      case 'scrcpyPath':
        await setCustomPath({
          key: 'scrcpyPath',
          title: 'Scrcpy custom binary path',
          message: 'Browse to Scrcpy binary location',
          setStateFunc: setField,
        });
        break;
      case 'tmpdir':
        await setCustomPath({
          key: 'tmpdir',
          title: 'Temp directory custom path',
          message: 'Browse to new temp directory location',
          setStateFunc: setField,
        });
        break;
      case 'userHide':
        setField('userHide', target.checked);
        ipcRenderer.send('change_config', {
          key: target.name,
          val: target.checked,
        });
        break;
      default:
      // Do Nothing
    }
  }

  return (
    <Modal
      scrollable
      size="xl"
      show={isSettingsModalVisible()}
      onHide={() => closeSettingsModal()}
    >
      <Modal.Header closeButton>
        <Modal.Title as="h5">
          <Icon set="fa" icon="FaCog" /> Settings
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Card className="mb-2">
            <Card.Header>
              Rclone configs (needed for mounting remote disks):
            </Card.Header>

            <Form.Group className="m-3">
              <Form.Label>
                Select mirror (click on mount status button to remount)
              </Form.Label>
              <Form.Select
                name="cfgSection"
                onChange={handleFieldChange}
                value={getField('cfgSection')}
              >
                {remote.getGlobal('rcloneSections').map((section) => {
                  return (
                    <option key={section} value={section}>
                      {section}
                    </option>
                  );
                })}
              </Form.Select>
            </Form.Group>

            <Form.Group className="m-3 mt-0">
              <Form.Label>Custom Rclone binary path:</Form.Label>
              <InputGroup>
                <Form.Control
                  name="rclonePath"
                  type="text"
                  readOnly
                  value={getField('rclonePath')}
                  onClick={handleFieldChange}
                />
                <Button
                  name="rclonePath"
                  variant="primary"
                  onClick={handleFieldChange}
                >
                  Browse
                </Button>
                <Button
                  variant="info"
                  onClick={() => {
                    shell.openExternal('https://downloads.rclone.org/');
                  }}
                >
                  Download
                </Button>
              </InputGroup>
            </Form.Group>

            <Form.Group className="m-3 mt-0">
              <Form.Label htmlFor="rcloneConfigPath">
                Custom Rclone config path:
              </Form.Label>
              <InputGroup>
                <Form.Control
                  name="rcloneConf"
                  type="text"
                  readOnly
                  value={getField('rcloneConf')}
                  onClick={handleFieldChange}
                />
                <Button
                  name="rcloneConf"
                  variant="primary"
                  onClick={handleFieldChange}
                >
                  Browse
                </Button>
              </InputGroup>
            </Form.Group>

            {platform === 'mac' && (
              <Form.Group className="m-3 mt-0">
                <Form.Label>Mount type:</Form.Label>
                <Form.Select
                  name="mountCmd"
                  value={getField('mountCmd')}
                  onChange={handleFieldChange}
                >
                  <option value="mount">mount</option>
                  <option value="cmount">
                    cmount (supports legacy rclone versions)
                  </option>
                </Form.Select>
              </Form.Group>
            )}

            <Form.Group className="m-3 mt-0" controlId="autoMount">
              <Form.Switch
                name="autoMount"
                className="fs-5"
                label="Automatically mount drive on startup (if not already mounted)"
                checked={getField('autoMount')}
                onChange={handleFieldChange}
              />
            </Form.Group>
          </Card>

          <Card className="mb-2">
            <Card.Header>Main:</Card.Header>
            <Form.Group className="m-3">
              <Form.Label>Custom Scrcpy binary path:</Form.Label>
              <InputGroup>
                <Form.Control
                  name="scrcpyPath"
                  type="text"
                  readOnly
                  value={getField('scrcpyPath')}
                  onClick={handleFieldChange}
                />
                <Button
                  name="scrcpyPath"
                  variant="primary"
                  onClick={handleFieldChange}
                >
                  Browse
                </Button>
                <Button
                  variant="info"
                  onClick={() => {
                    shell.openExternal(
                      'https://github.com/Genymobile/scrcpy/releases/latest'
                    );
                  }}
                >
                  Download
                </Button>
              </InputGroup>
            </Form.Group>

            <Form.Group className="m-3 mt-0">
              <Form.Label>Custom temp directory:</Form.Label>
              <InputGroup>
                <Form.Control
                  name="tmpdir"
                  type="text"
                  readOnly
                  value={getField('tmpdir')}
                  onClick={handleFieldChange}
                />
                <Button
                  name="tmpdir"
                  variant="outline-primary"
                  onClick={handleFieldChange}
                >
                  Browse
                </Button>
              </InputGroup>
            </Form.Group>

            <Form.Group className="m-3 mt-0 mb-0" controlId="allowOtherDevices">
              <Form.Switch
                name="allowOtherDevices"
                className="fs-5"
                label="Allow connections to non-oculus devices"
                checked={getField('allowOtherDevices')}
                onChange={handleFieldChange}
              />
            </Form.Group>

            <Form.Group className="m-3 mt-0 mb-0" controlId="cacheOculusGames">
              <Form.Switch
                name="cacheOculusGames"
                className="fs-5"
                label="Cache Oculus Games when first opened (for faster reopening)"
                checked={getField('cacheOculusGames')}
                onChange={handleFieldChange}
              />
            </Form.Group>

            <Form.Group className="m-3 mt-0" controlId="userHide">
              <Form.Switch
                name="userHide"
                className="fs-5"
                label="Hide user name"
                checked={getField('userHide')}
                onChange={handleFieldChange}
              />
            </Form.Group>
          </Card>

          <Card className="mb-2">
            <Card.Header>Proxy settings EXPERIMENTAL:</Card.Header>
            <Form.Group className="m-3">
              <Form.Label>
                Socks proxy url (for example from
                https://hideip.me/ru/proxy/socks5list):
              </Form.Label>
              <InputGroup>
                <Form.Control
                  name="proxyUrl"
                  type="text"
                  value={getField('proxyUrl')}
                  placeholder="socks://[HOST]:[PORT]"
                  onChange={handleFieldChange}
                />
              </InputGroup>
            </Form.Group>

            <Form.Group className="m-3 mt-0 mb-0" controlId="proxyOculus">
              <Form.Check
                name="proxyOculus"
                type="switch"
                className="fs-5 me-0"
                inline
                checked={getField('proxyOculus')}
                onChange={handleFieldChange}
              />
              <Form.Check.Label>
                <Icon set="si" icon="SiOculus" /> Enable proxy for fetching
                Oculus information
              </Form.Check.Label>
            </Form.Group>

            <Form.Group className="m-3 mt-0 mb-0" controlId="proxySteam">
              <Form.Check
                name="proxySteam"
                type="switch"
                className="fs-5 me-0"
                inline
                checked={getField('proxySteam')}
                onChange={handleFieldChange}
              />
              <Form.Check.Label>
                <Icon set="si" icon="SiSteam" /> Enable proxy for fetching Steam
                information
              </Form.Check.Label>
            </Form.Group>

            <Form.Group className="m-3 mt-0 mb-0" controlId="proxySQ">
              <Form.Check
                name="proxySQ"
                type="switch"
                className="fs-5 me-0"
                inline
                checked={getField('proxySQ')}
                onChange={handleFieldChange}
              />
              <Form.Check.Label>
                <SideQuest width="14" height="14" alt="SideQuest Icon" /> Enable
                proxy for fetching SideQuest information
              </Form.Check.Label>
            </Form.Group>
          </Card>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

SettingsModal.propTypes = {
  closeSettingsModal: PropTypes.func,
  isSettingsModalVisible: PropTypes.func,
};

export default SettingsModal;
