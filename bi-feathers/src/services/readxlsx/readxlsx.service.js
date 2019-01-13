// Initializes the `readtxt#` service on path `/readtxt`
const createService = require('feathers-nedb');
const createModel = require('../../models/readxlsx.model');
const hooks = require('./readxlsx.hooks');
const blobService = require('feathers-blob');
const fs = require('fs-blob-store');
const blobStorage = fs('./uploads');
const dauria = require('dauria');
const multer = require('multer');
const multipartMiddleware = multer();
const fsjs = require('fs');
const xlsx = require('xlsx');

function readFile(app, fileName) {


  const contents = xlsx.readFile("./uploads/" + fileName).Sheets.Sheet1;
  var array = [];
  for(var cell in contents) {
    var v = contents[cell].v;
    if(v !== undefined) {
      array.push(v);
    }
  }
  if(array[0] === "Alert_ID") {
    var nestedArray = [];
    for (var i = 0; i < array.length; i+=4) {
      nestedArray.push([array[i], array[i+1], array[i+2], array[i+3]]); 
    }
    nestedArray.shift();
    readAlertTypes(app, nestedArray);
  }
  else if(array[0] === "SpeedCategory") {
    var nestedArray = [];
    for (var i = 0; i < array.length; i+=3) {
      nestedArray.push([array[i], array[i+1], array[i+2]]); 
    }
    nestedArray.shift();
    readSpeedTypes(app, nestedArray);  }
  else {
    console.log("Oh noes");
    console.log(array[0]);
  }
}

function readAlertTypes(app, contents) {

  contents.forEach(function(line) {
    var entry = {};
    entry.type = "alerttype";
    entry.alertid = line[0];
    entry.name = line[1];
    entry.environmental = line[2];
    entry.blocking = line[3];
    app.service('sequelise').create(entry);

  });
}

function readSpeedTypes(app, contents) {

  contents.forEach(function(line) {
    var entry = {};
    entry.type = "speedtype";
    entry.name = line[0];
    entry.minimum = line[1];
    entry.maximum = line[2];
    app.service('sequelise').create(entry);

  });
}

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
  const service = app.service('readxlsx');
  service.on('created', function(file) {
    readFile(app, file.id);
    //console.log(file);
  })
  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};