import { FastifySchema } from 'fastify'

export const fetchOrdersHistoryUserDocs: FastifySchema = {
  description: 'Retorna a lista de pedidos do usuário',
  tags: ['users'],
  headers: {
    type: 'object',
    properties: {
      Authorization: { type: 'string' },
    },
    required: ['Authorization'],
  },
  response: {
    200: {
      description: 'Lista de pedidos do usuário',
      type: 'array',
      items: {
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
