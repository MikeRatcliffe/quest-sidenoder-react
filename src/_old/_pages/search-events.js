/* global $,$id,calcSearchTop,id,openSearch,search */

// DOM
document.addEventListener('keydown', (e) => {
  if (e.ctrlKey && e.code === 'KeyF') {
    openSearch();
  }
});

window.addEventListener('resize', () => {
  const navPanel = id('nav-panel');
  if (!navPanel) {
    if (!search) {
      return;
    }
    search.destroy();
    // eslint-disable-next-line no-global-assign
    search = null;
    return;
  }

  navPanel.style.top = `${$id('topbar').height()}px`; // fix navbar position

  if (!search) {
    return;
  }
  $('.find-box')[0].style.top = `${calcSearchTop()}px`;
});
