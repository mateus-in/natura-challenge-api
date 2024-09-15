import { FastifySchema } from 'fastify'

export const paginateProductsDocs: FastifySchema = {
  description: 'Retorna uma lista de produtos paginada',
  tags: ['products'],
  querystring: {
    type: 'object',
    properties: {
      skip: { type: 'string' },
      take: { type: 'string' },
      categoryId: { type: 'string' },
      departmentId: { type: 'string' },
    },
    required: [],
  },
  response: {
    200: {
      description: 'Lista paginada de produtos',
      type: 'object',
      properties: {
        products: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              name: { type: 'string' },
              description: { type: 'string' },
              price: { type: 'number' },
              stockQuantity: { type: 'number' },
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
