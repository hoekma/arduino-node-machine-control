const dotenv = require('dotenv');

dotenv.config();

module.exports = {
  APP_NAME: process.env.APP_NAME,
  PORT: process.env.PORT,
  ENVIRONMENT: process.env.ENVIRONMENT,
  LOG_LEVEL: process.env.LOG_LEVEL
};
