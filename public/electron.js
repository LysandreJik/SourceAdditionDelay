const electron = require("electron");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const fs = require('fs')
const path = require("path");
const isDev = require("electron-is-dev");

let mainWindow;

require("update-electron-app")({
  repo: "kitze/react-electron-example",
  updateInterval: "1 hour"
});

function createWindow() {
  mainWindow = new BrowserWindow({ width: 1280, height: 720, frame: false});
  mainWindow.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../build/index.html")}`
  );
  mainWindow.on("closed", () => (mainWindow = null));
}

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});

let getData = (arg) => new Promise((success, failure) => {
    const spawn = require("child_process").spawn;
    arg.unshift('./python/main.py');
    const pythonProcess = spawn('python', arg);

    pythonProcess.stdout.on('data', function(data){
        success(data.toString());
    });

    pythonProcess.stderr.on('data', (data) => {
        failure(data.toString());
    });
});

let listDirectory = (path) => new Promise((success, failure) => {
    fs.readdir(path, (err, items) => {
        if(err)
            failure(err);

        let ret = items.map(item => {console.log({item, directory: fs.lstatSync(path+"/"+item).isDirectory()}); return {item, directory: fs.lstatSync(path+"/"+item).isDirectory()}});
        console.log(ret);
        console.log('Success !');
        success(JSON.stringify(ret));
    })
});

let getMicrophonesFromModel = (arg) => new Promise((success, failure) => {
    console.log("Fetching microphones ...");
    const spawn = require("child_process").spawn;
    arg.unshift('./python/main.py');
    const pythonProcess = spawn('python', arg);

    pythonProcess.stdout.on('data', function(data){
        success(data.toString());
    });

    pythonProcess.stderr.on('data', (data) => {
        failure(data.toString());
    });
});

let backend = {
    async getData(arg){
        return await getData(arg).then((data) => {return data}, (data) => {return data});
    },

    async listDirectory(path){
        return await listDirectory(path).then(data => {return data}, data => {return data})
    },

    async getMicrophonesFromModel(model){
        return await getMicrophonesFromModel(model).then((data) => {return data}, (data) => {return data});
    },

    saveData(data, filename){
        fs.writeFile(filename+'.json', data, 'utf8');
    }
};

global.shared = {os: process.platform, backend};








