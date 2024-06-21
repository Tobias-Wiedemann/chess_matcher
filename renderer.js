const { ipcRenderer } = require('electron');

document.getElementById('select-file-button').addEventListener('click', async () => {
  const filePaths = await ipcRenderer.invoke('open-file-dialog');
  if (filePaths.length > 0) {
    document.getElementById('selected-file').innerText = `Selected file: ${filePaths[0]}`;
  }
});
