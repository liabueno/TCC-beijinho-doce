const { app, BrowserWindow, nativeImage } = require('electron')

const icon = nativeImage.createFromPath(`${app.getAppPath()}/src/image/logoApp.jpg`);

if (app.dock) {
  app.dock.setIcon(icon);
}

const createWindow = () => {
  const win = new BrowserWindow({
    icon,
    frame: false,
    resizable: true,
    width: 950,
    height: 650
  })

  win.loadFile('index.html')
}

app.whenReady().then(() => {
  createWindow()
})