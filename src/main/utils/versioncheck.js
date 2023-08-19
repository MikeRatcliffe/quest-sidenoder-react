import fetch from 'node-fetch';
import compareVersions from 'compare-versions';
import pkgJson from '../../../package.json';

global.version = pkgJson.version;

async function checkVersion() {
  try {
    const res = await fetch(
      `${global.repositoryapi}/quest-sidenoder-react/releases/latest`
    );
    if (res.status !== 200) {
      return;
    }
    const content = JSON.parse(await res.text());
    const remoteversion = content.name;

    console.log(`Current version: ${pkgJson.version}`);
    console.log(`Github version: ${remoteversion}`);
    if (!remoteversion) {
      return;
    }

    if (compareVersions.compare(remoteversion, pkgJson.version, '<=')) {
      console.log('Using latest version');
    } else {
      console.log('Requires update');
      global.win.webContents.send('notify_update', {
        success: true,
        current: pkgJson.version,
        remote: remoteversion,
        url: content.html_url,
        description: content.body,
      });
    }
  } catch (err) {
    console.error('checkVersion.Fail', err);
  }
}

export default checkVersion;
