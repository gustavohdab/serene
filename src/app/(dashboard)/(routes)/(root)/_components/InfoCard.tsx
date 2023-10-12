import { LucideIcon } from 'lucide-react'

import IconBadge from '@/components/IconBadge'

type InfoCardProps = {
  variant?: 'default' | 'success'
  icon: LucideIcon
  label: string
  number: number
}

const InfoCard = ({ variant, icon: Icon, label, number }: InfoCardProps) => {
  return (
    <div className="flex items-center gap-x-2 rounded-md border p-3">
      <IconBadge variant={variant} icon={Icon} />
      <div className="">
        <p className="font-medium">{label}</p>
        <p className="text-sm text-gray-500">
          {number} {number === 1 ? 'course' : 'courses'}
        </p>
      </div>
    </div>
  )
}

export default InfoCard
