/* global $id,id,ipcRenderer,shell */

// DOM
document.body.addEventListener('load', () => {
  console.log('ONLOAD APPINFO MODAL');

  ipcRenderer.removeAllListeners('app_info');
});

// Electron
const appinfoSlider = $id('appinfoSlider');
$id('appinfoModal').on('hidden.bs.modal', () => {
  console.log('appinfo closed');

  document.querySelector('#appinfoGenres').innerHTML = '';
  document.querySelector('#appinfoModalLabel').innerHTML = '';
  document.querySelector('#appinfoText').innerHTML = '';
  document.querySelector('#appinfoAbout').innerHTML = '';

  appinfoSlider[0].innerHTML = '';

  document.querySelector('#appinfoUrl').hidden = true;
  document.querySelector('#appinfoUrlDev').hidden = true;
  document.querySelector('#appinfoEventsBtn').hidden = true;
  document.querySelector('#appinfoText').classList.remove('text-center');

  $id('supportedLanguages').parent().hide();
});

ipcRenderer.on('app_info', (event, arg) => {
  $id('processingModal').hidden = true;

  console.log('app_info received');

  if (!arg || !arg.success) {
    return;
  }
  console.log(arg);

  const { data } = arg;
  if (!data) {
    return;
  }

  if (data.res === 'steam') {
    $id('appinfoText').addClass('text-center');
  }

  // if (['steam', 'oculus'].includes(data.res)) {
  id('appinfoEventsBtn').onclick = () => {
    $id('processingModal').modal('show');
    ipcRenderer.send('app_events_info', {
      res: data.res,
      package: data.package,
    });
  };

  $id('appinfoEventsBtn').show();

  document.querySelector('#appinfoModalLabel').textContent = data.name || '';
  document.querySelector('#appinfoShortDesc').innerHTML =
    data.short_description || '';
  document.querySelector('#appinfoText').innerHTML =
    data.detailed_description || '';
  document.querySelector('#appinfoAbout').innerHTML = data.about_the_game || '';
  if (data.supported_languages) {
    document.querySelector('#supportedLanguages').innerHTML =
      data.supported_languages
        .replace('русский', '<b>русский</b>')
        .replace('Русский', '<b>Русский</b>');
    document.querySelector('#supportedLanguages').parentNode().show();
  }

  if (data.url) {
    document
      .querySelector('#appinfoUrl')
      .addEventListener('click', () => shell.openExternal(data.url));

    document.querySelector('#appinfoUrl').hidden = false;
    if (data.res !== 'steam') {
      document
        .querySelector('#appinfoUrlDev')
        .addEventListener('click', () =>
          ipcRenderer.send('dev_open_url', data.url)
        );

      document.querySelector('#appinfoUrlDev').hidden = false;
    }
  }

  if (data.genres) {
    for (const genre of data.genres) {
      const genreText = genre.description || genre;
      if (['Бесплатно', 'Free'].includes(genreText)) {
        continue;
      }
      $id('appinfoGenres').append(
        `<span class="badge badge-secondary">${genreText}</span> `
      );
    }
  }

  let slides = '<ul>';
  if (data.header_image) {
    slides += `<li><img src="${data.header_image}" width="800" style="max-height: 405px;" alt="header"/></li>`;
  }

  if (data.movies) {
    for (const movie of data.movies) {
      if (!movie.mp4) {
        continue;
      }
      slides += `<li><video width="800" style="max-height: 405px;" controls><source src="${movie.mp4['480']}" type="video/mp4"></video></li>`;
    }
  }

  if (data.youtube) {
    for (const link of data.youtube) {
      slides += `<li><iframe width="800" height="405" src="${link}" frameborder="0" allowfullscreen></iframe></li>`;
    }
  }

  if (data.screenshots) {
    for (const screenshot of data.screenshots) {
      slides += `<li><img src="${screenshot.path_thumbnail}" width="800" style="max-height: 405px;" alt="screenshot_${screenshot.id}" /></li>`;
    }
  }

  slides += '</ul>';

  appinfoSlider[0].innerHTML = slides;
  appinfoSlider.cbpFWSlider({ current: 0 });
  $id('appinfoModal').modal('show');
});
