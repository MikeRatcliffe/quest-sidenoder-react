/* global $,$id,id,remote */
/* eslint-disable @typescript-eslint/no-unused-vars */

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { FindInPage } = require('electron-find');
let search = false;

function calcSearchTop() {
  return $id('topbar').height() + 52;
}

function openSearch() {
  if (search) {
    // search.update();
    // search.openFindWindow();
    // return;
    search.destroy();
    search = null;
  }

  const parentElement = id('listTable');
  if (!parentElement) {
    return;
  }

  search = new FindInPage(remote.getCurrentWebContents(), {
    // parentElement,
    duration: 1,
    offsetTop: calcSearchTop(),
    offsetRight: 20,
    boxBgColor: '#272b30',
    boxShadowColor: '#000',
    inputColor: '#aaa',
    inputBgColor: '#222',
    inputFocusColor: '#555',
    textColor: '#aaa',
    textHoverBgColor: '#555',
    caseSelectedColor: '#555',
  });

  search.openFindWindow();
}

function sortBy(key, asc) {
  return (a, b) => {
    const valA = $(a).data(key);
    const valB = $(b).data(key);

    if (valA < valB) {
      return asc ? -1 : 1;
    }

    if (valA > valB) {
      return asc ? 1 : -1;
    }

    return 0;
  };
}

function sortItems(key, asc) {
  sortElements($id('browseCardBody'), key, asc);
  sortElements($id('listTable'), key, asc);
  $id('searchdropdownmenu').hide();
}

function sortElements(el, key, asc) {
  el.html(el.find('.listitem').sort(sortBy(key, asc)));
}
