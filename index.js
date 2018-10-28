const electron = require('electron')
const path = require('path')
const app = electron.app
const BrowserWindow = electron.BrowserWindow

let mainWindow

function createWindow() {
  mainWindow = new BrowserWindow({ width: 1280, height: 720, frame: false, 'minWidth': 1280, 'minHeight': 720, icon: path.join(__dirname, '/src/resources/img/LogoWhite.png') })
  mainWindow.webContents.openDevTools()
  mainWindow.loadURL(`file://${__dirname}/index.html`)
  mainWindow.setMenu(null);
  mainWindow.on('closed', function () {
    mainWindow = null
  })
}


app.on('ready', createWindow)

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow()
  }
})
