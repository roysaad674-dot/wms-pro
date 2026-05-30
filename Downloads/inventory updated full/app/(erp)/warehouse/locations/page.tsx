export const revalidate = 30
import { prisma } from '@/lib/prisma'
import LocationsClient from './LocationsClient'

export default async function LocationsPage() {
  const locations = await prisma.location.findMany({
    orderBy: { name: 'asc' },
  })
  return <LocationsClient data={JSON.parse(JSON.stringify(locations))} />
}
