import { PrismaClient } from '@prisma/client'
import { randomUUID } from 'node:crypto'

export async function createCategories(prisma: PrismaClient) {
  const categories = await prisma.category.createManyAndReturn({
    data: [
      {
        id: randomUUID(),
        department_id: '46cf920e-5287-4da5-bc1a-a0149906473d',
        name: 'Perfumes Femininos',
        description: 'Perfumes Femininos',
      },
      {
        id: randomUUID(),
        department_id: '46cf920e-5287-4da5-bc1a-a0149906473d',
        name: 'Perfumes Masculinos',
        description: 'Perfumes Masculinos',
      },
      {
        id: randomUUID(),
        department_id: '5a4e657f-4386-4a4c-80a5-f39c10395e41',
        name: 'Batons',
        description: 'Batons',
      },
      {
        id: randomUUID(),
        department_id: '5a4e657f-4386-4a4c-80a5-f39c10395e41',
        name: 'Sombras',
        description: 'Sombras',
      },
      {
        id: randomUUID(),
        department_id: '5a4e657f-4386-4a4c-80a5-f39c10395e41',
        name: 'Bases e Corretivos',
        description: 'Bases e Corretivos',
      },
      {
        id: randomUUID(),
        department_id: '5a4e657f-4386-4a4c-80a5-f39c10395e41',
        name: 'Pós Faciais',
        description: 'Pós Faciais',
      },
      {
        id: randomUUID(),
        department_id: '25efe165-0886-418c-92bc-6a2698eda421',
        name: 'Hidratantes Faciais',
        description: 'Hidratantes Faciais',
      },
      {
        id: randomUUID(),
        department_id: '25efe165-0886-418c-92bc-6a2698eda421',
        name: 'Hidratantes Corporais',
        description: 'Hidratantes Corporais',
      },
      {
        id: randomUUID(),
        department_id: '25efe165-0886-418c-92bc-6a2698eda421',
        name: 'Anti-Idade',
        description: 'Anti-Idade',
      },
      {
        id: randomUUID(),
        department_id: '25efe165-0886-418c-92bc-6a2698eda421',
        name: 'Protetor Solar',
        description: 'Protetor Solar',
      },
      {
        id: randomUUID(),
        department_id: '61f0a107-2bfd-4bfb-8dbd-cc00f68de705',
        name: 'Shampoos',
        description: 'Shampoos',
      },
      {
        id: randomUUID(),
        department_id: '61f0a107-2bfd-4bfb-8dbd-cc00f68de705',
        name: 'Condicionadores',
        description: 'Condicionadores',
      },
      {
        id: randomUUID(),
        department_id: '61f0a107-2bfd-4bfb-8dbd-cc00f68de705',
        name: 'Máscaras Capilares',
        description: 'Máscaras Capilares',
      },
      {
        id: randomUUID(),
        department_id: '61f0a107-2bfd-4bfb-8dbd-cc00f68de705',
        name: 'Óleos e Séruns',
        description: 'Óleos e Séruns',
      },
      {
        id: randomUUID(),
        department_id: '86a18219-b57e-47a8-87ba-bcb0a84ff86b',
        name: 'Sabonetes',
        description: 'Sabonetes',
      },
      {
        id: randomUUID(),
        department_id: '86a18219-b57e-47a8-87ba-bcb0a84ff86b',
        name: 'Desodorantes',
        description: 'Desodorantes',
      },
      {
        id: randomUUID(),
        department_id: '86a18219-b57e-47a8-87ba-bcb0a84ff86b',
        name: 'Pasta de Dentes',
        description: 'Pasta de Dentes',
      },
      {
        id: randomUUID(),
        department_id: '86a18219-b57e-47a8-87ba-bcb0a84ff86b',
        name: 'Fio Dental',
        description: 'Fio Dental',
      },
      {
        id: randomUUID(),
        department_id: '61f0a107-2bfd-4bfb-8dbd-cc00f68de705',
        name: 'Creme para Pentear',
        description: 'Creme para Pentear',
      },
      {
        id: randomUUID(),
        department_id: '25efe165-0886-418c-92bc-6a2698eda421',
        name: 'Cremes Anti-celulite',
        description: 'Cremes Anti-celulite',
      },
      {
        id: randomUUID(),
        department_id: '5a4e657f-4386-4a4c-80a5-f39c10395e41',
        name: 'Blushes',
        description: 'Blushes',
      },
      {
        id: randomUUID(),
        department_id: '5a4e657f-4386-4a4c-80a5-f39c10395e41',
        name: 'Máscaras para Cílios',
        description: 'Máscaras para Cílios',
      },
      {
        id: randomUUID(),
        department_id: '25efe165-0886-418c-92bc-6a2698eda421',
        name: 'Hidratantes Pós-barba',
        description: 'Hidratantes Pós-barba',
      },
    ],
  })

  return categories
}
