// Initializes the `readtxt#` service on path `/readtxt`
const createService = require('feathers-nedb');
const createModel = require('../../models/readxlsx.model');
const hooks = require('./readxslsx.hooks');
const blobService = require('feathers-blob');
const fs = require('fs-blob-store');
const blobStorage = fs('./uploads');
const dauria = require('dauria');
const multer = require('multer');
const multipartMiddleware = multer();

module.exports = function() {
  const app = this;
  const Model = createModel(app);
  const paginate = app.get('paginate');

  // Initialize our service with any options it requires
  app.use('/readxlsx',

      // multer parses the file named 'uri'.
      // Without extra params the data is
      // temporarely kept in memory
      multipartMiddleware.single('uri'),

      // another middleware, this time to
      // transfer the received file to feathers
      function(req,res,next){
          req.feathers.file = req.file;
          next();
      },
      blobService({Model: blobStorage})
  );
  // Get our initialized service so that we can register hooks and filters
  const service = app.service('readxslx');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};