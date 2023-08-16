/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
const path = require('path');
const { app, BrowserWindow, shell, Notification } = require('electron');
const { EOL, platform, arch, homedir, tmpdir } = require('os');
const { autoUpdater } = require('electron-updater');
const log = require('electron-log/main');

const isDev =
  process.env.NODE_ENV !== undefined && process.env.NODE_ENV === 'development';
const isProd = process.env.NODE_ENV === 'production';
const isDebug = isDev || process.env.DEBUG_PROD === 'true';
const startMinimized = process.env.START_MINIMIZED;

let win = null;

const installExtension = require('electron-devtools-installer').default;
const { REACT_DEVELOPER_TOOLS } = require('electron-devtools-installer');

const MenuBuilder = require('./utils/menu');
const resolveHtmlPath = require('./utils/utils');

class AppUpdater {
  constructor() {
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

app.disableHardwareAcceleration();

global.adbDevice = false;
global.arch = arch();
global.close = false;
global.currentConfiguration = {};
global.endOfLine = EOL;
global.hash_alg = 'sha256';
global.homedir = homedir().replace(/\\/g, '/');
global.installedApps = [];
global.locale = 'en-US';
global.logLevel = isDev ? 'silly' : 'error';
global.mounted = false;
global.notify = (title, body, urgency = 'normal') => {
  const notification = new Notification({
    title,
    body,
    // icon: 'build/icon.png',
    urgency, // 'normal' | 'critical' | 'low'
  });
  notification.show();
};
global.platform = platform().replace('32', '').replace('64', '');
global.rcloneSections = [];
global.repository = 'https://github.com/MikeRatcliffe/quest-sidenoder-react';
global.repositoryapi = 'https://api.github.com/repos/MikeRatcliffe';
global.repositoryraw = 'https://raw.githubusercontent.com/MikeRatcliffe';
global.sidenoderHome = path
  .join(global.homedir, 'sidenoder')
  .replace(/\\/g, '/');
global.tmpdir = tmpdir().replace(/\\/g, '/');
global.mountFolder = path.join(global.tmpdir, 'mnt').replace(/\\/g, '/');
global.updateAvailable = false;

if (global.platform === 'darwin') {
  global.platform = 'mac';
}

// This group of requires need access to at least one `global.<somevar>`, which
// are assigned above.
const { checkVersion } = require('./utils/versioncheck');
const tools = require('./utils/tools');
const { addIPCMainListeners } = require('./utils/addIPCMainListeners');
addIPCMainListeners();

// Clear console on startup... useful for debugging
// process.stdout.write('\u001b[3J\u001b[1J');
// console.clear();

if (isProd) {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

if (isDebug) {
  require('electron-debug')();
}

const createWindow = async () => {
  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths) => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  win = new BrowserWindow({
    width: 1000,
    minWidth: 920,
    height: 800,
    icon: getAssetPath('icon.png'),
    minHeight: 500,
    title: 'Quest Sidenoder',
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
      contextIsolation: false,
      sandbox: false,
    },
  });

  global.win = win;
  require('@electron/remote/main').initialize();
  require('@electron/remote/main').enable(win.webContents);

  win.maximize(true);

  try {
    await tools.getDeviceSync();
  } catch (e) {
    console.error('tools.getDeviceSync() failed', e);
  }

  win.loadURL(resolveHtmlPath('index.html'));

  if (process.argv[2] === '--dev') {
    win.webContents.openDevTools();
  }

  setTimeout(checkVersion, 3000);

  win.on('ready-to-show', () => {
    if (!win) {
      throw new Error('"mainWindow" is not defined');
    }
    if (startMinimized) {
      win.minimize();
    } else {
      win.show();
    }
    // Open the DevTools automatically if developing
    if (isDev) {
      win.webContents.openDevTools();
    }
  });

  win.on('closed', () => {
    win = null;
  });

  const menuBuilder = new MenuBuilder(win);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  win.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('activate', () => {
  console.log(`app.on('activate') fired`);
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow();
  }
});

app.on('ready', async () => {
  console.log(`app.on('ready') fired`);
  if (isDebug) {
    await installExtension(REACT_DEVELOPER_TOOLS)
      .then((name) => console.log(`Added Extension:  ${name}`))
      .catch((err) => console.log('An error occurred: ', err));
  }
});

app.on('window-all-closed', () => {
  console.log(`app.on('window-all-closed') fired`);
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// eslint-disable-next-line no-floating-promise/no-floating-promise
(async function startApp() {
  try {
    await tools.reloadConfig();
  } catch (e) {
    console.error('tools.reloadConfig() failed', e);
  }

  // DEFAULT
  await app.whenReady();
  global.locale = app.getLocale();
  await createWindow();
})();
