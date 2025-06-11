import pino from 'pino';

const logger = pino({
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      levelFirst: true,
      translateTime: 'SYS:standard',
    },
  },
  level: process.env.LOG_LEVEL || 'info',
});

export const createNamedLogger = (name: string) => {
  return logger.child({ name });
};

export default logger;
