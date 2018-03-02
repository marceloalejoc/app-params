'use strict';

const { setTimestamps } = require('./util');

module.exports = (sequelize, DataTypes) => {
  let fields = {
    id: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER
    },
    nombre: {
      type: DataTypes.STRING(100),
      unique: true,
      allowNull: false
    },
    valor: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    label: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    descripcion: {
      type: DataTypes.TEXT
    }
  };

  // Agregando campos para el log
  fields = setTimestamps(fields);

  let Parametros = sequelize.define('parametros', fields, {
    timestamps: false
  });

  return Parametros;
};
