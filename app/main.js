const { app, BrowserWindow } = require('electron')

const createWindow = () => {
  const win = new BrowserWindow({
    frame: false,
    resizable: true,
    width: 1000,
    height: 700
  })

  win.loadFile('index.html')
}

app.whenReady().then(() => {
  createWindow()
})