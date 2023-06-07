import debug from 'debug';

let logger: debug.Debugger;

const buildLogger = (debugName: string) => {
  if (logger) {
    return logger;
  }

  debug.enable(`${debugName}*`);
  logger = debug(debugName);

  return logger;
};

export default buildLogger(process.env.DEBUGNAME || 'NoDebugName');
