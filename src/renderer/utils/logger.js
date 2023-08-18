import log from 'electron-log/renderer';

log.transports.console.format = '{text}';

// Echo console.log() etc. to the terminal using electron logger.
Object.assign(console, log.functions);

export default log;
