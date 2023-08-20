import { useEffect, useState } from 'react';
import { Button, Card, Table } from 'react-bootstrap';
import AdbBlock from './AdbBlock';
import RcloneBlock from './RcloneBlock';
import ScrCpyBlock from './ScrCpyBlock';
import ZipBlock from './ZipBlock';
import Icon from '../shared/icon';

const { ipcRenderer } = window.require('electron');

const remote = window.require('@electron/remote');
const { shell } = remote;
const platform = remote.getGlobal('platform');
const arch = remote.getGlobal('arch');
const tmpdir = remote.getGlobal('tmpdir');
const mountFolder = remote.getGlobal('mountFolder');
const sidenoderHome = remote.getGlobal('sidenoderHome');

function SystemCheck() {
  const [adb, setAdb] = useState(null);
  const [rclone, setRclone] = useState(null);
  const [zip, setZip] = useState(null);
  const [scrcpy, setScrcpy] = useState(null);

  useEffect(() => {
    // eslint-disable-next-line no-floating-promise/no-floating-promise
    console.log('ONLOAD SYSTEMCHECK START');
    console.log('sending check_deps');

    ipcRenderer.removeAllListeners('check_deps');
    ipcRenderer.on('check_deps', (event, res) => {
      console.log('check_deps msg arrived:', res);

      const {
        adb: resAdb,
        rclone: resRclone,
        zip: resZip,
        scrcpy: resScrcpy,
      } = res;

      if (resAdb) {
        setAdb(resAdb);
      }
      if (resRclone) {
        setRclone(resRclone);
      }
      if (resZip) {
        setZip(resZip);
      }
      if (resScrcpy) {
        setScrcpy(resScrcpy);
      }
    });

    ipcRenderer.send('check_deps', 'adb');
    ipcRenderer.send('check_deps', 'rclone');
    ipcRenderer.send('check_deps', 'zip');
    ipcRenderer.send('check_deps', 'scrcpy');

    console.log('ONLOAD SYSTEMCHECK END');
  }, []);

  return (
    <Card>
      <Card.Header>
        <Icon set="fa" icon="FaList" size="sm" /> System Check
      </Card.Header>
      <Card.Body className="fs-5">
        <Table borderless hover size="sm" className="fit-first-column">
          <tbody>
            <tr>
              <th>Platform:</th>
              <td>
                {platform} {arch}
              </td>
            </tr>
            <tr>
              <th>Sidenoder Dir:</th>
              <td>
                {sidenoderHome}{' '}
                <Button
                  size="sm"
                  variant="outline-secondary"
                  onClick={() => shell.openPath(sidenoderHome)}
                >
                  <Icon set="fa" icon="FaHome" size="2xl" />
                </Button>
              </td>
            </tr>
            <tr>
              <th>Temp Dir:</th>
              <td>{tmpdir}</td>
            </tr>
            <tr>
              <th>Mount Dir:</th>
              <td>{mountFolder}</td>
            </tr>
          </tbody>
        </Table>
        <AdbBlock adb={adb} />
        <RcloneBlock rclone={rclone} />
        <ZipBlock zip={zip} />
        <ScrCpyBlock scrcpy={scrcpy} />
      </Card.Body>
    </Card>
  );
}

export default SystemCheck;