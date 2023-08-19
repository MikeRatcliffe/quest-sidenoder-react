/* eslint-disable @typescript-eslint/no-unused-vars */

function copyInput(el) {
  el.select();
  document.execCommand('copy');
  alert('Text copied to clipboard');
}

function backToTop() {
  document.documentElement.scrollTop = 0;
}

function formatEta(seconds) {
  if (seconds == null) {
    return 'Starting...';
  }

  const hours = Math.floor(seconds / 3600);
  seconds -= hours * 3600;
  const minutes = Math.floor(seconds / 60);
  seconds -= minutes * 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m ${seconds}s`;
  }

  if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  }

  return `${seconds}s`;
}

function formatBytes(bytes) {
  const sizes = ['b', 'Kb', 'Mb', 'Gb', 'Tb'];
  if (bytes === 0) {
    return '0 b';
  }

  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10);
  return `${(bytes / 1024 ** i).toFixed(2)} ${sizes[i]}`;
}
