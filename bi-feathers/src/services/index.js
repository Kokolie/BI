const readtxt = require('./readtxt/readtxt.service.js');
const readxlsx = require('./readxlsx/readxlsx.service.js');
const sequelise = require('./sequelise/sequelise.service.js');
// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  app.configure(readtxt);
  app.configure(readxlsx);
  app.configure(sequelise);
};
