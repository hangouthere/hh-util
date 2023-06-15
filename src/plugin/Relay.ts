import { BrowserWindow, ipcMain, ipcRenderer, type IpcMainEvent, type IpcRendererEvent } from 'electron';

type IPCHandler = ((event: IpcRendererEvent, ...args: unknown[]) => void) &
  ((event: IpcMainEvent, ...args: unknown[]) => void);

export default class Relay {
  constructor() {
    if (this.isMain) {
      //TODO Determine if this is necessary for OTHER windows
      /**
       * If so, consider a modified data structure that indicates originating window
       * ie: { originalRelay: { msg, payload }, originatingWindow: id }
       * When iterating check for this format, and skip originating window to avoid recursive relays
       */
      // ipcMain.on('renderer:relay', (event: any, msg: any, payload: any) => {
      //   this.send(msg, payload);
      // });
    }
  }

  get isMain() {
    return process.type !== 'renderer';
  }

  listen(msg: string, handler: IPCHandler, isOnce = false) {
    const emitter = this.isMain ? ipcMain : ipcRenderer;
    const emitType = isOnce ? emitter.once.bind(emitter) : emitter.on.bind(emitter);

    emitType(msg, handler);
  }

  on(msg: string, handler: IPCHandler) {
    return this.listen(msg, handler);
  }

  once(msg: string, handler: IPCHandler) {
    return this.listen(msg, handler, true);
  }

  send(msg: string, payload?: unknown) {
    if (this.isMain) {
      // Send to all open windows
      BrowserWindow.getAllWindows().forEach((bw: BrowserWindow) => {
        bw.webContents.send(msg, payload);
      });

      // Send internally to Main process
      ipcMain.emit(msg, payload);
    } else {
      ipcRenderer.send(msg, payload);
      // ipcRenderer.send('renderer:relay', msg as any, payload);
    }
  }
}
