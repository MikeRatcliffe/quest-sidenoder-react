/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import { EOL, platform, arch, homedir, tmpdir } from 'os';
import * as remoteMain from '@electron/remote/main';
import {
  app,
  BrowserWindow,
  Notification,
  NotificationConstructorOptions,
  shell,
} from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import installExtension, {
  REACT_DEVELOPER_TOOLS,
} from 'electron-devtools-installer';
import sourceMapSupport from 'source-map-support';
import electronDebug from 'electron-debug';
import MenuBuilder from './utils/menu';
import { resolveHtmlPath } from './utils/utils';

const isDev =
  process.env.NODE_ENV !== undefined && process.env.NODE_ENV === 'development';
const isProd = process.env.NODE_ENV === 'production';
const isDebug = isDev || process.env.DEBUG_PROD === 'true';
const startMinimized = process.env.START_MINIMIZED;

let mainWindow: BrowserWindow | null = null;

class AppUpdater {
  constructor() {
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

app.disableHardwareAcceleration();

global.adbDevice = false;
global.arch = arch();
// global.close = false;
global.currentConfiguration = {};
global.endOfLine = EOL;
global.hash_alg = 'sha256';
global.homedir = homedir().replace(/\\/g, '/');
global.installedApps = [];
global.locale = 'en-US';
global.logLevel = isDev ? 'silly' : 'error';
global.mounted = false;
global.notify = (
  title: string,
  body: string,
  urgency: 'normal' | 'critical' | 'low' = 'normal'
) => {
  const options: NotificationConstructorOptions = {
    title,
    body,
    urgency, // 'normal' | 'critical' | 'low'
  };
  const notification = new Notification(options);
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

/* eslint-disable import/first */
// This group of requires need access to at least one `global.<somevar>`, which
// are assigned above.
import checkVersion from './utils/versioncheck';
import addIPCMainListeners from './utils/addIPCMainListeners';
import tools from './utils/tools';
/* eslint-enable import/first */

addIPCMainListeners();

// Clear console on startup... useful for debugging
// process.stdout.write('\u001b[3J\u001b[1J');
// console.clear();

if (!isProd) {
  sourceMapSupport.install();
}

if (isDebug) {
  electronDebug();
}

const createWindow = async () => {
  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    width: 1000,
    height: 800,
    minWidth: 920,
    minHeight: 500,
    icon: getAssetPath('icon.png'),
    title: 'Quest Sidenoder',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      sandbox: false,
    },
  });

  global.win = mainWindow;

  remoteMain.initialize();
  remoteMain.enable(mainWindow.webContents);

  mainWindow.maximize();

  try {
    await tools.getDeviceSync();
  } catch (e) {
    console.error('tools.getDeviceSync() failed', e);
  }

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  if (process.argv[2] === '--dev') {
    mainWindow.webContents.openDevTools();
  }

  setTimeout(checkVersion, 3000);

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (startMinimized) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
    // Open the DevTools automatically if developing
    if (isDev) {
      mainWindow.webContents.openDevTools();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
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
  if (mainWindow === null) {
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
