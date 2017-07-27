const path = require('path');
const { app, BrowserWindow, crashReporter } = require('electron');

app.on('window-all-closed', function() {
  app.quit();
});
app.on('ready', function() {
  mainWindow = new BrowserWindow({
    width: 500,
    height: 300,
    resizable: false,
  });
  mainWindow.loadURL(`file://${path.join(__dirname, 'dist/index.html')}`);
  mainWindow.on('closed', function() {
    mainWindow = null;
  });
});
