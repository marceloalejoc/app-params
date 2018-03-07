'use strict';

const { config, handleFatalError } = require('./src/util');
const Params = require('./');

async function setup () {
  const params = await Params(config).catch(handleFatalError);

  console.log('Services!', params);
  console.log('Success Params setup!');
  process.exit(0);
}
setup();
