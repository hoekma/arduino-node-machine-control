const { assert } = require('chai');
const request = require('supertest');
const { v4: uuid } = require('uuid');
const app = require('../../server');

describe('ota Unit Test Positive', () => {
  it('returns 404 for PUT /', async () => {
    const response = await request(app).put('/tasks');
    assert.equal(404, response.status, 'Response status should be 404');
  });
  it('returns 404 for DELETE /', async () => {
    const response = await request(app).delete('/tasks');
    assert.equal(404, response.status, 'Response status should be 404');
  });
  it('returns 404 for GET /', async () => {
    const response = await request(app).get('/tasks');
    assert.equal(404, response.status, 'Response status should be 404');
  });
  it('returns 200 for POST /', async () => {
    const response = await request(app)
      .post('/tasks')
      .send({});
    assert.equal(200, response.status, 'Response status should be 200');
  });
  it('returns 202 for POST /ack', async () => {
    const response = await request(app)
      .post('/tasks/ack')
      .send({ taskId: uuid() });
    assert.equal(202, response.status, 'Response status should be 202');
  });
});
