import { createApp } from './app';
import config from './config';
import logger from './utils/logger';

const app = createApp();

app.listen(config.port, () =>
  logger.info(
    `🚀 Server ready at: http://localhost:${config.port}${config.api.prefix}`,
    'Server start',
  ),
);
