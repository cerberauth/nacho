import { AppWindowMac, Monitor, PanelTop, Server, SquareTerminal, TabletSmartphone, Tv } from 'lucide-react'
import { ApplicationType, applicationTypes } from '../../lib/consts'
import { ChoiceCard, ChoiceCardOption, MiniChoiceCard } from '@/components/choice-card'
import { ApplicationTypeIcon } from './application-type-icon'

type ApplicationTypeGridProps = {
  withUserInteraction: boolean
  onChange: (type: ApplicationType) => void
}

export function ApplicationTypeChoice({ withUserInteraction, onChange }: ApplicationTypeGridProps) {
  return (
    <>
      <h3 className="text-lg sm:text-xl font-semibold mb-4">What is the type of application?</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {applicationTypes.filter(option => option.withUserInteraction === withUserInteraction).map(option => (
          <ChoiceCard
            key={option.value}
            title={option.label}
            description={option.description}
            icon={<ApplicationTypeIcon type={option.value} />}
            onClick={() => onChange(option.value)}
            technologies={option.technologies}
          />
        ))}
      </div>
    </>
  )
}

type MiniApplicationTypeChosenCardProps = {
  className?: string
  applicationType: ApplicationType
  onClick: () => void
}

export function MiniApplicationTypeChosenCard({ className, applicationType, onClick }: MiniApplicationTypeChosenCardProps) {
  const option = applicationTypes.find(option => option.value === applicationType)
  if (!option) {
    return null
  }

  return (
    <MiniChoiceCard className={className} icon={<ApplicationTypeIcon type={applicationType} />} title={option.label || ''} onClick={onClick} />
  )
}
