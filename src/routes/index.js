/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
const { readdirSync } = require('fs');

const routes = readdirSync(__dirname, { withFileTypes: true })
  .filter(dirent => dirent.isDirectory())
  .map(dirent => dirent.name);

module.exports = app =>
  routes.map(directory => app.use(`/${directory}`, require(`./${directory}`)));
