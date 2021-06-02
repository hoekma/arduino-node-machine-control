/* eslint-disable import/order */
const { StatusCodes } = require('http-status-codes');
const router = require('express').Router();
const { ota } = require('../../services');

router.put('/', async (req, res) => {
  res.sendStatus(StatusCodes.NOT_FOUND);
});
router.delete('/', async (req, res) => {
  res.sendStatus(StatusCodes.NOT_FOUND);
});
router.post('/', async (req, res) => {
  res.sendStatus(StatusCodes.NOT_FOUND);
});
router.get('/meta', async (req, res) => {
  const { version } = req.query;
  console.log(`Meta request for version ${version}`);
  if (!version) {
    res.sendStatus(400);
    return;
  }
  res.send(await ota.getMeta(version));
});
router.get('/data', async (req, res) => {
  const { version } = req.query;
  console.log(`Data request for version ${version}`);
  if (!version) {
    res.sendStatus(400);
    return;
  }

  const fileBuffer = await ota.getData(version);

  res.send(Buffer.from(fileBuffer, 'binary'));
});

module.exports = router;
