import { Check, X } from 'lucide-react'
import { ChoiceCard, MiniChoiceCard, type ChoiceCardOption } from '@/components/choice-card'

const bffOptions: Array<ChoiceCardOption<boolean>> = [
  {
    id: 'yes',
    value: true,
    label: 'I have a Backend For Frontend (BFF)',
    description: 'The application has a Backend For Frontend (BFF) that can handle OAuth Flow.',
    icon: <Check className="w-8 h-8 text-primary" />,
  },
  {
    id: 'no',
    value: false,
    label: 'I don\'t have a Backend For Frontend (BFF)',
    description: 'The application does not have a Backend For Frontend (BFF).',
    icon: <X className="w-8 h-8 text-primary" />,
  },
]

type BffChoiceProps = {
  onChange: (choice: boolean) => void
}

export function BffChoice({ onChange }: BffChoiceProps) {
  return (
    <div>
      <h3 className="text-lg sm:text-xl font-semibold mb-4">Do you have a Backend For Frontend?</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {bffOptions.map(option => (
          <ChoiceCard
            key={option.id}
            title={option.label}
            description={option.description}
            icon={option.icon}
            onClick={() => onChange(option.value)}
          />
        ))}
      </div>
    </div>
  )
}

type MiniBffChoiceCardProps = {
  className?: string
  bff: boolean
  onClick: () => void
}

export function MiniBffChoiceCard({ className, bff, onClick }: MiniBffChoiceCardProps) {
  const option = bffOptions.find(option => option.value === bff)
  if (!option) {
    return null
  }

  return (
    <MiniChoiceCard className={className} icon={option.icon} title={option.label} onClick={onClick} />
  )
}
