/* eslint-disable import/order */
const { StatusCodes } = require('http-status-codes');
const { tasks } = require('../../services');

const router = require('express').Router();

router.put('/', async (req, res) => {
  res.sendStatus(StatusCodes.NOT_FOUND);
});
router.delete('/', async (req, res) => {
  res.sendStatus(StatusCodes.NOT_FOUND);
});
router.post('/', async (req, res) => {
  console.log('POST /tasks', req.body);
  const returnTasks = await tasks.getTasks();
  console.log(JSON.stringify(returnTasks));
  res.send(JSON.stringify(returnTasks)).status(200);
});
router.post('/ack', async (req, res) => {
  await tasks.ackTask(req.body);
  res.sendStatus(202);
});
router.get('/', async (req, res) => {
  res.sendStatus(StatusCodes.NOT_FOUND);
});

module.exports = router;
