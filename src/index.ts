import { createApp } from './app';
import config from './config';
import { checkBatteryLevels } from './tasks/batteryLevel';
import logger from './utils/logger';
import { CronJob } from 'cron';

const app = createApp();

const cronTime = '*/1 * * * *';
const job = new CronJob(cronTime, () => {
  // This function will be executed every minute
  checkBatteryLevels();
});

// Start the cron job
job.start();

app.listen(config.port, () =>
  logger.info(
    `🚀 Server ready at: http://localhost:${config.port}${config.api.prefix}`,
    'Server start',
  ),
);
