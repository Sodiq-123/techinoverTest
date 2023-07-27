import { appendFileSync, mkdirSync } from 'fs';

enum LogLevel {
  INFO = 'info',
  ERROR = 'error',
  WARN = 'warn',
  SUCCESS = 'success',
}

class Logger {
  private static readonly levelToConsole = {
    error: '\x1b[31m',
    success: '\x1b[32m',
    warn: '\x1b[33m',
    info: '\x1b[34m',
    default: '\x1b[0m',
  };

  private static readonly levelToFile = {
    error: 'errors.log',
    success: 'success.log',
    warn: 'debug.log',
    info: 'info.log',
    default: 'info.log',
  };

  private logToFile(
    message: string,
    options: { color: LogLevel; type: string },
    filename?: string, // Add filename as an optional parameter
  ) {
    const date = new Date();
    const consoleMessage = `${date.toString()} - ${
      options.type
    } - ${message}\n`;
    const fileName = filename || Logger.levelToFile[options.color]; // Use the provided filename or fallback to the default filename
    try {
      mkdirSync('./logs');
    } catch (e) {
      // do nothing
    }
    appendFileSync(`./logs/${fileName}`, consoleMessage, { flag: 'a+' });
  }

  private logToConsole(
    message: string,
    options: { color: LogLevel; type: string },
    filename?: string, // Add filename as an optional parameter
  ) {
    const date = new Date();
    const color: string = Logger.levelToConsole[options.color];
    const consoleMessage = `${date.toString()} - ${options.type} - ${message}`;
    console.log(`${color}${consoleMessage}\x1b[0m`);
    if (filename) {
      appendFileSync(filename, consoleMessage, { flag: 'a+' });
    }
  }

  info(message: string, type: string, filename?: string) {
    this.logToConsole(message, { color: LogLevel.INFO, type }, filename);
    this.logToFile(message, { color: LogLevel.INFO, type }, filename);
  }

  error(message: string, type: string, filename?: string) {
    this.logToConsole(message, { color: LogLevel.ERROR, type }, filename);
    this.logToFile(message, { color: LogLevel.ERROR, type }, filename);
  }

  warn(message: string, type: string, filename?: string) {
    this.logToConsole(message, { color: LogLevel.WARN, type }, filename);
    this.logToFile(message, { color: LogLevel.WARN, type }, filename);
  }

  success(message: string, type: string, filename?: string) {
    this.logToConsole(message, { color: LogLevel.SUCCESS, type }, filename);
    this.logToFile(message, { color: LogLevel.SUCCESS, type }, filename);
  }
}

const logger = new Logger();

export default logger;
