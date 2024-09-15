import { FastifySchema } from 'fastify'

export const createProductDocs: FastifySchema = {
  description: 'Cria um novo produto',
  tags: ['products'],
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
      name: { type: 'string' },
      description: { type: 'string' },
      price: { type: 'number' },
      stockQuantity: { type: 'number' },
      categoryIds: { type: 'array', items: { type: 'string' } },
    },
    required: ['name', 'description', 'price', 'stockQuantity', 'categoryIds'],
  },
  response: {
    201: {
      description: 'Produto criado com sucesso',
      type: 'object',
      properties: {
        id: { type: 'string' },
        name: { type: 'string' },
        description: { type: 'string' },
        price: { type: 'number' },
        stockQuantity: { type: 'number' },
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
