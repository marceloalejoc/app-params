# Módulo params

Creación, búsqueda y listado de params registrandolo en una tabla con Sequelize, Postgresql y Graphql

## Requisitos
- Nodejs 7.6 en adelante

## Modo de uso

``` bash
# Instalando librería
npm install app-params --save
```

Instanciando el módulo params en un proyecto
``` js
const Params = require('app-params');
const config = {
  database: 'postgres',
  username: 'postgres',
  password: 'postgres',
  host: 'localhost'
};

// Para usar await debe estar dentro una función async
const params = await Params(config).catch(err => console.error(err));

// Obteniendo un parámetro por su nombre
const param = await params.getParam('PARAM');

// Lista completa de params, puede recibir parámetros de búsqueda entre otras opciones
const list = await params.findAll();
```

## Instalando Node.js v8.x para el modo desarrollo

NOTA.- Debian Wheezy no soporta Node 8

``` bash
# Para Ubuntu
curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
sudo apt-get install -y nodejs

# Para Debian, instalar como root
curl -sL https://deb.nodesource.com/setup_8.x | bash -
apt-get install -y nodejs
```

## Instalando el proyecto

Siga los siguientes pasos:

``` bash
# 1. Instalar dependencias
npm install

# 2. Correr test de prueba, configurar la conexión de la base de datos en el archivo src/util.js
npm test
```
