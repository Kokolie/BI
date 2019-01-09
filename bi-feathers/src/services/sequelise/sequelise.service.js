// Initializes the `sequelise` service on path `/sequelise`
const createService = require('feathers-nedb');
const createModel = require('../../models/sequelise.model');
const hooks = require('./sequelise.hooks');
const Sequelize = require('sequelize');
const sequelize = new Sequelize('datawarehouse', 'root', 'root',
  {
    host: 'localhost', 
    dialect:'mysql',
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle:10000
    },
    operatorsAliases: false
  });

  const Country = sequelize.define('dim_country', {
    name: { type: Sequelize.STRING, allowNull: false }
  });
  const Client = sequelize.define('dim_client', {
    name: { type: Sequelize.STRING, allowNull: false }
  });
  const Vehicle = sequelize.define('vehicle', {
    model: { type: Sequelize.STRING, allowNull: false}
  });
  const Alerttype = sequelize.define('dim_alerttype', {
    description: Sequelize.STRING,
    name: { type: Sequelize.STRING, allowNull: false }
  });
  const Alert = sequelize.define('dim_alert', {
    timestamp: { type: Sequelize.DATE, allowNull: false }
  });
  const Sensortype = sequelize.define('dim_sensortype', {
    description: Sequelize.STRING,
    name: { type: Sequelize.STRING, allowNull: false }
  });
  const Sensorreading = sequelize.define('dim_sensorreading', {
    reading: { type: Sequelize.STRING, allowNull: false }
  });
  const Location = sequelize.define('dim_location', {

    location: Sequelize.STRING,
    x: { type: Sequelize.INTEGER, allowNull: false },
    y: { type: Sequelize.INTEGER, allowNull: false }
  });
  const Movement = sequelize.define('dim_movement', {
    speed: { type: Sequelize.DOUBLE, allowNull: false},
    direction: { type: Sequelize.INTEGER, allowNull: false }
  });

  Client.belongsTo(Country);
  Vehicle.belongsTo(Client);
  Alert.belongsTo(Alerttype);
  Alert.belongsTo(Vehicle);
  Sensorreading.belongsTo(Vehicle);
  Sensorreading.belongsTo(Sensortype);
  Vehicle.belongsTo(Location);
  Movement.belongsTo(Location, {foreignKey: 'originId'});
  Movement.belongsTo(Location, {foreignKey: 'destinationId'});
  Movement.belongsTo(Vehicle);

async addCountry(data, params) {

  sequelize.sync()
  .then(() => Country.create({
    name: data.name
  }));
}

async addClient(data, params) {

  sequelize.sync()
  .then(() => Client.create({
    name: data.name
  }));
}

async addVehicle(data, params) {

  sequelize.sync()
  .then(() => Vehicle.create({
    model: data.model
  }));
}

async addAlertType(data, params) {

  sequelize.sync()
  .then(() => Alerttype.create({
    name: data.name,
    description: data.description
  }));
}

async addAlert(data, params) {

  sequelize.sync()
  .then(() => Alert.create({
    timestamp: data.timestamp
  }));
}

async addSensorType(data, params) {

  sequelize.sync()
  .then(() => Sensortype.create({
    name: data.name,
    description: data.description
  }));
}

async addSensorReading(data, params) {

  sequelize.sync()
  .then(() => Sensorreading.create({
    reading: data.reading
  }));
}

async addLocation(data, params) {

  sequelize.sync()
  .then(() => Location.create({
    x: data.x,
    y: data.y,
    location: data.location
  }));
}

async addMovement(data, params) {

  sequelize.sync()
  .then(() => Movement.create({
    speed: data.speed,
    direction: data.direction
  }));
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

    async get(params) {

      var result;
      sequelize.sync()
      .then(() => Country.create({
        name: 'janedoe'
      }))
      .then(jane => {
        console.log(jane.toJSON());
      });      

      return Promise.resolve(
        result
      );
    },

    async create(data, params) {

      if(data.type == "country") {
        addCountry(data, params);
      }
      else if(data.type == "client") {
        addData(data, params);
      }

      else if(data.type == "vehicle") {
        addVehicle(data, params);
      }

      else if(data.type == "alerttype") {
        addAlertType(data, params);
      }

      else if(data.type == "alert") {
        addAlert(data, params);
      }

      else if(data.type == "sensortype") {
        addSensorType(data, params);
      }

      else if(data.type == "sensorreading") {
        addSensorReading(data, params);
      }

      else if(data.type == "location") {
        addLocation(data, params);
      }

      else if(data.type == "movement") {
        addMovement(data, params);
      }

      return Promise.resolve(true);

    }


  });

  // Get our initialized service so that we can register hooks
  const service = app.service('sequelise');

  service.hooks(hooks);
};
