const { assert } = require('chai');
const { v4: uuid } = require('uuid');
const { getTasks, ackTask } = require('.');

describe('get tasks tests', () => {
  it('gets tasks', async () => {
    const tasks = await getTasks();
    assert.isArray(tasks);
  });

  it('acks a task', async () => {
    const taskId = uuid();
    const acked = await ackTask(taskId);
    assert.isTrue(acked);
  });
});
