const { ipcMain } = require('electron');

const tools = require('./tools');

const addIPCMainListeners = () => {
  ipcMain.on('get_installed', async (event) => {
    console.log('get_installed received');
    const apps = await tools.getInstalledApps();

    console.log('get_installed', apps.length);

    event.reply('get_installed', { success: true, apps });
  });

  ipcMain.on('get_installed_with_updates', async (event) => {
    console.log('get_installed_with_updates received');
    const apps = await tools.getInstalledAppsWithUpdates();

    console.log('get_installed_with_updates', apps.length);

    event.reply('get_installed_with_updates', { success: true, apps });
  });

  ipcMain.on('get_device_info', async (event) => {
    await getDeviceInfo(event);
  });

  async function getDeviceInfo(event) {
    console.log('get_device_info received');
    const res = await tools.getDeviceInfo();

    event.reply('get_device_info', res);
    return;
  }

  ipcMain.on('connect_wireless', async (event) => {
    console.log('connect_wireless received');
    if (!global.adbDevice && !global.currentConfiguration.lastIp) {
      console.log('Missing device, sending ask_device');
      event.reply('connect_wireless', { success: false });
      event.reply('ask_device', '');
      return;
    }

    const ip = await tools.connectWireless();
    event.reply('connect_wireless', { success: !!ip, ip });
  });

  ipcMain.on('disconnect_wireless', async (event) => {
    console.log('disconnect_wireless received');
    const res = await tools.disconnectWireless();
    event.reply('connect_wireless', { success: !res });
  });

  ipcMain.handle('check_deps', async (event, arg) => {
    console.log('check_deps received', arg);
    const res = await tools.checkDeps(arg);
    return res;
  });

  ipcMain.on('mount', async (event) => {
    console.log('XXXXX on mount');
    await tools.mount();
    setTimeout(() => checkMount(event), 1000);
  });

  ipcMain.on('check_mount', async (event) => {
    await checkMount(event);
  });

  let rcloneProgress = false;
  async function checkMount(event) {
    await tools.checkMount();
    event.reply('check_mount', { success: global.mounted });
    if (global.mounted && !rcloneProgress) {
      tools.updateRcloneProgress();
      rcloneProgress = true;
    }
  }

  ipcMain.on('start_sideload', async (event, arg) => {
    console.log('start_sideload received');
    if (!global.adbDevice) {
      console.log('Missing device, sending ask_device');
      event.reply('ask_device', '');
      return;
    }

    event.reply('start_sideload', { success: true, path: arg.path });
    await tools.sideloadFolder(arg);
    await getDeviceInfo(event);
  });

  ipcMain.on('folder_install', async (event, { path, update }) => {
    console.log('folder_install received', path);

    if (!global.adbDevice) {
      console.log('Missing device, sending ask_device');
      event.reply('ask_device', '');
      return;
    }

    const install = await tools.getApkFromFolder(path);
    console.log({ install });
    event.reply('ask_sideload', { success: true, install, update });
  });

  ipcMain.on('filedrop', async (event, path) => {
    console.log('filedrop received');
    if (!global.adbDevice) {
      console.log('Missing device, sending ask_device');
      event.reply('ask_device', '');
      return;
    }

    // TODO: check isApk

    event.reply('ask_sideload', { success: true, install: { path } });
  });

  ipcMain.on('reset_cache', async (event, arg) => {
    await tools.resetCache(arg);
  });

  ipcMain.on('get_dir', async (event, arg) => {
    console.log('get_dir received', arg);
    if (typeof arg === 'string' && arg.endsWith('.apk')) {
      const install = {
        path: arg,
      };
      const lastslashindex = install.path.lastIndexOf('/');
      const folder = install.path.substring(0, lastslashindex);

      install.install_desc = await tools.detectInstallTxt(folder);
      install.notes = await tools.detectNoteTxt(folder);

      event.reply('ask_sideload', { success: true, install }); // TODO: install_desc
      return;
    }

    // if only 1 apk inside, send straight to there

    const folder = arg || global.homedir;

    const list = await tools.getDir(folder);

    const dirList = [];
    let incList = [];
    const notSupported = [];
    if (!list) {
      incList = [{ name: 'ERROR: Browse failed' }];
    } else {
      for (const item of list) {
        if (!item.isFile) {
          dirList.push(item);
          continue;
        }

        if (item.name.endsWith('.apk') || item.name.endsWith('.obb')) {
          incList.push(item);
          continue;
        }

        notSupported.push(item);
      }
    }

    const response = {};
    response.success = true;
    response.list = dirList.concat(incList, notSupported);
    response.path = folder;
    // console.log(response.list, response.list.length, incList.length, notSupported.length);
    global.win.webContents.send('get_dir', response);
    // event.reply('get_dir', response)
  });

  ipcMain.on('enable_mtp', async (event) => {
    console.log('enable_mtp received');
    if (!global.adbDevice) {
      console.log('Missing device, sending ask_device');
      event.reply('ask_device', '');
      return;
    }

    try {
      const res = await tools.enableMTP();
      event.reply('cmd_sent', { success: res });
    } catch (err) {
      event.reply('cmd_sent', { success: err });
    }
  });

  ipcMain.on('scrcpy_start', async (event) => {
    console.log('scrcpy_start received');
    if (!global.adbDevice) {
      console.log('Missing device, sending ask_device');
      event.reply('ask_device', '');
      return;
    }

    const res = await tools.startSCRCPY();
    console.log('startSCRCPY', res);
    event.reply('scrcpy_start', { success: !!res });
  });

  ipcMain.on('reboot_device', async (event) => {
    console.log('reboot_device received');
    if (!global.adbDevice) {
      console.log('Missing device, sending ask_device');
      event.reply('ask_device', '');
      return;
    }

    try {
      const res = await tools.rebootDevice();
      event.reply('cmd_sent', { success: res });
    } catch (err) {
      event.reply('cmd_sent', { success: err });
    }
  });

  ipcMain.on('reboot_recovery', async (event) => {
    console.log('reboot_recovery received');
    if (!global.adbDevice) {
      console.log('Missing device, sending ask_device');
      event.reply('ask_device', '');
      return;
    }

    try {
      const res = await tools.rebootRecovery();
      event.reply('cmd_sent', { success: res });
    } catch (err) {
      event.reply('cmd_sent', { success: err });
    }
  });

  ipcMain.on('reboot_bootloader', async (event) => {
    console.log('reboot_bootloader received');
    if (!global.adbDevice) {
      console.log('Missing device, sending ask_device');
      event.reply('ask_device', '');
      return;
    }

    try {
      const res = await tools.rebootBootloader();
      event.reply('cmd_sent', { success: res });
    } catch (err) {
      event.reply('cmd_sent', { success: err });
    }
  });
  ipcMain.on('sideload_update', async (event, arg) => {
    console.log('sideload_update received');
    if (!global.adbDevice) {
      console.log('Missing device, sending ask_device');
      event.reply('ask_device', '');
      return;
    }

    if (!arg) {
      console.log('update.zip not defined');
      event.reply('cmd_sent', { success: 'Update.zip path not defined' });
      return;
    }

    try {
      const res = await tools.sideloadFile(arg);
      event.reply('cmd_sent', { success: res });
    } catch (err) {
      event.reply('cmd_sent', { success: err });
    }
  });

  ipcMain.on('device_tweaks', async (event, arg) => {
    console.log('device_tweaks received', arg);

    if (arg.cmd === 'get') {
      const res = await tools.deviceTweaksGet(arg);
      event.reply('device_tweaks', res);
    }

    if (arg.cmd === 'set') {
      if (!global.adbDevice) {
        console.log('Missing device, sending ask_device');
        event.reply('ask_device', '');
        return;
      }

      await tools.deviceTweaksSet(arg);
      event.reply('device_tweaks', arg);
    }
  });

  ipcMain.on('uninstall', async (event, arg) => {
    console.log('uninstall received');
    await tools.uninstall(arg);
    event.reply('uninstall', { success: true });
    await getDeviceInfo(event);
  });

  ipcMain.on('get_activities', async (event, arg) => {
    console.log('get_activities received', arg);
    const activities = await tools.getActivities(arg);
    event.reply('get_activities', { success: !!activities, activities });
  });
  ipcMain.on('start_activity', async (event, arg) => {
    console.log('start_activity received', arg);
    const resp = await tools.startActivity(arg);
    event.reply('start_activity', { success: !!resp });
  });
  ipcMain.on('start_app', async (event, arg) => {
    console.log('start_app received', arg);
    const activity = await tools.getLaunchActivity(arg);
    const resp = await tools.startActivity(activity);
    event.reply('start_app', { success: !!resp });
  });
  ipcMain.on('dev_open_url', async (event, arg) => {
    console.log('dev_open_url received', arg);
    const resp = await tools.devOpenUrl(arg);
    event.reply('dev_open_url', { success: !!resp });
  });

  ipcMain.on('change_config', async (event, { key, val }) => {
    console.log('change_config received', { key, val });
    val = await tools.changeConfig(key, val);
    event.reply('change_config', { success: true, key, val });
  });

  ipcMain.on('app_config_set', async (event, { pkg, key, val }) => {
    console.log('change_config received', { pkg, key, val });
    const res = await tools.changeAppConfig(pkg, key, val);
    event.reply('app_config_set', res);
  });

  ipcMain.on('app_info', async (event, arg) => {
    console.log('app_info received', arg);
    const res = await tools.appInfo(arg);
    // console.log({ res });
    event.reply('app_info', res);
  });

  ipcMain.on('app_events_info', async (event, arg) => {
    console.log('app_events_info received', arg);
    const res = await tools.appInfoEvents(arg);
    // console.log({ res });
    event.reply('app_events_info', res);
  });

  ipcMain.on('app_tools', async (event, arg) => {
    console.log('app_tools received', arg);
    const resp = await tools.checkAppTools(arg);
    event.reply('app_tools', resp);
  });

  ipcMain.on('app_backup', async (event, arg) => {
    console.log('app_backup received', arg);
    const resp = await tools.backupApp(arg);
    event.reply('app_backup', { success: resp });
  });
  ipcMain.on('data_backup', async (event, arg) => {
    console.log('data_backup received', arg);
    const resp = await tools.backupAppData(arg);
    event.reply('data_backup', { success: resp });
  });
  ipcMain.on('data_restore', async (event, arg) => {
    console.log('data_restore received', arg);
    const resp = await tools.restoreAppData(arg);
    event.reply('data_restore', { success: resp });
  });
};

module.exports = { addIPCMainListeners };
