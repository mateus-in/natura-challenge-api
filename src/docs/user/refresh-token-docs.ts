import { FastifySchema } from 'fastify'

export const refreshTokenDocs: FastifySchema = {
  description: 'Gera um novo token para o usuário',
  tags: ['users'],
  response: {
    200: {
      description: 'Token gerado com sucesso',
      type: 'object',
      properties: {
        token: { type: 'string' },
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
