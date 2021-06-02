const { assert } = require('chai');
const request = require('supertest');
const app = require('../../server');

describe('ROUTER - ota Unit Test POSITIVE', () => {
  it('returns 200 for GET /', async () => {
    const response = await request(app).get('/ota/meta?version=1.0.0');
    assert.equal(200, response.status, 200, 'Response status should be 200');
  });

  it('returns 200 for GET /data', async () => {
    const response = await request(app).get('/ota/data?version=1.0.0');
    assert.equal(200, response.status, 'Response status should be 200');
  });
});

describe('ROUTER - ota Unit Test NEGATIVE', () => {
  it('returns 404 for PUT /', async () => {
    const response = await request(app).put('/ota');
    assert.equal(404, response.status, 'Response status should be 404');
  });
  it('returns 404 for POST /', async () => {
    const response = await request(app).post('/ota');
    assert.equal(404, response.status, 'Response status should be 404');
  });
  it('returns 404 for DELETE /', async () => {
    const response = await request(app).delete('/ota');
    assert.equal(404, response.status, 'Response status should be 404');
  });
  it('returns 404 for GET /', async () => {
    const response = await request(app).get('/ota');
    assert.equal(404, response.status, 'Response status should be 404');
  });
  it('returns 400 for GET /meta without a version', async () => {
    const response = await request(app).get('/ota/meta');
    assert.equal(400, response.status, 'Response status should be 400');
  });
  it('returns 400 for GET /data', async () => {
    const response = await request(app).get('/ota/data');
    assert.equal(400, response.status, 'Response status should be 400');
  });
});
