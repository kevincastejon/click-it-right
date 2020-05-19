// Import parts of electron to use
const path = require('path');
const fs = require('fs').promises;
const superagent = require('superagent');

const options = {
  client_id: '5e7f0fb49300fe721034',
  client_secret: 'bc06c610e243021b3773c8a92191c65585990a49',
  scopes: ['public_repo'], // Scopes limit access for OAuth tokens.
};

const regedit = require('regedit');
const {
  ipcMain, app, BrowserWindow, Menu,
} = require('electron');

const vbsDirectory = path.join(path.dirname(app.getPath('exe')), './resources/wsf');
regedit.setExternalVBSLocation(vbsDirectory);

const url = require('url');

async function listReg(key) {
  return new Promise((res, rej) => {
    regedit.list([key], (err, result) => {
      if (err) {
        rej(err);
      } else {
        res(result);
      }
    });
  });
}
async function addReg(key) {
  return new Promise((res, rej) => {
    regedit.createKey([key], (err, result) => {
      if (err) {
        rej(err);
      } else {
        res(result);
      }
    });
  });
}
async function putReg(obj) {
  return new Promise((res, rej) => {
    regedit.putValue(obj, (err, result) => {
      if (err) {
        rej(err);
      } else {
        res(result);
      }
    });
  });
}
async function delReg(key) {
  return new Promise((res, rej) => {
    regedit.deleteKey(key, (err, result) => {
      if (err) {
        rej(err);
      } else {
        res(result);
      }
    });
  });
}

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
const template = [
  {
    label: 'File',
    submenu: [
      {
        label: 'Open',
        click: () => mainWindow.webContents.send('open'),
      },
      {
        type: 'separator',
      },
      {
        role: 'Quit',
      },
    ],
  },
];
const menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);

// Keep a reference for dev mode
let dev = false;
if (process.defaultApp || /[\\/]electron-prebuilt[\\/]/.test(process.execPath) || /[\\/]electron[\\/]/.test(process.execPath)) {
  dev = true;
}

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1024,
    minWidth: 900,
    height: 768,
    minHeight: 600,
    show: false,
    title: 'Click-it right!',
    webPreferences: {
      nodeIntegration: true,
    },
  });

  // and load the index.html of the app.
  let indexPath;
  if (dev && process.argv.indexOf('--noDevServer') === -1) {
    indexPath = url.format({
      protocol: 'http:',
      host: 'localhost:8080',
      pathname: 'index.html',
      slashes: true,
    });
  } else {
    indexPath = url.format({
      protocol: 'file:',
      pathname: path.join(__dirname, 'output', 'index.html'),
      slashes: true,
    });
  }
  mainWindow.loadURL(indexPath);

  // Don't show until we are ready and loaded
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    // Open the DevTools automatically if developing
    if (dev) {
      mainWindow.webContents.openDevTools();
    }
  });

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });

  const types = {
    dir: 'HKCR\\DIRECTORY\\shell',
    dirBkg: 'HKCR\\DIRECTORY\\Background\\shell',
    file: 'HKCR\\*\\shell',
    desk: 'HKCR\\DesktopBackground\\shell',
  };
  const typeArr = [
    'dir',
    'dirBkg',
    'file',
    'desk',
  ];

  const keyPaths = [
    'HKCR\\DIRECTORY\\shell',
    'HKCR\\DIRECTORY\\Background\\shell',
    'HKCR\\*\\shell',
    'HKCR\\DesktopBackground\\shell',
  ];

  // Add your IPC listeners here
  async function ensureDir() {
    fs.stat(path.resolve(app.getPath('userData'), 'icons')).catch(async () => {
      await fs.mkdir(path.resolve(app.getPath('userData'), 'icons'));
    });
  }
  async function addKey(type, key) {
    await addReg(`${types[type]}\\REGCJS_${key.name}\\command`);
    const newKey = { };
    newKey[`${types[type]}\\REGCJS_${key.name}`] = {};
    newKey[`${types[type]}\\REGCJS_${key.name}`].qzd = {
      value: key.label,
      type: 'REG_DEFAULT',
    };
    newKey[`${types[type]}\\REGCJS_${key.name}`].Icon = {
      value: key.icon ? path.resolve(app.getPath('userData'), 'icons', `${key.name}.ico`) : '',
      type: 'REG_SZ',
    };
    newKey[`${types[type]}\\REGCJS_${key.name}`].description = {
      value: key.description,
      type: 'REG_SZ',
    };
    await putReg(newKey);
    const newCmdKey = { };
    newCmdKey[`${types[type]}\\REGCJS_${key.name}\\command`] = {};
    newCmdKey[`${types[type]}\\REGCJS_${key.name}\\command`].qzd = {
      value: key.command,
      type: 'REG_DEFAULT',
    };
    await putReg(newCmdKey);
  }
  async function addAllKeys(key) {
    if (key.icon) {
      const iconBase = key.icon.split(';base64,').pop();
      await fs.writeFile(path.resolve(app.getPath('userData'), 'icons', `${key.name}.ico`), iconBase, { encoding: 'base64' });
    }
    if (key.dirEnv) {
      await addKey('dir', key);
    }
    if (key.dirBkgEnv) {
      await addKey('dirBkg', key);
    }
    if (key.fileEnv) {
      await addKey('file', key);
    }
    if (key.deskEnv) {
      await addKey('desk', key);
    }
  }
  async function deleteKey(type, keyname) {
    await delReg(`${types[type]}\\REGCJS_${keyname}\\command`);
    await delReg(`${types[type]}\\REGCJS_${keyname}`);
  }
  async function deleteAllKeys(key) {
    if (key.icon) {
      await fs.unlink(path.resolve(app.getPath('userData'), 'icons', `${key.name}.ico`));
    }
    if (key.dirEnv) {
      await deleteKey('dir', key.name);
    }
    if (key.dirBkgEnv) {
      await deleteKey('dirBkg', key.name);
    }
    if (key.fileEnv) {
      await deleteKey('file', key.name);
    }
    if (key.deskEnv) {
      await deleteKey('desk', key.name);
    }
  }
  ipcMain.on('deleteKey', async (e, key) => {
    try {
      await deleteAllKeys(key);
      e.sender.send('keyDeleted');
    } catch (err) {
      e.sender.send('onError', err.message);
    }
  });
  ipcMain.on('editKey', async (e, oldkey, key) => {
    try {
      await ensureDir();
      await deleteAllKeys(oldkey);
    } catch (err) {
      e.sender.send('onError', err.message);
    }
    try {
      await addAllKeys(key);
    } catch (err) {
      e.sender.send('onError', err.message);
    }
    e.sender.send('keyEdited');
  });

  ipcMain.on('addKey', async (e, key) => {
    try {
      await ensureDir();
      await addAllKeys(key);
      e.sender.send('keyAdded');
    } catch (err) {
      e.sender.send('onError', err.message);
    }
  });
  let requesting = false;
  ipcMain.on('getToken', async (e) => {
    let authWindow;
    function handleCallback(url2) {
      const code = url2.split('?')[1].split('=')[1];
      console.log('Auth code');
      console.log(code);
      authWindow.destroy();
      (async () => {
        try {
          const tokenRes = await superagent
            .post('https://github.com/login/oauth/access_token')
            .set('Accept', 'application/json')
            .send({
              client_id: options.client_id, client_secret: options.client_secret, code, redirect_uri: 'http://localhost', state: 'tabouret123',
            });
          const token = tokenRes.body.access_token;
          e.sender.send('onToken', token);
        } catch (err) {
          console.error(err);
        }
      })();
      requesting = false;
    }
    if (!requesting) {
      requesting = true;
      // Build the OAuth consent page URL
      authWindow = new BrowserWindow({
        width: 800,
        height: 600,
        show: false,
        'node-integration': false,
      });
      const githubUrl = 'https://github.com/login/oauth/authorize?';
      const authUrl = `${githubUrl}client_id=${options.client_id}&scope=${options.scopes}`;
      authWindow.loadURL(authUrl);
      authWindow.show();

      // Handle the response from GitHub - See Update from 4/12/2015

      authWindow.webContents.on('will-navigate', (event, url2) => {
        console.log('WILL NAVIGATE');
        handleCallback(url2);
      });
      authWindow.webContents.on('will-redirect', (ev, url2) => {
        console.log('REDIRECT REQUEST');
        handleCallback(url2);
      });

      // Reset the authWindow on close
      authWindow.on(
        'close',
        () => {
          authWindow = null;
        },
        false,
      );
    }
  });
  ipcMain.on('getKeys', async (e) => {
    try {
      await ensureDir();
      const rawkeys = {};
      rawkeys[keyPaths[0]] = (await listReg(keyPaths[0]))[keyPaths[0]];
      rawkeys[keyPaths[1]] = (await listReg(keyPaths[1]))[keyPaths[1]];
      rawkeys[keyPaths[2]] = (await listReg(keyPaths[2]))[keyPaths[2]];
      rawkeys[keyPaths[3]] = (await listReg(keyPaths[3]))[keyPaths[3]];
      const rawDir = rawkeys[types.dir].keys.filter((k) => (k.substring(0, 7) === 'REGCJS_'));
      const rawDirBkg = rawkeys[types.dirBkg].keys.filter((k) => (k.substring(0, 7) === 'REGCJS_'));
      const rawFile = rawkeys[types.file].keys.filter((k) => (k.substring(0, 7) === 'REGCJS_'));
      const rawDesk = rawkeys[types.desk].keys.filter((k) => (k.substring(0, 7) === 'REGCJS_'));
      const dirKeys = await Promise.all(rawDir.map(async (subkey) => ({
        icon: (await listReg([`${types.dir}\\${subkey}`]))[`${types.dir}\\${subkey}`].values.Icon.value,
        name: subkey.substring(7, subkey.length),
        label: (await listReg([`${types.dir}\\${subkey}`]))[`${types.dir}\\${subkey}`].values[''].value,
        description: (await listReg([`${types.dir}\\${subkey}`]))[`${types.dir}\\${subkey}`].values.description.value,
        command: (await listReg([`${types.dir}\\${subkey}\\command`]))[`${types.dir}\\${subkey}\\command`].values[''].value,
      })));
      const dirBkgKeys = await Promise.all(rawDirBkg.map(async (subkey) => ({
        icon: (await listReg([`${types.dirBkg}\\${subkey}`]))[`${types.dirBkg}\\${subkey}`].values.Icon.value,
        name: subkey.substring(7, subkey.length),
        label: (await listReg([`${types.dirBkg}\\${subkey}`]))[`${types.dirBkg}\\${subkey}`].values[''].value,
        description: (await listReg([`${types.dirBkg}\\${subkey}`]))[`${types.dirBkg}\\${subkey}`].values.description.value,
        command: (await listReg([`${types.dirBkg}\\${subkey}\\command`]))[`${types.dirBkg}\\${subkey}\\command`].values[''].value,
      })));
      const fileKeys = await Promise.all(rawFile.map(async (subkey) => ({
        icon: (await listReg([`${types.file}\\${subkey}`]))[`${types.file}\\${subkey}`].values.Icon.value,
        name: subkey.substring(7, subkey.length),
        label: (await listReg([`${types.file}\\${subkey}`]))[`${types.file}\\${subkey}`].values[''].value,
        description: (await listReg([`${types.file}\\${subkey}`]))[`${types.file}\\${subkey}`].values.description.value,
        command: (await listReg([`${types.file}\\${subkey}\\command`]))[`${types.file}\\${subkey}\\command`].values[''].value,
      })));
      const deskKeys = await Promise.all(rawDesk.map(async (subkey) => ({
        icon: (await listReg([`${types.desk}\\${subkey}`]))[`${types.desk}\\${subkey}`].values.Icon.value,
        name: subkey.substring(7, subkey.length),
        label: (await listReg([`${types.desk}\\${subkey}`]))[`${types.desk}\\${subkey}`].values[''].value,
        description: (await listReg([`${types.desk}\\${subkey}`]))[`${types.desk}\\${subkey}`].values.description.value,
        command: (await listReg([`${types.desk}\\${subkey}\\command`]))[`${types.desk}\\${subkey}\\command`].values[''].value,
      })));
      const deepkeys = [dirKeys, dirBkgKeys, fileKeys, deskKeys];
      const reducedkeys = deepkeys.reduce((acc, current, i) => {
        for (let j = 0; j < current.length; j += 1) {
          const k = current[j];
          const foundId = acc.findIndex((elt) => elt.name === k.name);
          if (foundId === -1) {
            const obj = {
              icon: k.icon,
              name: k.name,
              label: k.label,
              description: k.description,
              command: k.command,
              dirEnv: false,
              dirBkgEnv: false,
              fileEnv: false,
              deskEnv: false,
            };
            obj[`${typeArr[i]}Env`] = true;
            acc.push(obj);
          } else {
            acc[foundId][`${typeArr[i]}Env`] = true;
          }
        }
        return acc;
      }, []);
      const keys = await Promise.all(reducedkeys.map(async (k) => ({ ...k, icon: k.icon.length > 0 ? `${'data:image/x-icon;base64,'}${(await fs.readFile(k.icon)).toString('base64')}` : null })));
      keys.sort((a, b) => a.name.localeCompare(b.name));
      e.sender.send('onKeys', keys);
    } catch (err) {
      e.sender.send('onError', err.message);
    }
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});
