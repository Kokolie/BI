// Initializes the `readxlsx` service on path `/readxlsx`
const createService = require('feathers-nedb');
const createModel = require('../../models/readxlsx.model');
const hooks = require('./readxlsx.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/readxlsx', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('readxlsx');

  service.hooks(hooks);
};
