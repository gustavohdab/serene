import { auth } from '@clerk/nextjs'
import { redirect } from 'next/navigation'

import Chart from './_components/Chart'
import DataCard from './_components/DataCard'

import { getAnalytics } from '@/actions/getAnalytics'

const AnalyticsPage = async () => {
  const { userId } = auth()

  if (!userId) return redirect('/')

  const { data, totalRevenue, totalSales } = await getAnalytics(userId)
  return (
    <div className="p-6">
      <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        <DataCard label="Total Sales" value={totalSales} />
        <DataCard label="Total Revenue" value={totalRevenue} shouldFormat />
      </div>
      <Chart data={data} />
    </div>
  )
}

export default AnalyticsPage
