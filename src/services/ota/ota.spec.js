const { assert } = require('chai');
const { getMeta, getData } = require('.');

describe('getMeta tests', () => {
  it('gets meta data for a binary file', async () => {
    const testData = await getMeta('1.0.0');
    assert.isNotNull(testData);
  });

  it('gets meta file data as a string', async () => {
    const testData = await getData('1.0.0');
    assert.isNotNull(testData);
  });
});
