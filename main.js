const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

let inputPath = '';
let resultPath = '';
let finalData = '';

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false,
    }
  })

  win.loadFile('index.html')
}

app.whenReady().then(() => {
  createWindow()
  
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

ipcMain.handle('open-file-dialog', async (event) => {
  const result = await dialog.showOpenDialog({
    properties: ['openFile'],
  });
  inputPath = result.filePaths[0];
  return result.filePaths;
});

ipcMain.on('open-file', (event) => {
  if (inputPath === '') {
    event.reply('response-data', { message: 'Tried to open empty file path' });
  } else {
    try {
      fs.readFile(inputPath, 'utf8', (err, data) => {
        if (err) {
          console.error(`Error reading the file: ${err}`);
          return;
        }
        finalData = data;
        event.reply('response-data', { message: `data: ${data}`});
        processPlayerList();
      });
    } catch(error) {
      event.reply('response-data', { message: `failed opening '${inputPath}'`});
    }
    event.reply('response-data', { message: `'${inputPath}' is the opened file path`});
  }
})

ipcMain.on('save-file', (event, data) => {
  if (data === '') {
    event.reply('response-data', { message: 'Tried to open empty file path' });
  } else {
    resultPath = './' + data + '.txt';
    try {
      fs.writeFile(resultPath, finalData, err => {
        if (err) {
          console.error(err);
        } else {
          // file written successfully
        }
      });

    } catch(error) {
      event.reply('response-data', { message: `failed saving '${resultPath}'`});
    }
    event.reply('response-data', { message: `'${resultPath}' is the resulting file path`});
  }
})

ipcMain.on('process', (event) => {

  event.reply('response-data', { message: `'${event.data}' is the opened file path`});
})

function processPlayerList() {
  const normalizedData = finalData.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  let splitData = normalizedData.split("\n");
  let players = [];
  splitData.forEach((line) => {
    console.log(`line: ${line}`);
    
    // cuts of anything after this delimiter in this line
    let tuple = line.split("### END_OF_LINE ###");
    // looks for matches
    tuple = tuple[0].split("---");
    if (tuple.length === 1) {
      // player list case
      tuple = tuple[0].split(",,,");
      if (tuple.length > 1) {
        let eloFirstTuple = [parseFloat(tuple[1]), tuple[0]];
        players.push(eloFirstTuple);
      }
    } else {
      // match list case

    }
  });
  
  
  console.log("finalData:");
  console.log(finalData);
  console.log("players:");
  console.log(players);
  
  players.sort((a, b) => a[0] - b[0]);
  console.log("sorted players:");
  console.log(players);


  finalData = "";
  let first = "";
  let second = "";
  for (let i = 0; i < players.length; i++) {
    if (first === "") {
      first = players[i][1] + " ,,, " + players[i][0].toString();
    } else {
      second = players[i][1] + " ,,, " + players[i][0].toString();
      finalData = finalData + first + " --- " + second +  + " ### END_OF_LINE ### " + "\n";
      first = "";
      second = "";
    }
  }

  console.log("finalData:");
  console.log(finalData);

}