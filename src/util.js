'use strict';

const chalk = require('chalk');
const Sequelize = require('sequelize');

const lang = {
  errors: {
    validation: {
      message: 'Revise que todos los campos sean correctos',
      required: 'El campo es requerido',
      unique: 'Este valor ya fue registrado anteriormente'
    }
  },
  fields: {
    id: 'ID',
    nombre: 'Nombre',
    valor: 'Valor',
    label: 'Label',
    descripcion: 'Descripción'
  }
};

function getQuery (options = {}) {
  let query = {
    raw: true
  };

  if (options.limit) {
    query.limit = options.limit;
    if (options.page) {
      query.offset = (options.page - 1) * options.limit;
    }
  }

  if (options.order) {
    if (options.order.startsWith('-')) {
      query.order = [[options.order.substring(1), 'DESC']];
    } else {
      query.order = [[options.order, 'ASC']];
    }
  }

  return query;
}

const timestamps = {
  _user_created: {
    type: Sequelize.STRING(255),
    allowNull: false
  },
  _user_updated: {
    type: Sequelize.STRING(255)
  },
  _created_at: {
    type: Sequelize.DATE,
    allowNull: false,
    defaultValue: Sequelize.NOW
  },
  _updated_at: {
    type: Sequelize.DATE
  }
};

function setTimestamps (fields) {
  return Object.assign(fields, timestamps);
}

async function deleteItemModel (id, model) {
  const cond = {
    where: {
      id
    }
  };

  const item = await model.findOne(cond);

  if (item) {
    const deleted = await model.destroy(cond);
    return +!!deleted; //  Devuelve 1 si se eliminó correctamente y 0 si no se pudo eliminar
  }

  return -1; // Devuelve -1 si no se encontró el registro
}

function errorHandler (error) {
  if (error.errors) {
    let err = error.errors;
    let oError = {};
    for (let i in err) {
      let key = err[i].path;
      let type = err[i].type;
      let value = err[i].value;
      let message = '';

      if (['unique violation'].indexOf(type) !== -1) {
        if (type === 'unique violation') {
          message = `"${value}" ${lang.errors.validation.unique}`;
        } else {
          message = `${type}:${err[i].message}`;
        }

        if (oError[key]) {
          oError[key].err.push(message);
        } else {
          oError[key] = {
            'errors': [message]
          };
        }
        oError[key].label = lang.fields[key];
      } else {
        console.log('Error de Validación desconocida');
        throw new Error(error.message);
      }
    }
    if (Object.keys(oError).length) {
      throw new Error(lang.errors.validation.message + ':\n' + getText(oError));
    }
  }
  throw error;
}

function getText (oError) {
  let text = '';
  for (let key in oError) {
    text += '- ' + oError[key].label + ': ' + oError[key].errors.join(', ') + '.\n';
  }
  return text;
}

const config = {
  database: 'postgres',
  username: 'postgres',
  password: 'postgres',
  host: 'localhost'
};

function handleFatalError (err) {
  console.error(`${chalk.red('[fatal error]')} ${err.message}`);
  console.error(err.stack);
  process.exit(1);
}

module.exports = {
  getQuery,
  config,
  handleFatalError,
  setTimestamps,
  deleteItemModel,
  errorHandler
};
