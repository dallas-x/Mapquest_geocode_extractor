const electron = require('electron');
const ipc = electron.ipcMain;
const app = electron.app;
const gui = electron.BrowserWindow;
const Menu = electron.Menu;
const test = require('./controllers/test');
// Create and institiate main gui
let mainGui;
app.on('ready', _ =>{
    mainGui = new gui({width: 800, height: 600})
    mainGui.on('closed', () => {
      mainGui = null
    });
    mainGui.loadURL(`file://${__dirname}/views/index.html`);
    // Create the Application's main menu
    var template = [{
        label: "Application",
        submenu: [
            { label: "About Application", selector: "orderFrontStandardAboutPanel:" },
            { type: "separator" },
            { label: "Quit", accelerator: "Command+Q", click: function() { app.quit(); }}
        ]}, {
        label: "Edit",
        submenu: [
            { label: "Undo", accelerator: "CmdOrCtrl+Z", selector: "undo:" },
            { label: "Redo", accelerator: "Shift+CmdOrCtrl+Z", selector: "redo:" },
            { type: "separator" },
            { label: "Cut", accelerator: "CmdOrCtrl+X", selector: "cut:" },
            { label: "Copy", accelerator: "CmdOrCtrl+C", selector: "copy:" },
            { label: "Paste", accelerator: "CmdOrCtrl+V", selector: "paste:" },
            { label: "Select All", accelerator: "CmdOrCtrl+A", selector: "selectAll:" }
        ]}
    ];

    Menu.setApplicationMenu(Menu.buildFromTemplate(template));

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