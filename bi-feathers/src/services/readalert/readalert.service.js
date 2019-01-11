// Initializes the `readalert#` service on path `/readalert`
const createService = require('feathers-nedb');
const createModel = require('../../models/readalert.model');
const hooks = require('./readalert.hooks');
const blobService = require('feathers-blob');
const fs = require('fs-blob-store');
const blobStorage = fs('./uploads');
const dauria = require('dauria');
const multer = require('multer');
const multipartMiddleware = multer();
const fsjs = require('fs');

function readFile(fileName) {

  fsjs.readFile("./uploads/" + fileName, function(err, data) {

    var contents = `${data}`
    //Check file type
    console.log(contents);
  });
}

module.exports = function() {
  const app = this;
  const Model = createModel(app);
  const paginate = app.get('paginate');

  // Initialize our service with any options it requires
  app.use('/readalert',

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
  const service = app.service('readalert');
  service.on('created', function(file) {
    readFile(file.id);
    //console.log(file);
  })
  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};