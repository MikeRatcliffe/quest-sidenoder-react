/* eslint-disable @typescript-eslint/no-unused-vars */

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
