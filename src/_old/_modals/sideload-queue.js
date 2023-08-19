/* global $id */
/* eslint-disable no-bitwise */
/* eslint-disable @typescript-eslint/no-unused-vars */

function showQueue() {
  $id('sideloadQueueModal').modal('show');
}

function hash(s) {
  const r = s
    .split('')
    .reduce((a, b) => ((a << 5) - a + b.charCodeAt(0)) | 0, 0)
    .toString(18);
  return r < 0 ? `m${Math.abs(r)}` : r;
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
function sideloadAddQueue() {}

function badgeState(badge, text) {
  badge.text(text);
  if (!badge.hasClass('badge-warning')) {
    return;
  }

  let state = '';
  if (text === 'done') {
    state = 'success';
  } else if (text === 'skip') {
    state = 'secondary';
  } else if (text === 'fail') {
    state = 'danger';
  } else if (text.includes('/')) {
    const parts = text.split('/');

    if (parts[0] === parts[1]) {
      state = 'success';
    } else {
      return;
    }
  } else {
    return;
  }

  badge.removeClass('badge-warning').addClass(`badge-${state}`);
}
