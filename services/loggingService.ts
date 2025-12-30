// services/loggingService.ts

/**
 * Define os níveis de log para categorizar as mensagens.
 */
enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
}

/**
 * Formata e exibe uma mensagem de log no console.
 * @param level O nível do log (e.g., ERROR).
 * @param message A mensagem principal do log.
 * @param context Um objeto opcional com dados adicionais para ajudar na depuração.
 */
const log = (level: LogLevel, message: string, context?: object) => {
  // NOTA DE PRODUÇÃO: Em um ambiente real, esta função seria expandida para enviar logs
  // para um serviço de monitoramento de terceiros (ex: Sentry, LogRocket, Datadog).
  // Exemplo: if (process.env.NODE_ENV === 'production') { Sentry.captureMessage(...) }
  const timestamp = new Date().toISOString();
  const formattedMessage = `[${timestamp}] [${level}] :: ${message}`;

  // Escolhe o método do console apropriado com base no nível do log.
  const consoleMethod = {
    [LogLevel.DEBUG]: console.debug,
    [LogLevel.INFO]: console.info,
    [LogLevel.WARN]: console.warn,
    [LogLevel.ERROR]: console.error,
  }[level];

  if (context) {
    consoleMethod(formattedMessage, context);
  } else {
    consoleMethod(formattedMessage);
  }
};

/**
 * Objeto logger exportado para ser usado em toda a aplicação.
 * Fornece métodos fáceis para cada nível de log.
 */
export const logger = {
  debug: (message: string, context?: object) => log(LogLevel.DEBUG, message, context),
  info: (message: string, context?: object) => log(LogLevel.INFO, message, context),
  warn: (message: string, context?: object) => log(LogLevel.WARN, message, context),
  error: (message: string, context?: object) => log(LogLevel.ERROR, message, context),
};