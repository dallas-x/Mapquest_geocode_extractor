const electron = require('electron');
const ipc = electron.ipcMain;
const app = electron.app;
const gui = electron.BrowserWindow;
const test = require('./controllers/test');
// Create and institiate main gui
let mainGui;
app.on('ready', _ =>{
    mainGui = new gui({width: 800, height: 600})
    mainGui.on('closed', () => {
      mainGui = null
    });
    mainGui.loadURL(`file://${__dirname}/views/index.html`);

    // When user clicks button {get cordinates} 
    // Send user provided link HTML extractor function 
    ipc.on('process', (event, link) => {
        test.extractHTML(link)
        .then((html) => {
            test.parseHTML()
            .then((cords) => {
                mainGui.webContents.send('cords', cords);
            });
        });
    });
});