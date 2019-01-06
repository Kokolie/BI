const assert = require('assert');
const app = require('../../src/app');

describe('\'readtxt#\' service', () => {
  it('registered the service', () => {
    const service = app.service('readtxt');

    assert.ok(service, 'Registered the service');
  });
});
