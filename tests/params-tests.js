'use strict';

const test = require('ava');
const { config, handleFatalError } = require('../src/util');
const Params = require('../');

let parametros;

test.beforeEach(async () => {
  if (!parametros) {
    parametros = await Params(config).catch(handleFatalError);
  }
});

test.serial('Parametro#createOrUpdate - new', async t => {
  const nuevoParametro = {
    nombre: `PARAM-TEST-${parseInt(Math.random() * 100000)}`,
    valor: 'algo aqui',
    label: 'TestLabel ',
    descripcion: 'Esta es una descripcion de test',
    _user_created: 1,
    _created_at: new Date()
  };
  let parametro = await parametros.createOrUpdate(nuevoParametro);

  test.idParametro2 = parametro.id;
  test.nombre = parametro.nombre;

  nuevoParametro.nombre = `PARAM-TEST-${parseInt(Math.random() * 100000)}`;
  parametro = await parametros.createOrUpdate(nuevoParametro);

  t.true(typeof parametro.id === 'number', 'Comprobando que el nuevo usuario tenga un id');
  t.is(parametro.nombre, nuevoParametro.nombre, 'Creando registro - nombre');
  t.is(parametro.valor, nuevoParametro.valor, 'Creando registro - valor');
  t.is(parametro.label, nuevoParametro.label, 'Creando registro - label');
  t.is(parametro.descripcion, nuevoParametro.descripcion, 'Creando registro - descripcion');

  test.idParametro = parametro.id;
});

test.serial('Parametro#findAll', async t => {
  let lista = await parametros.findAll();

  t.true(lista.count >= 2, 'Se tiene 2 registros en la bd');
});

test.serial('Parametro#findById', async t => {
  const id = test.idParametro;

  let parametro = await parametros.findById(id);

  t.is(parametro.id, id, 'Se recuperó el registro mediante un id');
});

test.serial('Parametro#findByName', async t => {
  let parametro = await parametros.findByName(test.nombre);

  t.is(parametro.nombre, test.nombre, 'Se recuperó el registro mediante un nombre');
});

test.serial('Parametro#getParam', async t => {
  let parametro = await parametros.getParam(test.nombre);

  t.is(parametro.nombre, test.nombre, 'Se recuperó el registro mediante un nombre');
});

test.serial('Parametro#createOrUpdate - exists', async t => {
  const newData = {
    id: test.idParametro,
    valor: 'Nuevo valor'
  };

  let parametro = await parametros.createOrUpdate(newData);

  t.is(parametro.valor, newData.valor, 'Actualizando registro usuario');
});

test.serial('Parametro#findAll#filter - nombre', async t => {
  let lista = await parametros.findAll({ nombre: 'PARAM-TEST' });

  t.is(lista.count, 2, 'Filtrando datos');
});

test.serial('Parametro#findAll#filter - valor', async t => {
  let lista = await parametros.findAll({ valor: 'Nuevo' });

  t.is(lista.count, 1, 'Filtrando datos');
});

test.serial('Parametro#Graphql - lista', async t => {
  let lista = await parametros.graphql.resolvers.Query.parametros(null, {}, { permissions: ['parametros:read'] });

  t.true(lista.count >= 2, 'Se tiene 2 registros en la bd');
});

test.serial('Parametro#delete', async t => {
  let deleted = await parametros.deleteItem(test.idParametro);
  deleted = await parametros.deleteItem(test.idParametro2);

  t.is(deleted, 1, 'Parametro eliminado');
});
