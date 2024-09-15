import { FastifySchema } from 'fastify'

export const paginateDepartmentsDocs: FastifySchema = {
  description: 'Retorna uma lista de departamentos paginada',
  tags: ['departments'],
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
      description: 'Lista paginada de departamentos',
      type: 'object',
      properties: {
        departments: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              name: { type: 'string' },
              description: { type: 'string' },
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
