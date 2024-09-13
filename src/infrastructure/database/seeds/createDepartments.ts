import { PrismaClient } from '@prisma/client'

export async function createDepartments(prisma: PrismaClient) {
  await prisma.department.createMany({
    data: [
      {
        id: '46cf920e-5287-4da5-bc1a-a0149906473d',
        name: 'Perfumes',
        description: 'Perfumes femininos e masculinos',
      },
      {
        id: '5a4e657f-4386-4a4c-80a5-f39c10395e41',
        name: 'Maquiagem',
        description: 'Produtos de maquiagem',
      },
      {
        id: '25efe165-0886-418c-92bc-6a2698eda421',
        name: 'Cuidados com a Pele',
        description: 'Produtos para cuidados faciais e corporais',
      },
      {
        id: '61f0a107-2bfd-4bfb-8dbd-cc00f68de705',
        name: 'Cuidados com os Cabelos',
        description: 'Shampoos, condicionadores, tratamentos capilares',
      },
      {
        id: '86a18219-b57e-47a8-87ba-bcb0a84ff86b',
        name: 'Higiene Pessoal',
        description: 'Produtos para higiene pessoal',
      },
    ],
  })
}
