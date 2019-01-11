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
const fsjs = require('fs');

function readFile(fileName) {

  fsjs.readFile("./uploads/" + fileName, function(err, data) {

    var contents = `${data}`
    //Check file type
    //console.log(contents);
    if(contents.substring(1, 6) === "AVGID") {
      console.log("avg");
    }
    else if(contents.substring(1, 7) === "CustID") {
      console.log("customer");
    }
    else {
      console.log("Oh noes");
      console.log(contents.substring(1, 8));
    }
    var linesplit = contents.split("\r\n");
    linesplit.shift();
    //console.log(linesplit);
  });
}

module.exports = function() {
  const app = this;
  const Model = createModel(app);
  const paginate = app.get('paginate');

  // Initialize our service with any options it requires
  app.use('/readtxt',

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
  const service = app.service('readtxt');
  service.on('created', function(file) {
    readFile(file.id);
    //console.log(file);
  })
  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};