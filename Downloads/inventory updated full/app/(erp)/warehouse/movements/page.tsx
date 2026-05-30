export const revalidate = 30
import { prisma } from '@/lib/prisma'
import MovementsClient from './MovementsClient'

export default async function MovementsPage() {
  const movements = await prisma.stockMovement.findMany({
    take: 200,
    orderBy: { createdAt: 'desc' },
    include: {
      product: { select: { name: true, sku: true, unit: true } },
      user: { select: { name: true } },
    },
  })
  return <MovementsClient data={JSON.parse(JSON.stringify(movements))} />
}
