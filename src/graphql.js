'use strict';

const { GraphQLScalarType } = require('graphql');
const { Kind } = require('graphql/language');
const { permissions } = require('./util');

module.exports = Parametro => {
  const schemes = [`
    # Escalar tipo Fecha
    scalar DateP

    # Parametros del sistema
    type Parametro {
      # id del Parametro
      id: ID!
      # nombre del Parametro
      nombre: String!
      # valor del Parametro
      valor: String!
      # label del Parametro
      label: String!
      # descripcion del Parametro
      descripcion: String
      # Usuario que creo el registro
      _user_created: Int
      # Usuario que actualizó el registro
      _user_updated: Int
      # Fecha de creación del registro
      _created_at: DateP
      # Fecha de actualización del registro
      _updated_at: DateP
    }

    # Objeto para crear un Parametro
    input NewParametro {
      nombre: String!
      valor: String!
      label: String!
      descripcion: String
    }

    # Objeto para editar un Parametro
    input EditParametro {
      nombre: String
      valor: String
      label: String
      descripcion: String
    }

    # Objeto de paginación para Parametro
    type Parametros {
      count: Int
      rows: [Parametro]
    }

    # Objeto de respuesta de objeto eliminado
    type DeleteParametro {
      deleted: Boolean
    }
  `];

  const queries = {
    Query: `
      # Lista de parametros
      parametros(
        # Límite de la consulta para la paginación
        limit: Int,
        # Nro. de página para la paginación
        page: Int,
        # Campo a ordenar, "-campo" ordena DESC
        order: String,
        # Buscar por nombre de Parametro
        nombre: String
        # Buscar por el valor del Parametro
        valor: String
      ): Parametros
      # Obtener un parametro
      parametro(id: ID!): Parametro
      # Obtener un parámetro por nombre
      parametroBuscar(name: String!): Parametro
    `,
    Mutation: `
      # Agregar parametro
      parametroAdd(parametro: NewParametro!): Parametro
      # Editar parametro
      parametroEdit(id: ID!, parametro: EditParametro!): Parametro
      # Eliminar parametro
      parametroDelete(id: ID!): DeleteParametro
    `
  };

  // Cargando Resolvers
  const resolvers = {
    Query: {
      parametros: (_, args, context) => {
        permissions(context, 'parametros:read');

        return Parametro.findAll(args, context.id_rol);
      },
      parametro: (_, args, context) => {
        permissions(context, 'parametros:read');

        return Parametro.findById(args.id);
      },
      parametroBuscar: (_, args, context) => {
        permissions(context, 'parametros:read');

        return Parametro.getParam(args.name);
      }
    },
    Mutation: {
      parametroAdd: (_, args, context) => {
        permissions(context, 'parametros:create');

        args.parametro._user_created = context.id_usuario;
        return Parametro.createOrUpdate(args.parametro);
      },
      parametroEdit: (_, args, context) => {
        permissions(context, 'parametros:update');

        args.parametro._user_updated = context.id_usuario;
        args.parametro._updated_at = new Date();
        args.parametro.id = args.id;
        return Parametro.createOrUpdate(args.parametro);
      },
      parametroDelete: async (_, args, context) => {
        permissions(context, 'parametros:delete');

        let deleted = await Parametro.deleteItem(args.id);
        return { deleted };
      }
    },
    DateP: new GraphQLScalarType({
      name: 'DateP',
      description: 'DateP custom scalar type',
      parseValue (value) {
        return new Date(value); // value from the client
      },
      serialize (value) {
        // return moment(value).format('DD/MM/YYYY, h:mm a'); // value sent to the client
        return value;
      },
      parseLiteral (ast) {
        if (ast.kind === Kind.INT) {
          return parseInt(ast.value, 10); // ast value is always in string format
        }
        return null;
      }
    })
  };

  return {
    schemes,
    queries,
    resolvers
  };
};
