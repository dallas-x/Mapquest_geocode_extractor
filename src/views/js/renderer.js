const electron = require('electron');
const ipc = electron.ipcRenderer;

// when button is pressed send the link to process the html
document.getElementById('getCords').addEventListener('click', function(evt){
    const link = document.getElementById('mqLink').value;
    ipc.send("process", link);
});

// once html is parsed return the array of geogodes to main gui
ipc.on('cords', (event, data) => {
    document.getElementById('response').innerHTML = data;
});