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

function readFile(app, fileName) {

  fsjs.readFile(".\\uploads\\" + fileName, function(err, data) {
    //console.log(fileName);
    var contents = `${data}`;
    //Check file type
    //console.log(contents);
    if(contents.substring(1, 6) === "AVGID") {
      console.log("avg");
      readAvg(app, contents);
    }
    else if(contents.substring(1, 7) === "CustID") {
      console.log("customer");
      readCustomers(app, contents);
    }
    else {
      console.log("Oh noes");
      console.log(contents.substring(1, 8));
    }
    //var linesplit = contents.split("\r\n");
    //linesplit.shift();
    //console.log(linesplit);
  });
}

function readAvg(app, content) {

  var linesplit = content.split("\r\n");
  linesplit.shift();
  linesplit.forEach(function(line) {

    if(line === '') return;
    var elements = line.split("\t");
    var entry = {};
    entry.type = "vehicle";
    entry.avgid = elements[0];
    entry.customerkey = elements[1];
    entry.identification = elements[2];
    entry.inproductiondate = elements[3];
    entry.outproductiondate = elements[4];
    app.service('sequelise').create(entry);

  });
}

function readCustomers(app, content) {

  var linesplit = content.split("\r\n");
  linesplit.shift();
  linesplit.forEach(function(line) {

    if(line === '') return;
    var entry = {};
    var elements = line.split("\t");
    entry.type = "client";
    entry.custid = elements[0];
    entry.customername = elements[1];
    entry.customercountry = elements[2];
    entry.customerbranch = elements[3];
    app.service('sequelise').create(entry);
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
    //console.log(file);
    readFile(app, file.id);
  })
  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};