const assert = require('assert');
const app = require('../../src/app');

describe('\'readxlsx\' service', () => {
  it('registered the service', () => {
    const service = app.service('readxlsx');

    assert.ok(service, 'Registered the service');
  });
});
