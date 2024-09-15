import { FastifySchema } from 'fastify'

export const updateItemQuantityDocs: FastifySchema = {
  description: 'Atualiza a quantidade de itens de um produto do carrinho',
  tags: ['carts'],
  headers: {
    type: 'object',
    properties: {
      Authorization: { type: 'string' },
    },
    required: ['Authorization'],
  },
  body: {
    type: 'object',
    properties: {
      cartId: { type: 'string' },
      cartItemId: { type: 'string' },
      quantity: { type: 'string' },
    },
    required: ['cartId', 'cartItemId', 'quantity'],
  },
  response: {
    200: {
      description: 'Item atualizado com sucesso',
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
              quantity: { type: 'number' },
            },
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
