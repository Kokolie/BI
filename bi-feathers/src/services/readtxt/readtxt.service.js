// Initializes the `readtxt#` service on path `/readtxt`
const createService = require('feathers-nedb');
const createModel = require('../../models/readtxt.model');
const hooks = require('./readtxt.hooks');
const blobService = require('feathers-blob');
const fs = require('fs-blob-store');
const blobStorage = fs('./uploads');
const dauria = require('dauria');
const multer = require('multer');
const multipartMiddleware = multer();

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  //app.use('/readtxt', createService(options));
// Upload Service with multipart support
app.use('/readtxt', {

  async create(data, params) {

    console.log(data.data);
  }
});
  // before-create Hook to get the file (if there is any)
  // and turn it into a datauri,
  // transparently getting feathers-blob to work
  // Get our initialized service so that we can register hooks
  const service = app.service('readtxt');

  service.hooks(hooks);
  if (service.filter) {
    service.filter(filters);
  }  
};
