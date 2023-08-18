import { BrowserWindow } from 'electron';

declare global {
  var adbDevice: boolean;
  var arch: string;
  var currentConfiguration: {
    lastIp?: string;
  };
  var endOfLine: string;
  var hash_alg: string;
  var homedir: string;
  var installedApps: Array<any>;
  var locale: string;
  var logLevel: string;
  var mounted: boolean;
  var notify: any;
  var platform: string;
  var rcloneSections: Array<string>;
  var repository: string;
  var repositoryapi: string;
  var repositoryraw: string;
  var sidenoderHome: string;
  var tmpdir: string;
  var mountFolder: string;
  var updateAvailable: boolean;
  var win: BrowserWindow;
}

export {};
