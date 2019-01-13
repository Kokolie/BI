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
const DOMParser = require('dom-parser');

function readFile(app, fileName) {

  fsjs.readFile("./uploads/" + fileName, function(err, data) {

    var contents = `${data}`
    parser = new DOMParser();
    xmlDoc = parser.parseFromString(contents,"text/xml");
    var children = xmlDoc.getElementsByTagName("root")[0].childNodes;
    var entry = {}
    var temp = children[0].text
    var idstring = temp.substr(temp.search("=")+2, temp.length-(temp.search("=")+3));
    entry.type = "alert";
    entry.vehicleId = parseInt(idstring, 10);
    entry.alerttype = children[3].text;
    entry.timestamp = children[5].text;
    entry.blocked = parseInt(children[7].text);
    entry.avgjobkey = children[10].text;
    entry.x = children[12].text;
    entry.y = children[14].text;
    entry.direction = children[16].text;
    entry.speed = children[18].text;
    //console.log(children[19].text);
    entry.loaded = parseInt(children[20].text);
    app.service('sequelise').create(entry);
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
    readFile(app, file.id);
  })
  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};