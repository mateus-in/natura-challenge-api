import { FastifySchema } from 'fastify'

export const paginateOrdersDocs: FastifySchema = {
  description: 'Retorna uma lista de pedidos paginada',
  tags: ['orders'],
  headers: {
    type: 'object',
    properties: {
      Authorization: { type: 'string' },
    },
    required: ['Authorization'],
  },
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
        orders: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              user: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  email: { type: 'string' },
                  name: { type: 'string' },
                },
              },
              items: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: { type: 'string' },
                    product: {
                      type: 'object',
                      properties: {
                        id: { type: 'string' },
                        name: { type: 'string' },
                        price: { type: 'number' },
                      },
                    },
                    price: { type: 'number' },
                    quantity: { type: 'number' },
                  },
                },
              },
              price: { type: 'number' },
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
