// server.js

// import the packages we need
const https = require('https');
const fs = require('fs');
const express = require('express');
const pino = require('pino');
const expressPino = require('express-pino-logger');
const { env } = require('./config');

const logger = pino({ level: env.LOG_LEVEL || 'info' });
const expressLogger = expressPino({ logger });

const app = express();
app.use(expressLogger);

app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // To parse the incoming requests with JSON payloads

// Set CORS header and intercept "OPTIONS" preflight call
// NOTE any custom headers need to be included in the list on param #2
const allowCrossDomain = (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') res.sendStatus(200);
  else next();
};

app.use(allowCrossDomain);

// =============================================================================
// Load the Routes

require('./routes')(app);

// =============================================================================
// START THE SERVER

const port = env.PORT; // set our port
let server;

if (env.ENVIRONMENT === 'dev') {
  // Dev
  console.log('Starting in Dev Mode');
  server = app.listen(port);
  console.log(`${env.APP_NAME} API Active on port ${port}`);
  console.log('PID', process.pid);
} else {
  // Prod w/Certs
  console.log('Starting in Prod Mode');
  server = https
    .createServer(
      {
        key: fs.readFileSync(env.KEY),
        cert: fs.readFileSync(env.CERT)
      },
      app
    )
    .listen(port);
}

// =============================================================================
// Exit Handlers

const exitHandler = shutdownType => {
  console.log(
    `SHUTDOWN: process received ${shutdownType} event - shutting down Express server...`
  );
  server.close();
  if (shutdownType !== 'exit') {
    process.exit();
  }
};

process.on('SIGINT', () => exitHandler('SIGINT'));
process.on('SIGTERM', () => exitHandler('SIGTERM'));
process.on('exit', () => exitHandler('exit'));
process.on('disconnect', () => exitHandler('disconnect'));

module.exports = server;
