import { FastifyDynamicSwaggerOptions } from '@fastify/swagger'

export const swaggerOptions: FastifyDynamicSwaggerOptions = {
  mode: 'dynamic',
  openapi: {
    info: {
      title: 'Natura Challenge API',
      description: 'Documentação da API do projeto Natura Challenge',
      version: '1.0.0',
    },
    tags: [
      { name: 'carts', description: 'Cart related end-points' },
      { name: 'categories', description: 'Category related end-points' },
      { name: 'departments', description: 'Department related end-points' },
      { name: 'orders', description: 'Orders related end-points' },
      { name: 'products', description: 'Product related end-points' },
      { name: 'users', description: 'User related end-points' },
    ],
  },
}
