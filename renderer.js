const { ipcRenderer } = require('electron');

document.getElementById('select-file-button').addEventListener('click', async () => {
  const filePaths = await ipcRenderer.invoke('open-file-dialog');
  if (filePaths.length > 0) {
    document.getElementById('selected-file').innerText = `Selected file: ${filePaths[0]}`;
  }
});

document.getElementById('open-file').addEventListener('click', async () => {
  ipcRenderer.send('open-file');    
})

document.getElementById('start-process-button').addEventListener('click', async () => {
  ipcRenderer.send('');
  let x = "x";
  document.getElementById('new-file-name').innerText = `New file name: ${x}`;

})

ipcRenderer.on('response-data', (event, data) => {
  console.log(data);
});