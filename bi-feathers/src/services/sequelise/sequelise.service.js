// Initializes the `sequelise` service on path `/sequelise`
const createService = require('feathers-nedb');
const createModel = require('../../models/sequelise.model');
const hooks = require('./sequelise.hooks');
const Sequelize = require('sequelize');
const sequelize = new Sequelize('datawarehouse', 'root', 'root',
  {
    host: 'localhost', 
    dialect:'mysql',
    logging: false,
    pool: {
      max: 30,
      min: 0,
      acquire: 120000,
      idle:120000,
      evict: 120000
    },
    operatorsAliases: false
  });

  const Country = sequelize.define('dim_country', {
    name: { type: Sequelize.STRING, allowNull: false, unique: true }
  });
  const Client = sequelize.define('dim_client', {
    id: { type: Sequelize.INTEGER, allowNull: false, primaryKey: true, unique: true},
    name: { type: Sequelize.STRING, allowNull: false }
  });
  const Vehicle = sequelize.define('vehicle', {
    id: { type: Sequelize.INTEGER, allowNull: false, primaryKey: true, unique: true},
    identification: { type: Sequelize.STRING, allowNull: false},
    inProductionDate: { type: Sequelize.STRING, allowNull: false},
    outProductionDate: { type: Sequelize.STRING, allowNull: true }
  });
  const Alerttype = sequelize.define('dim_alerttype', {
    id: { type: Sequelize.INTEGER, allowNull: false, primaryKey: true, unique: true},
    description: { type: Sequelize.STRING, allowNull: true },
    name: { type: Sequelize.STRING, allowNull: false, unique: true },
    environmental: { type: Sequelize.BOOLEAN, allowNull: false},
    blocking: { type: Sequelize.BOOLEAN, allowNull: false }
  });
  const Alert = sequelize.define('dim_alert', {
    timestamp: { type: Sequelize.STRING, allowNull: false },
    avgjobkey: { type: Sequelize.INTEGER, allowNull: false },
    x: { type: Sequelize.INTEGER, allowNull: false },
    y: { type: Sequelize.INTEGER, allowNull: false },
    speed: { type: Sequelize.INTEGER, allowNull: false },
    direction: { type: Sequelize.INTEGER, allowNull: false }      
  });
  const SpeedCategory = sequelize.define('dim_speedcategory', {
    name: { type: Sequelize.STRING, unique: true, allowNull: false },
    minimum: { type: Sequelize.INTEGER, allowNull: false },
    maximum: { type: Sequelize.INTEGER, allowNull: false}
  });

  Client.belongsTo(Country, {foreignKey: 'countryId'});
  Vehicle.belongsTo(Client, {foreignKey: 'customerId'});
  Alert.belongsTo(Alerttype);
  Alert.belongsTo(Vehicle), {foreignKey: 'vehicleId'};

async function addCountry(data, params) {

  let id;
  return await sequelize.sync()
  .then(function() {
    return Country.findOrCreate(
      { where: {
        name: data.name
      }})
  })
  .then(function(x) {
    id = x[0].dataValues.id;
    return id;
  });
}

async function addClient(data, params) {

  var country = {};
  country.name = data.customercountry;
  var countryId = await addCountry(country);

  await sequelize.sync()
  .then(() => Client.findOrCreate(
    { 
      where: {
        id: data.custid,
        name: data.customername,
        countryId: countryId
      }
    }
  ));
}

async function addVehicle(data, params) {

  await sequelize.sync()
  .then(() => Vehicle.findOrCreate({ where: {
    id: data.avgid,
    customerId: data.customerkey,
    identification: data.identification,
    inProductionDate: data.inproductiondate,
    outProductionDate: data.outproductiondate
  }}));
}

async function addAlertType(data, params) {

  await sequelize.sync()
  .then(() => Alerttype.findOrCreate({ where: {
    id: data.alertid,
    name: data.name,
    description: data.description,
    environmental: data.environmental,
    blocking: data.blocking
  }}));
}

async function getAlertType(alerttype, params) {

  let result;
  return await sequelize.sync()
  .then(() => Alerttype.findOne({ where: {
    name: alerttype,
  }}))
  .then(function(x) {
    result = x.dataValues;
    return result;
  });;
}

async function getAlertTypeById(id, params) {

  let result;
  return await sequelize.sync()
  .then(() => Alerttype.findOne({ where: {
    id: id,
  }}))
  .then(function(x) {
    result = x.dataValues;
    return result;
  });;
}

async function addSpeedCategory(data, params) {

  await sequelize.sync()
  .then(() => SpeedCategory.findOrCreate({ where: {
    name: data.name,
    minimum: data.minimum,
    maximum: data.maximum
  }}));
}

async function addAlert(data, params) {
  
  var alertTypeId = await getAlertType(data.alerttype);
  await sequelize.sync()
  .then(() => Alert.findOrCreate({ where: {
    timestamp: data.timestamp,
    vehicleId: data.vehicleId,
    avgjobkey: data.avgjobkey,
    x: data.x,
    y: data.y,
    direction: data.direction,
    speed: data.speed,
    dimAlerttypeId: alertTypeId.id
  }}));
}

async function getAllAlerts(data, params) {
  
  return await sequelize.sync()
  .then(() => Alert.findAll()
  .then(async function(elements) {
    var list = [];
    for(const element of elements) {
      alert = element.dataValues;
      var alertType = await getAlertTypeById(alert.dimAlerttypeId);
      //console.log(alertType);
      alert.name = alertType.name;
      alert.environmental = alertType.environmental;
      alert.blocking = alertType.blocking;
      list.push(alert);
      //console.log(list);
      //list;
    }
    return list;
  }));
  //.then((list) => console.log(list));
  //console.log(alertList);
}

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/sequelise', {

    async get(id, params) {

      var result;

      if(id === "alerts") {
        result = getAllAlerts();
      }

      return Promise.resolve(
        result
      );
    },

    async create(data, params) {

      if(data.type == "country") {
        await addCountry(data, params);
      }
      else if(data.type == "client") {
        await addClient(data, params);
      }

      else if(data.type == "vehicle") {
        await addVehicle(data, params);
      }

      else if(data.type == "alerttype") {
        await addAlertType(data, params);
      }

      else if(data.type == "speedtype") {
        await addSpeedCategory(data, params);
      }

      else if(data.type == "alert") {
        await addAlert(data, params);
      }

      else if(data.type == "sensortype") {
        await addSensorType(data, params);
      }

      else if(data.type == "sensorreading") {
        await addSensorReading(data, params);
      }

      else if(data.type == "location") {
        await addLocation(data, params);
      }

      else if(data.type == "movement") {
        await addMovement(data, params);
      }

      return Promise.resolve(true);

    }


  });

  // Get our initialized service so that we can register hooks
  const service = app.service('sequelise');

  service.hooks(hooks);
};
