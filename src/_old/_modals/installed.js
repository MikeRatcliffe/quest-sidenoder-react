/* global $id,id,ipcRenderer,loadInclude */
/* eslint-disable @typescript-eslint/no-unused-vars */

function getUpdates() {
  $id('processingModal').modal('show');
  ipcRenderer.send('get_installed_with_updates', '');
}

function update(elem) {
  elem.innerHTML = `<i class="fa fa-refresh fa-spin"></i> Please wait`;
  ipcRenderer.send('folder_install', { path: elem.dataset.path, update: true });
}

function uninstall(elem, packageName) {
  elem.innerHTML = `<i class="fa fa-refresh fa-spin"></i> Please wait`;
  ipcRenderer.send('uninstall', packageName);
}

function startApp(packageName) {
  ipcRenderer.send('start_app', packageName);
  // ipcRenderer.send('get_activities', packageName);
}

function sortApps(key, asc) {
  const suffix = asc ? '' : '-desc';
  sortAppElements($id('intalledTable'), key, asc);
  $id('appmodaldropdownmenu').hide();
  ipcRenderer.send('change_config', { key: 'sortApps', val: key + suffix });
}

function sortAppElements(el, key, asc) {
  const sortByName = key.startsWith('simplename');
  el.html(
    el.find('tr').sort((a, b) => {
      const valA = (
        sortByName ? a.dataset.simplename : a.dataset.packagename
      ).toLowerCase();
      const valB = (
        sortByName ? b.dataset.simplename : b.dataset.packagename
      ).toLowerCase();
      if (valA < valB) {
        return asc ? -1 : 1;
      }
      if (valA > valB) {
        return asc ? 1 : -1;
      }
      return 0;
    })
  );
}

function appTools(packageName) {
  $id('processingModal').modal('show');
  loadInclude('modals/app_tools.twig', 'apptoolsmodaldiv', () => {
    ipcRenderer.send('app_tools', packageName);
  });
}

function drawInstalledApps(apps, updates = false) {
  console.log('drawInstalledApps', apps.length);

  if (updates && apps.length === 0) {
    const row = `<tr><td class="text-center" style="width: 250px;vertical-align:middle;"><div class="alert alert-info mb-0"><i class="fa fa-info-circle"></i> <b>There are no updates available</b></div></td></tr>`;
    id('intalledTable').innerHTML = row;
    return;
  }

  let rows = '';

  for (const app of apps) {
    let row = `<tr data-simplename="${app.simpleName}" data-packagename="${app.packageName}"><td class="text-center" style="width: 250px;vertical-align:middle;"><img style="max-height:80px" src="${app.imagePath}"/></td>
      <td style="vertical-align:middle;font-weight: bolder; font-size: large">${app.simpleName}
      <br/><small>${app.packageName}<br/>VersionCode: ${app.versionCode}</small></td><td style="vertical-align:middle;">`;

    if (!app.update) {
      row += `<a onclick="startApp('${app.packageName}')" class="adbdev btn btn-md btn-info" title="Launch"><i class="fa fa-play"></i></a> `;
      row += `<a onclick="uninstall(this, '${app.packageName}')" class="adbdev btn btn-md btn-danger" title="Uninstall"><i class="fa fa-trash-o"></i></a> `;
      row += `<a onclick="appTools('${app.packageName}')" class="adbdev btn btn-md btn-primary"> <i class="fa fa-cog"></i> Tools</a> `;
    } else {
      row += `<a data-path="${app.update.path}" onclick='update(this)' class="btn btn-sm btn-info">
        <i class="fa fa-upload"></i> Update to
        <br/> v.${app.update.versionCode}
        <br/> ${app.update.size} Mb</a>`;
    }

    row += `<td></tr>`;
    rows += row;
  }

  id('intalledTable').innerHTML = rows;
}
