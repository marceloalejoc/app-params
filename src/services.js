'use strict';

const { getQuery, errorHandler, deleteItemModel } = require('./util');

module.exports = function paramsServices (parametros, Sequelize) {
  const Op = Sequelize.Op;

  function findAll (params = {}) {
    let query = getQuery(params);
    query.where = {};

    if (params.nombre) {
      query.where.nombre = {
        [Op.iLike]: `%${params.nombre}%`
      };
    }

    if (params.valor) {
      query.where.valor = {
        [Op.iLike]: `%${params.valor}%`
      };
    }

    if (params.parametros) {
      query.where.nombre = {
        [Op.or]: params.parametros
      };
    }

    return parametros.findAndCountAll(query);
  }

  function findById (id) {
    return parametros.findOne({
      where: {
        id
      }
    });
  }

  function getParam (param) {
    return findByName(param);
  }

  function findByName (nombre) {
    return parametros.findOne({
      where: {
        nombre
      }
    });
  }

  async function createOrUpdate (parametro) {
    const cond = {
      where: {
        id: parametro.id
      }
    };

    const item = await parametros.findOne(cond);

    if (item) {
      const updated = await parametros.update(parametro, cond);
      return updated ? parametros.findOne(cond) : item;
    }

    let result;
    try {
      result = await parametros.create(parametro);
    } catch (e) {
      errorHandler(e);
    }

    return result.toJSON();
  }

  async function deleteItem (id) {
    return deleteItemModel(id, parametros);
  }

  return {
    findAll,
    findById,
    findByName,
    deleteItem,
    createOrUpdate,
    getParam
  };
};
