// Initializes the `readtxt#` service on path `/readtxt`
const createService = require('feathers-nedb');
const createModel = require('../../models/readtxt.model');
const hooks = require('./readtxt.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/readtxt', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('readtxt');

  service.hooks(hooks);
};
