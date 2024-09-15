import { FastifySchema } from 'fastify'

export const paginateCategoriesDocs: FastifySchema = {
  description: 'Retorna uma lista de categorias paginada',
  tags: ['categories'],
  querystring: {
    type: 'object',
    properties: {
      skip: { type: 'string' },
      take: { type: 'string' },
    },
    required: [],
  },
  response: {
    200: {
      description: 'Lista paginada de categorias',
      type: 'object',
      properties: {
        categories: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              name: { type: 'string' },
              description: { type: 'string' },
              department: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  name: { type: 'string' },
                  description: { type: 'string' },
                },
              },
            },
          },
        },
        pagination: {
          type: 'object',
          properties: {
            count: { type: 'number' },
            limit: { type: 'number' },
            currentPage: { type: 'number' },
            pagesCount: { type: 'number' },
          },
        },
      },
    },
    400: {
      description: 'Erro de validação de entrada',
      type: 'object',
      properties: {
        message: { type: 'string' },
        error: { type: 'string' },
      },
    },
    500: {
      description: 'Erro interno',
      type: 'object',
      properties: {
        message: { type: 'string' },
        error: { type: 'string' },
      },
    },
  },
}
