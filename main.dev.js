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
  mainWindow.loadURL('http://localhost:3000');
  mainWindow.openDevTools();
  mainWindow.on('closed', function() {
    mainWindow = null;
  });
});
