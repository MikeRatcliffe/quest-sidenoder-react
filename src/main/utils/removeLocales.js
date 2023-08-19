// https://www.electron.build/configuration/configuration#afterpack

import fs from 'fs';

const LOCALES = ['en-US.pak', 'ru.pak'];

export default async (context) => {
  // console.log(context);
  const localeDir = `${context.appOutDir}/locales/`;

  fs.readdir(localeDir, (err, files) => {
    // files is array of filenames (basename form)
    if (!(files && files.length)) {
      return;
    }
    for (const file of files) {
      if (LOCALES.includes(file)) {
        continue;
      }
      fs.unlinkSync(localeDir + file);
    }
  });
};
