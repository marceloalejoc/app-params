'use strict';

const defaults = require('defaults');
const Sequelize = require('sequelize');
const services = require('./src/services');
const Graphql = require('./src/graphql');

module.exports = async function (config) {
  config = defaults(config, {
    dialect: 'postgres',
    pool: {
      max: 10,
      min: 0,
      idle: 10000
    }
  });

  let sequelize = new Sequelize(config);

  // Cargando modelo
  const params = sequelize.import('src/model');

  // Verificando conexión con la BD
  await sequelize.authenticate();

  // Creando las tablas
  await sequelize.sync(config.force ? { force: true } : {});

  // Cargando los servicios de params
  let Services = services(params, Sequelize);
  Services.graphql = Graphql(Services);

  return Services;
};
